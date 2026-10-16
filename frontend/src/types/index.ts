export type AgentCategory = 'audit' | 'defi' | 'analytics' | 'code' | 'general';

export interface AgentMetadata {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: AgentCategory;
  pricePerCallUSD: number;
  recipientAddress: string;
  avatarUrl?: string;
  capabilities: string[];
  totalCalls: number;
  rating: number;
  version: string;
}

export interface PaymentReceipt {
  paymentId: string;
  txHash: string;
  payer: string;
  recipient: string;
  amountPieUSD: string;
  timestamp: number;
  agentId: string;
  network: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  paymentReceipt?: PaymentReceipt;
  latencyMs?: number;
  x402Status?: 'pending' | 'challenged' | 'settled' | 'failed';
}

export interface KitePassportSession {
  userAddress: string;
  authorized: boolean;
  dailyBudgetCents: number;
  remainingCents: number;
  expiresAt: number;
  signature?: string;
}

export interface NetworkStatus {
  chainId: number;
  chainName: string;
  connected: boolean;
  pieUsdBalance: number;
}
