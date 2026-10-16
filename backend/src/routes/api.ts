import { Router, Request, Response } from 'express';
import { catalog } from '../agents/catalog.js';
import { runtime } from '../agents/runtime.js';
import { x402PaymentGate, AuthenticatedX402Request } from '../x402/middleware.js';
import { passportManager } from '../passport/session.js';
import { config } from '../config.js';
import { X402SettlementReceipt } from '../types.js';

export const apiRouter = Router();

const settlementLedger: X402SettlementReceipt[] = [];

// GET /api/agents - List all agents
apiRouter.get('/agents', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: catalog.getAllAgents(),
  });
});

// GET /api/agents/:id - Get specific agent
apiRouter.get('/agents/:id', (req: Request, res: Response) => {
  const agent = catalog.getAgent(req.params.id);
  if (!agent) {
    res.status(404).json({ success: false, error: 'Agent not found' });
    return;
  }
  res.json({ success: true, data: agent });
});

// POST /api/agents - Developer registers a new agent
apiRouter.post('/agents', (req: Request, res: Response) => {
  try {
    const { id, name, tagline, description, category, avatarEmoji, priceUsd, payToAddress, tags } = req.body;
    if (!id || !name || !priceUsd) {
      res.status(400).json({ success: false, error: 'Missing mandatory agent fields' });
      return;
    }

    const created = catalog.registerAgent({
      id,
      name,
      tagline: tagline || 'Custom community AI agent on Kite Chain',
      description: description || 'Third-party developer AI micro-service',
      category: category || 'analytics',
      avatarEmoji: avatarEmoji || '🤖',
      priceUsd: Number(priceUsd) || 0.002,
      payToAddress: payToAddress || config.payToAddress,
      tags: Array.isArray(tags) ? tags : ['Community', 'AI'],
    });

    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Registration failed' });
  }
});

// POST /api/agents/:agentId/query - Pay-per-query AI agent inference protected by x402
apiRouter.post(
  '/agents/:agentId/query',
  x402PaymentGate as any,
  async (req: AuthenticatedX402Request, res: Response) => {
    try {
      const { prompt, payerAddress } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ success: false, error: 'Prompt is required' });
        return;
      }

      const response = await runtime.executeInference(
        {
          agentId: req.params.agentId,
          prompt,
          payerAddress,
        },
        req.receipt,
      );

      if (req.receipt) {
        settlementLedger.unshift(req.receipt);
        if (settlementLedger.length > 50) settlementLedger.pop();
      }

      res.json(response);
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err instanceof Error ? err.message : 'Inference error',
      });
    }
  },
);

// GET /api/receipts - On-chain transaction ledger
apiRouter.get('/receipts', (_req: Request, res: Response) => {
  res.json({ success: true, data: settlementLedger });
});

// GET /api/stats - Global marketplace statistics
apiRouter.get('/stats', (_req: Request, res: Response) => {
  const agents = catalog.getAllAgents();
  const totalQueries = agents.reduce((acc, a) => acc + a.totalQueries, 0);
  const totalVolume = agents.reduce((acc, a) => acc + a.totalQueries * a.priceUsd, 0);

  res.json({
    success: true,
    data: {
      totalAgents: agents.length,
      totalQueriesServed: totalQueries,
      totalVolumeUsd: Number(totalVolume.toFixed(2)),
      network: config.kiteNetwork,
      chainId: config.kiteChainId,
      gasPriceGwei: 0.15,
    },
  });
});

// POST /api/passport/session - Authorize session delegation
apiRouter.post('/passport/session', (req: Request, res: Response) => {
  try {
    const { walletAddress, sessionPublicKey, maxDailyBudgetUsd, validUntil, signature } = req.body;
    if (!walletAddress || !sessionPublicKey || !signature) {
      res.status(400).json({ success: false, error: 'Missing mandatory session parameters' });
      return;
    }

    const session = passportManager.registerSession({
      walletAddress,
      sessionPublicKey,
      maxDailyBudgetUsd: Number(maxDailyBudgetUsd) || 5.0,
      validUntil: Number(validUntil) || Date.now() + 86400000,
      signature,
    });

    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, error: err instanceof Error ? err.message : 'Session error' });
  }
});

// GET /api/passport/session/:address - Check session status
apiRouter.get('/passport/session/:address', (req: Request, res: Response) => {
  const session = passportManager.getSession(req.params.address);
  res.json({ success: true, data: session || null });
});

// DELETE /api/passport/session/:address - Revoke session
apiRouter.delete('/passport/session/:address', (req: Request, res: Response) => {
  const removed = passportManager.revokeSession(req.params.address);
  res.json({ success: true, revoked: removed });
});
