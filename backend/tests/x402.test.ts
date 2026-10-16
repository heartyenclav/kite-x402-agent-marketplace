import test from 'node:test';
import assert from 'node:assert/strict';
import { catalog } from '../src/agents/catalog.js';
import { runtime } from '../src/agents/runtime.js';
import { passportManager } from '../src/passport/session.js';

test('Agent Catalog initializes with 4 high-performance AI agents', () => {
  const agents = catalog.getAllAgents();
  assert.equal(agents.length >= 4, true);

  const auditor = catalog.getAgent('kite-solidity-auditor');
  assert.ok(auditor);
  assert.equal(auditor.category, 'security');
  assert.equal(auditor.priceUsd, 0.003);
});

test('Developer can register custom AI Agent into marketplace', () => {
  const newAgent = catalog.registerAgent({
    id: 'test-custom-agent',
    name: 'Custom Market Predictor',
    tagline: 'Predicts token volatility',
    description: 'Custom predictor micro-service',
    category: 'analytics',
    avatarEmoji: '📊',
    priceUsd: 0.005,
    payToAddress: '0x71C8343e393746677722F7885C6894b34F080094',
    tags: ['Prediction', 'ML'],
  });

  assert.equal(newAgent.id, 'test-custom-agent');
  assert.ok(catalog.getAgent('test-custom-agent'));
});

test('Agent Runtime executes domain-specific inference', async () => {
  const res = await runtime.executeInference({
    agentId: 'kite-solidity-auditor',
    prompt: 'Audit transferFrom reentrancy and unchecked arithmetic',
  });

  assert.equal(res.success, true);
  assert.ok(res.result.includes('Security Audit Report'));
  assert.ok(res.executionTimeMs >= 0);
  assert.equal(res.costUsd, 0.003);
});

test('Kite Passport manager enforces daily spending budget ceiling', () => {
  const wallet = '0x1111111111111111111111111111111111111111';
  passportManager.registerSession({
    walletAddress: wallet,
    sessionPublicKey: '0x2222222222222222222222222222222222222222',
    maxDailyBudgetUsd: 0.01, // 1 cent limit
    validUntil: Date.now() + 3600000,
    signature: '0xmock_sig',
  });

  // First deduction 0.004 -> succeeds
  const pass1 = passportManager.deductBudget(wallet, 0.004);
  assert.equal(pass1, true);

  // Second deduction 0.004 -> total 0.008 -> succeeds
  const pass2 = passportManager.deductBudget(wallet, 0.004);
  assert.equal(pass2, true);

  // Third deduction 0.004 -> total 0.012 > 0.01 -> rejected!
  const pass3 = passportManager.deductBudget(wallet, 0.004);
  assert.equal(pass3, false);
});
