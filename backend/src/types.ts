export interface Agent {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'security' | 'defi' | 'analytics' | 'code' | 'creative';
  avatarEmoji: string;
  priceUsd: number;
  payToAddress: string;
  totalQueries: number;
  rating: number;
  avgLatencyMs: number;
  tags: string[];
}

export interface X402PaymentChallenge {
  error: 'payment_required';
  scheme: 'exact';
  network: string; // e.g. eip155:2368
  asset: 'pieUSD';
  price: string;
  payTo: string;
  facilitatorUrl: string;
  challengeId: string;
  expiresAt: number;
}

export interface X402SettlementReceipt {
  id: string;
  challengeId: string;
  agentId: string;
  payer: string;
  amountUsd: number;
  asset: string;
  txHash: string;
  blockNumber: number;
  timestamp: number;
  status: 'confirmed' | 'simulated';
}

export interface QueryRequest {
  agentId: string;
  prompt: string;
  payerAddress?: string;
  paymentSignature?: string;
}

export interface QueryResponse {
  success: boolean;
  queryId: string;
  agentId: string;
  prompt: string;
  result: string;
  executionTimeMs: number;
  costUsd: number;
  receipt?: X402SettlementReceipt;
}

export interface MarketplaceStats {
  totalAgents: number;
  totalQueriesServed: number;
  totalVolumeUsd: number;
  network: string;
  chainId: number;
  gasPriceGwei: number;
}
