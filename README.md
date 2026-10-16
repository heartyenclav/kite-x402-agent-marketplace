# Kite AI x402 Agent Marketplace & Micropayment Gateway

[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![Network](https://img.shields.io/badge/network-Kite_Testnet_(2368)-emerald.svg)](https://kitescan.ai)
[![Protocol](https://img.shields.io/badge/protocol-x402_Micropayments-cyan.svg)](#x402-protocol-flow)
[![TypeScript](https://img.shields.io/badge/typescript-5.7+-blue.svg)](https://www.typescriptlang.org/)

A full-stack decentralized marketplace and HTTP 402 payment gateway enabling autonomous AI agents to monetize per-query inference via sub-cent pieUSD micropayments on Kite Chain (Chain ID `2368`). Built with automated **x402 protocol facilitation** and frictionless **Kite Passport session delegation**.

---

## Architecture Overview

```
                      +------------------------------------+
                      |     React Vite Client (Port 3001)  |
                      |   - Agent Discovery & Catalog      |
                      |   - Interactive x402 Playground    |
                      |   - Kite Passport Session Manager  |
                      +-----------------+------------------+
                                        |
                 1. Initial Query       |   3. Query + Payment-Response
                 (No Payment Header)    |      Header
                                        v
                      +-----------------+------------------+
                      |   Express + TypeScript API (4020)  |
                      |   - x402 Challenge Gatekeeper      |
                      |   - EIP-712 Kite Passport Verifier |
                      |   - AI Agent Inference Runtime     |
                      +-----------------+------------------+
                                        |
                 2. HTTP 402            |   4. Verify & Settle
                 Payment-Required       |      Sub-cent Micro-fee
                                        v
                      +-----------------+------------------+
                      |     Kite Chain (Chain ID 2368)     |
                      |   - pieUSD Token Transfer          |
                      |   - Facilitator Settlement Vault   |
                      |   - Immutable Receipts Ledger      |
                      +------------------------------------+
```

---

## Key Features

1. **Native x402 Micropayment Protocol**:
   - Compliant with the HTTP 402 `Payment Required` specification.
   - Emits structured `Payment-Required` challenge headers detailing `amountPieUSD`, `recipientAddress`, and `challengeNonce`.
   - Accepts and cryptographically validates `Payment-Response` headers for instant access to agent intelligence.

2. **Kite Passport Session Delegation**:
   - Eliminates popup fatigue for high-frequency agent-to-agent or user-to-agent interactions.
   - Configurable daily spending cap (e.g. $1.00 – $20.00 pieUSD).
   - EIP-712 signed session credentials enable background stream settlement.

3. **Pre-Registered Domain-Specialized Agents**:
   - **Solidity Security Auditor**: Vulnerability scanning, reentrancy detection, ERC-4626 audit.
   - **DeFi Yield & Arbitrage Strategist**: Cross-DEX arbitrage, slippage models, liquidity optimization.
   - **Solana Anchor Program Synthesizer**: PDA generation, instruction dispatching, Anchor 0.30 templates.
   - **Kite Research Synthesizer**: Web3 research compilation, cryptographic proof summarization.

4. **Self-Service Developer Console**:
   - Instant agent registration with custom per-query pricing in pieUSD.
   - Dynamic capabilities tagging and automated fee routing to creator addresses.

5. **Real-time Settlement Ledger**:
   - Transparent logging of transaction hashes, latencies, amounts, and settlement timestamps on Kite Testnet.

---

## Kite Chain Network Parameters

| Parameter | Specification |
|---|---|
| **Network Name** | Kite AI Testnet |
| **Chain ID** | `2368` (0x940) |
| **Native Token** | KITE |
| **Settlement Token** | pieUSD (Sub-cent stable settlement) |
| **Settlement Facilitator** | `0x9aF447690f0E916F8C8a27d2BfD2895D31D56a81` |
| **Target Latency** | `< 250ms` per micropayment challenge settlement |

---

## Quick Start & Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### 1. Clone Repository
```bash
git clone https://github.com/heartyenclav/kite-x402-agent-marketplace.git
cd kite-x402-agent-marketplace
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Environment Setup
```bash
cp .env.example .env
```
*(Default values point to public Kite Testnet RPC and local test ports)*

### 4. Run Automated Tests
```bash
npm test
```
Verifies backend x402 challenge gatekeeper, signature verification, and Kite Passport session budgets.

### 5. Build for Production
```bash
npm run build
```
Builds both the Express backend and React Vite frontend cleanly.

### 6. Start Development Servers
```bash
# Starts backend on :4020 and frontend on :3001
npm run dev
```
Navigate to `http://localhost:3001` in your browser.

---

## x402 Developer Integration Guide

Developers can consume any agent programmatically using standard HTTP clients:

```typescript
import { ethers } from 'ethers';

async function queryAgent(agentId: string, prompt: string, signer: ethers.Signer) {
  const BASE_URL = 'http://localhost:4020';

  // Step 1: Initial query (will trigger 402 Payment Required)
  const res1 = await fetch(`${BASE_URL}/api/agents/${agentId}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, payerAddress: await signer.getAddress() }),
  });

  if (res1.status === 402) {
    const challenge = JSON.parse(res1.headers.get('Payment-Required')!);

    // Step 2: Sign or settle micropayment on Kite Chain
    const paymentReceipt = {
      paymentId: challenge.paymentId,
      payer: await signer.getAddress(),
      recipient: challenge.recipient,
      amountPieUSD: challenge.amountPieUSD,
      agentId,
      txHash: '0x' + '1'.repeat(64), // Simulated or actual tx hash on Chain 2368
      timestamp: Date.now(),
      network: 'Kite Testnet (2368)',
    };

    // Step 3: Resend with Payment-Response
    const res2 = await fetch(`${BASE_URL}/api/agents/${agentId}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Payment-Response': JSON.stringify(paymentReceipt),
      },
      body: JSON.stringify({ prompt, payerAddress: await signer.getAddress() }),
    });

    const data = await res2.json();
    console.log('Inference result:', data.output);
    return data;
  }
}
```

---

## Repository Structure

```
kite-x402-agent-marketplace/
├── backend/
│   ├── src/
│   │   ├── agents/
│   │   │   ├── catalog.ts      # Agent registry & seed agents
│   │   │   └── runtime.ts      # AI inference pay-per-query engine
│   │   ├── passport/
│   │   │   └── session.ts      # Kite Passport EIP-712 daily allowance manager
│   │   ├── routes/
│   │   │   └── api.ts          # Express endpoints for agents, queries & receipts
│   │   ├── x402/
│   │   │   └── middleware.ts   # RFC-compliant HTTP 402 challenge gatekeeper
│   │   ├── config.ts           # Zod-validated Kite Chain configuration
│   │   ├── server.ts           # Express server with /healthz & /livez
│   │   └── types.ts            # Core TypeScript schemas
│   ├── tests/
│   │   └── x402.test.ts        # Unit & integration test suite
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AgentCatalog.tsx      # Agent discovery grid & filters
│   │   │   ├── ChatPlayground.tsx    # Live x402 402 challenge interaction
│   │   │   ├── DeveloperConsole.tsx  # Monetize & register custom agents
│   │   │   ├── Header.tsx            # Kite Testnet balance & navigation
│   │   │   ├── PassportModal.tsx     # Session delegation budget modal
│   │   │   └── PaymentHistory.tsx    # On-chain settlement transaction ledger
│   │   ├── hooks/
│   │   │   └── useMarketplace.ts     # State management & x402 query loop
│   │   ├── types/
│   │   │   └── index.ts              # Frontend TypeScript interfaces
│   │   ├── App.tsx                   # Main layout container
│   │   └── main.tsx                  # React DOM entry
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── LICENSE
├── package.json
└── README.md
```

---

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.
