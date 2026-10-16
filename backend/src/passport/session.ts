import { config } from '../config.js';

export interface PassportSessionGrant {
  walletAddress: string;
  sessionPublicKey: string;
  maxDailyBudgetUsd: number;
  spentTodayUsd: number;
  validUntil: number;
  signature: string;
}

class PassportManager {
  private sessions: Map<string, PassportSessionGrant> = new Map();

  public registerSession(grant: Omit<PassportSessionGrant, 'spentTodayUsd'>): PassportSessionGrant {
    const fullSession: PassportSessionGrant = {
      ...grant,
      spentTodayUsd: 0,
    };
    this.sessions.set(grant.walletAddress.toLowerCase(), fullSession);
    return fullSession;
  }

  public getSession(walletAddress: string): PassportSessionGrant | undefined {
    return this.sessions.get(walletAddress.toLowerCase());
  }

  public deductBudget(walletAddress: string, amountUsd: number): boolean {
    const session = this.sessions.get(walletAddress.toLowerCase());
    if (!session) return false;

    if (Date.now() > session.validUntil) return false;
    if (session.spentTodayUsd + amountUsd > session.maxDailyBudgetUsd) return false;

    session.spentTodayUsd = Number((session.spentTodayUsd + amountUsd).toFixed(4));
    return true;
  }

  public revokeSession(walletAddress: string): boolean {
    return this.sessions.delete(walletAddress.toLowerCase());
  }
}

export const passportManager = new PassportManager();
