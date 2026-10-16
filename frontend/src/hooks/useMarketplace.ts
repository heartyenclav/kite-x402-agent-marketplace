import { useState, useEffect, useCallback } from 'react';
import { AgentMetadata, ChatMessage, PaymentReceipt, KitePassportSession } from '../types';

const DEFAULT_USER_WALLET = '0x71C8360d2Fe63b210fA6d75Eae07F6718Ec2E146';

export function useMarketplace() {
  const [agents, setAgents] = useState<AgentMetadata[]>([]);
  const [activeAgent, setActiveAgent] = useState<AgentMetadata | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [passport, setPassport] = useState<KitePassportSession>({
    userAddress: DEFAULT_USER_WALLET,
    authorized: false,
    dailyBudgetCents: 500, // $5.00
    remainingCents: 500,
    expiresAt: Date.now() + 86400 * 1000,
  });
  const [userBalance, setUserBalance] = useState(25.50); // 25.50 pieUSD testnet
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);

  // Load agent catalog
  const refreshAgents = useCallback(async () => {
    try {
      const res = await fetch('/api/agents');
      if (res.ok) {
        const data = await res.json();
        setAgents(data);
        if (!activeAgent && data.length > 0) {
          setActiveAgent(data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load agents from API:', err);
    }
  }, [activeAgent]);

  // Load payment receipts
  const refreshReceipts = useCallback(async () => {
    try {
      const res = await fetch('/api/receipts');
      if (res.ok) {
        const data = await res.json();
        setReceipts(data);
      }
    } catch (err) {
      console.error('Failed to load receipts:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshAgents();
    refreshReceipts();
  }, [refreshAgents, refreshReceipts]);

  // Execute x402 Query
  const sendQuery = async (prompt: string) => {
    if (!activeAgent || !prompt.trim() || isLoading) return;

    const userMsgId = 'msg_' + Date.now();
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const startTime = performance.now();

    try {
      // 1. Initial attempt without payment header to elicit HTTP 402 or check Passport
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (passport.authorized && passport.remainingCents >= activeAgent.pricePerCallUSD * 100) {
        headers['X-Kite-Passport-Payer'] = passport.userAddress;
        headers['X-Kite-Passport-Sig'] = passport.signature || 'mock_passport_valid_sig';
      }

      let res = await fetch(`/api/agents/${activeAgent.id}/query`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt, payerAddress: passport.userAddress }),
      });

      // 2. If 402 Payment Required returned:
      if (res.status === 402) {
        const challengeHeader = res.headers.get('Payment-Required');
        let challenge = null;
        try {
          challenge = challengeHeader ? JSON.parse(challengeHeader) : await res.json();
        } catch {
          challenge = await res.json();
        }

        // Simulate seamless micro-payment transaction sign & settle on Kite Chain
        const paymentPayload = {
          paymentId: challenge.paymentId || ('pay_' + Math.random().toString(36).substring(2, 9)),
          payer: passport.userAddress,
          recipient: challenge.recipient || activeAgent.recipientAddress,
          amountPieUSD: challenge.amountPieUSD || activeAgent.pricePerCallUSD.toString(),
          agentId: activeAgent.id,
          txHash: '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          timestamp: Date.now(),
          network: 'Kite Testnet (2368)',
        };

        // Re-send with Payment-Response authorization header
        headers['Payment-Response'] = JSON.stringify(paymentPayload);

        res = await fetch(`/api/agents/${activeAgent.id}/query`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ prompt, payerAddress: passport.userAddress }),
        });
      }

      const elapsed = Math.round(performance.now() - startTime);

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: ChatMessage = {
          id: 'msg_' + Date.now(),
          role: 'assistant',
          content: data.output || data.result || 'Agent completed execution successfully.',
          timestamp: Date.now(),
          latencyMs: elapsed,
          paymentReceipt: data.receipt,
          x402Status: 'settled',
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Deduct balance
        setUserBalance((prev) => Math.max(0, Number((prev - activeAgent.pricePerCallUSD).toFixed(4))));

        if (passport.authorized) {
          setPassport((prev) => ({
            ...prev,
            remainingCents: Math.max(0, prev.remainingCents - Math.round(activeAgent.pricePerCallUSD * 100)),
          }));
        }

        refreshReceipts();
      } else {
        const errData = await res.json();
        const errorMsg: ChatMessage = {
          id: 'msg_' + Date.now(),
          role: 'assistant',
          content: `⚠️ Error (${res.status}): ${errData.error || 'Failed to settle query'}`,
          timestamp: Date.now(),
          x402Status: 'failed',
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (err: unknown) {
      const errorMsg: ChatMessage = {
        id: 'msg_' + Date.now(),
        role: 'assistant',
        content: `Connection error: ${(err as Error).message}`,
        timestamp: Date.now(),
        x402Status: 'failed',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle or configure Passport
  const authorizePassport = (budgetCents: number) => {
    setPassport({
      userAddress: DEFAULT_USER_WALLET,
      authorized: true,
      dailyBudgetCents: budgetCents,
      remainingCents: budgetCents,
      expiresAt: Date.now() + 86400 * 1000,
      signature: '0x' + Array.from({ length: 130 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    });
    setIsPassportModalOpen(false);
  };

  const revokePassport = () => {
    setPassport((prev) => ({
      ...prev,
      authorized: false,
      signature: undefined,
    }));
  };

  return {
    agents,
    activeAgent,
    setActiveAgent,
    messages,
    receipts,
    isLoading,
    passport,
    userBalance,
    isPassportModalOpen,
    setIsPassportModalOpen,
    sendQuery,
    authorizePassport,
    revokePassport,
    refreshAgents,
    refreshReceipts,
  };
}
