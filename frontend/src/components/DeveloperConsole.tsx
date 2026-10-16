import React, { useState } from 'react';
import { PlusCircle, Code2, CheckCircle2 } from 'lucide-react';
import { AgentCategory } from '../types';

interface DeveloperConsoleProps {
  onAgentRegistered: () => void;
}

export const DeveloperConsole: React.FC<DeveloperConsoleProps> = ({ onAgentRegistered }) => {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<AgentCategory>('audit');
  const [pricePerCallUSD, setPricePerCallUSD] = useState('0.005');
  const [recipientAddress, setRecipientAddress] = useState('0x9aF447690f0E916F8C8a27d2BfD2895D31D56a81');
  const [capabilities, setCapabilities] = useState('Solidity, Slither, Echidna');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          tagline,
          description,
          category,
          pricePerCallUSD: parseFloat(pricePerCallUSD),
          recipientAddress,
          capabilities: capabilities.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        setSuccessMsg(`Agent "${name}" successfully registered into Kite AI Catalog!`);
        setName('');
        setTagline('');
        setDescription('');
        onAgentRegistered();
      }
    } catch (err: unknown) {
      console.error('Registration failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Registration Form */}
      <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white">Monetize Your Agent on Kite AI</h2>
          <p className="text-sm text-slate-400 mt-1">
            Register your autonomous agent endpoint and receive direct pieUSD micro-settlements per HTTP 402 query.
          </p>
        </div>

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Agent Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. MEV Arbitrage Sentinel"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AgentCategory)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50"
              >
                <option value="audit">Smart Contract Audit</option>
                <option value="defi">DeFi Strategies</option>
                <option value="analytics">Market Analytics</option>
                <option value="code">Code Generation</option>
                <option value="general">General Intelligence</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              One-line Tagline
            </label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Real-time sandwich and frontrunning path estimator"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Full Description & System Behavior
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of model fine-tuning, inputs accepted, and outputs generated..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Price Per Call (pieUSD)
              </label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                required
                value={pricePerCallUSD}
                onChange={(e) => setPricePerCallUSD(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 font-mono text-emerald-400 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Payout Address (Kite Chain)
              </label>
              <input
                type="text"
                required
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 font-mono text-slate-300 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
              Capabilities (comma-separated)
            </label>
            <input
              type="text"
              value={capabilities}
              onChange={(e) => setCapabilities(e.target.value)}
              placeholder="e.g. Flashloans, Curve v2, Vyper"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center space-x-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{isSubmitting ? 'Registering Agent...' : 'Register Agent into Marketplace'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Integration Guide Sidebar */}
      <div className="space-y-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-white font-bold text-sm">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span>Developer Integration (x402)</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Consume any Kite AI agent directly from your dApp or autonomous bot using standard HTTP fetch:
          </p>

          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`// 1. Initial Call (gets 402 challenge)
const res1 = await fetch(
  '/api/agents/solidity-auditor/query',
  { method: 'POST', body: JSON.stringify({ prompt }) }
);

// 2. Settle Micropayment
const challenge = JSON.parse(
  res1.headers.get('Payment-Required')
);
const payment = await kitePassport.settle(challenge);

// 3. Retry with settled header
const res2 = await fetch(
  '/api/agents/solidity-auditor/query',
  {
    headers: { 'Payment-Response': JSON.stringify(payment) },
    body: JSON.stringify({ prompt })
  }
);`}
          </pre>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
            Network Specifications
          </h4>
          <ul className="text-xs text-slate-400 space-y-2">
            <li className="flex justify-between">
              <span>Network</span>
              <span className="font-mono text-slate-200">Kite AI Testnet</span>
            </li>
            <li className="flex justify-between">
              <span>Chain ID</span>
              <span className="font-mono text-emerald-400">2368</span>
            </li>
            <li className="flex justify-between">
              <span>Settlement Token</span>
              <span className="font-mono text-slate-200">pieUSD</span>
            </li>
            <li className="flex justify-between">
              <span>Avg Latency</span>
              <span className="font-mono text-slate-200">&lt; 250ms</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
