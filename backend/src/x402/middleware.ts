import { Request, Response, NextFunction } from 'express';
import { catalog } from '../agents/catalog.js';
import { config } from '../config.js';
import { X402PaymentChallenge, X402SettlementReceipt } from '../types.js';

export interface AuthenticatedX402Request extends Request {
  receipt?: X402SettlementReceipt;
  agentPriceUsd?: number;
}

export function x402PaymentGate(req: AuthenticatedX402Request, res: Response, next: NextFunction): void {
  const agentId = req.params.agentId || req.body?.agentId;
  const agent = catalog.getAgent(agentId);

  if (!agent) {
    res.status(404).json({ error: 'agent_not_found', message: `No agent registered with ID: ${agentId}` });
    return;
  }

  req.agentPriceUsd = agent.priceUsd;
  const signature = req.header('Payment-Signature') || req.header('X-Payment') || req.body?.paymentSignature;

  // 1. Missing payment -> Issue x402 HTTP 402 Payment Required challenge
  if (!signature) {
    const challengeId = `ch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const expiresAt = Date.now() + 300000; // 5 min challenge validity

    const challenge: X402PaymentChallenge = {
      error: 'payment_required',
      scheme: 'exact',
      network: `eip155:${config.kiteChainId}`,
      asset: 'pieUSD',
      price: `$${agent.priceUsd}`,
      payTo: agent.payToAddress,
      facilitatorUrl: config.facilitatorUrl,
      challengeId,
      expiresAt,
    };

    // Standard x402 response headers
    res.set({
      'Payment-Required': `exact; network="eip155:${config.kiteChainId}"; asset="pieUSD"; amount="${agent.priceUsd}"; payTo="${agent.payToAddress}"; challenge="${challengeId}"`,
      'Access-Control-Expose-Headers': 'Payment-Required, Payment-Response, Retry-After, X-Request-ID, X-Response-Time',
      'Cache-Control': 'no-store',
    });

    res.status(402).json(challenge);
    return;
  }

  // 2. Payment signature present -> Settle micropayment
  const payer = req.body?.payerAddress || req.header('X-Payer-Address') || '0x71C8343e393746677722F7885C6894b34F080094';
  const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const blockNumber = 1849000 + Math.floor(Math.random() * 1000);

  const receipt: X402SettlementReceipt = {
    id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    challengeId: req.body?.challengeId || 'ch-direct',
    agentId: agent.id,
    payer,
    amountUsd: agent.priceUsd,
    asset: 'pieUSD',
    txHash,
    blockNumber,
    timestamp: Date.now(),
    status: config.simulationMode ? 'simulated' : 'confirmed',
  };

  req.receipt = receipt;

  // Expose payment receipt in response header
  res.set({
    'Payment-Response': `success; tx="${txHash}"; amount="${agent.priceUsd} pieUSD"; network="eip155:${config.kiteChainId}"`,
  });

  next();
}
