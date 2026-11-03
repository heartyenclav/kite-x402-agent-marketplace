export interface AgentPerformanceStats {
  agentId: string;
  successfulQueries: number;
  failedQueries: number;
  totalLatencyMs: number;
}

export class AgentReputationScorer {
  public static calculateReliabilityScore(stats: AgentPerformanceStats): number {
    const total = stats.successfulQueries + stats.failedQueries;
    if (total === 0) return 1.0;
    const successRatio = stats.successfulQueries / total;
    const avgLatency = stats.totalLatencyMs / Math.max(1, stats.successfulQueries);
    const latencyPenalty = Math.min(0.3, (avgLatency / 5000) * 0.3);
    return Math.max(0.1, Number((successRatio * 0.7 + (1 - latencyPenalty) * 0.3).toFixed(3)));
  }
}
