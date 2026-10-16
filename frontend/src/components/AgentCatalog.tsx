import React, { useState } from 'react';
import { AgentMetadata, AgentCategory } from '../types';
import { Shield, TrendingUp, BarChart3, Code2, Bot, Sparkles, ArrowRight, Star } from 'lucide-react';

interface AgentCatalogProps {
  agents: AgentMetadata[];
  onSelectAgent: (agent: AgentMetadata) => void;
}

const CATEGORY_ICONS: Record<AgentCategory, React.ReactNode> = {
  audit: <Shield className="w-4 h-4 text-emerald-400" />,
  defi: <TrendingUp className="w-4 h-4 text-cyan-400" />,
  analytics: <BarChart3 className="w-4 h-4 text-purple-400" />,
  code: <Code2 className="w-4 h-4 text-amber-400" />,
  general: <Bot className="w-4 h-4 text-blue-400" />,
};

export const AgentCatalog: React.FC<AgentCatalogProps> = ({ agents, onSelectAgent }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAgents = agents.filter((agent) => {
    const matchesCat = selectedCategory === 'all' || agent.category === selectedCategory;
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kite AI Testnet (Chain ID 2368) Live</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Autonomous AI Agent Marketplace with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">x402 Protocol</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Query verified domain-specialized AI agents paying sub-cent micro-fees in pieUSD. Zero subscriptions, zero API keys to manage—true HTTP 402 stream settlement powered by Kite Passport session delegation.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800 w-full sm:w-auto">
          {['all', 'audit', 'defi', 'analytics', 'code'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search agents or tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all duration-200 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-950/20"
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-xl shadow-inner group-hover:border-emerald-500/40 transition-colors">
                    {CATEGORY_ICONS[agent.category] || <Bot className="w-6 h-6 text-emerald-400" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">{agent.tagline}</p>
                  </div>
                </div>

                {/* Price Tag */}
                <div className="text-right">
                  <div className="inline-flex items-baseline space-x-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                    <span className="font-mono text-sm font-bold">${agent.pricePerCallUSD}</span>
                    <span className="text-[10px] text-slate-400 uppercase">/ call</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-sm leading-relaxed line-clamp-2">
                {agent.description}
              </p>

              {/* Capabilities */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {agent.capabilities.map((cap, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono bg-slate-800/80 text-slate-400 px-2 py-0.5 rounded-md border border-slate-700/50"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer with stats and CTA */}
            <div className="pt-6 mt-6 border-t border-slate-800/60 flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-medium text-slate-300">{agent.rating}</span>
                </span>
                <span>{agent.totalCalls} queries</span>
              </div>

              <button
                onClick={() => onSelectAgent(agent)}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/10 active:scale-95"
              >
                <span>Launch Query</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
