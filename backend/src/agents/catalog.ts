import { Agent } from '../types.js';
import { config } from '../config.js';

class AgentCatalog {
  private agents: Map<string, Agent> = new Map();

  constructor() {
    this.seedDefaultAgents();
  }

  private seedDefaultAgents() {
    const defaults: Agent[] = [
      {
        id: 'kite-solidity-auditor',
        name: 'Solidity & EVM Auditor',
        tagline: 'Automated vulnerability scanner, reentrancy detector & gas optimizer',
        description: 'Analyzes smart contracts for reentrancy vectors, access control flaws, unchecked external calls, and Kite Chain EVM opcode optimizations.',
        category: 'security',
        avatarEmoji: '🛡️',
        priceUsd: 0.003,
        payToAddress: config.payToAddress,
        totalQueries: 1420,
        rating: 4.9,
        avgLatencyMs: 380,
        tags: ['EVM', 'Security', 'Audit', 'Gas-Optimization'],
      },
      {
        id: 'defi-yield-strategist',
        name: 'DeFi Yield & Arbitrage Strategist',
        tagline: 'Realtime multi-DEX liquidity spread scanner and flash route planner',
        description: 'Scans KiteSwap, Camelot, and Uniswap liquidity pools, formulating atomic routing strategies with minimum slippage constraints.',
        category: 'defi',
        avatarEmoji: '⚡',
        priceUsd: 0.002,
        payToAddress: config.payToAddress,
        totalQueries: 2840,
        rating: 4.8,
        avgLatencyMs: 240,
        tags: ['DeFi', 'Arbitrage', 'KiteSwap', 'Flashloans'],
      },
      {
        id: 'kite-research-synthesizer',
        name: 'Kite AI Ecosystem Intelligence',
        tagline: 'Developer velocity, grant tracking & on-chain network analytics',
        description: 'Synthesizes GitHub developer metrics, active commit patterns, ecosystem grant milestones, and token circulation on the Kite AI network.',
        category: 'analytics',
        avatarEmoji: '🧠',
        priceUsd: 0.001,
        payToAddress: config.payToAddress,
        totalQueries: 930,
        rating: 4.9,
        avgLatencyMs: 190,
        tags: ['Ecosystem', 'Developer-Metrics', 'Grants', 'Analytics'],
      },
      {
        id: 'anchor-program-synthesizer',
        name: 'Anchor & CPI Code Synthesizer',
        tagline: 'High-speed Solana/Kite Anchor Rust program generator & test suite writer',
        description: 'Generates robust Anchor Rust instructions, zero-copy account structs, PDA seeds, and Mocha/Bun integration tests.',
        category: 'code',
        avatarEmoji: '🦀',
        priceUsd: 0.004,
        payToAddress: config.payToAddress,
        totalQueries: 1150,
        rating: 5.0,
        avgLatencyMs: 420,
        tags: ['Anchor', 'Rust', 'CPI', 'Smart-Contracts'],
      },
    ];

    defaults.forEach((a) => this.agents.set(a.id, a));
  }

  public getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  public getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  public registerAgent(agent: Omit<Agent, 'totalQueries' | 'rating' | 'avgLatencyMs'>): Agent {
    const newAgent: Agent = {
      ...agent,
      totalQueries: 0,
      rating: 5.0,
      avgLatencyMs: 250,
    };
    this.agents.set(newAgent.id, newAgent);
    return newAgent;
  }

  public recordQuery(agentId: string) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.totalQueries += 1;
    }
  }
}

export const catalog = new AgentCatalog();
