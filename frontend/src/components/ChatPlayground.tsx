import React, { useState, useRef, useEffect } from 'react';
import { AgentMetadata, ChatMessage } from '../types';
import { Send, Bot, User, CheckCircle2, AlertCircle, ArrowUpRight, Cpu } from 'lucide-react';

interface ChatPlaygroundProps {
  activeAgent: AgentMetadata | null;
  agents: AgentMetadata[];
  onSelectAgent: (agent: AgentMetadata) => void;
  messages: ChatMessage[];
  isLoading: boolean;
  onSendQuery: (prompt: string) => void;
}

export const ChatPlayground: React.FC<ChatPlaygroundProps> = ({
  activeAgent,
  agents,
  onSelectAgent,
  messages,
  isLoading,
  onSendQuery,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendQuery(input.trim());
    setInput('');
  };

  const samplePrompts: Record<string, string[]> = {
    'solidity-auditor': [
      'Audit this contract: contract Vault { mapping(address => uint) public balances; function withdraw() external { (bool s,) = msg.sender.call{value: balances[msg.sender]}(""); balances[msg.sender] = 0; } }',
      'Explain reentrancy vulnerability patterns in ERC-4626 tokenized vaults.',
    ],
    'defi-strategist': [
      'Analyze optimal arbitrage paths between Uniswap v3 and Kite DEX liquidity pools.',
      'What are the risk factors for concentrated liquidity provisioning in volatile pairs?',
    ],
    'anchor-generator': [
      'Generate an Anchor program with an initialization instruction and a counter increment instruction.',
      'How to safely handle PDA seeds and account constraints in Anchor 0.30?',
    ],
    'research-synthesizer': [
      'Synthesize recent developments in x402 payment facilitation and sub-cent on-chain gas costs.',
      'Compare Kite Chain execution guarantees with other EVM layer-1s.',
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
      {/* Sidebar: Agents selector */}
      <div className="hidden lg:flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl p-4 overflow-y-auto space-y-2">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
          Select Agent
        </h3>
        {agents.map((ag) => (
          <button
            key={ag.id}
            onClick={() => onSelectAgent(ag)}
            className={`w-full text-left p-3 rounded-xl transition-all border ${
              activeAgent?.id === ag.id
                ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-xs text-slate-200 truncate">{ag.name}</span>
              <span className="font-mono text-[10px] text-emerald-400">${ag.pricePerCallUSD}</span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-1">{ag.tagline}</p>
          </button>
        ))}
      </div>

      {/* Main Chat Interface */}
      <div className="lg:col-span-3 flex flex-col bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-sm text-white">{activeAgent?.name || 'No Agent Selected'}</h2>
                <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-full border border-slate-700">
                  Chain 2368
                </span>
              </div>
              <p className="text-xs text-slate-400">{activeAgent?.tagline}</p>
            </div>
          </div>

          {activeAgent && (
            <div className="flex items-center space-x-2 text-xs">
              <div className="px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-800/30 font-mono text-emerald-400">
                Fee: ${activeAgent.pricePerCallUSD} pieUSD
              </div>
            </div>
          )}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-emerald-400 shadow-inner">
                <Cpu className="w-7 h-7" />
              </div>
              <div className="max-w-md space-y-1">
                <h3 className="font-semibold text-white text-base">Ready for x402 Micropayment Query</h3>
                <p className="text-xs text-slate-400">
                  Every query triggers an automated HTTP 402 challenge settled on Kite Chain in sub-second latency.
                </p>
              </div>

              {/* Sample Prompts */}
              {activeAgent && samplePrompts[activeAgent.id] && (
                <div className="w-full max-w-lg space-y-2 text-left pt-4">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Quick test prompts:
                  </span>
                  {samplePrompts[activeAgent.id].map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSendQuery(prompt)}
                      className="w-full p-2.5 text-xs text-slate-300 bg-slate-800/60 hover:bg-slate-800 hover:text-white border border-slate-700/60 rounded-xl transition-all text-left flex items-center justify-between group"
                    >
                      <span className="truncate">{prompt}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                  {/* Payment Receipt Badge */}
                  {msg.paymentReceipt && (
                    <div className="mt-3 pt-2.5 border-t border-slate-700/50 flex flex-wrap items-center gap-2 text-[11px] font-mono text-emerald-400">
                      <span className="inline-flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>x402 Settled</span>
                      </span>
                      <span className="text-slate-500">&bull;</span>
                      <span className="text-slate-300">
                        Tx: {msg.paymentReceipt.txHash.slice(0, 8)}...{msg.paymentReceipt.txHash.slice(-6)}
                      </span>
                      <span className="text-slate-500">&bull;</span>
                      <span className="text-slate-400">{msg.latencyMs}ms</span>
                    </div>
                  )}

                  {msg.x402Status === 'failed' && (
                    <div className="mt-2 flex items-center space-x-1 text-red-400 text-xs">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Payment challenge failed</span>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl rounded-tl-none p-4 text-xs text-slate-300 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                  <span className="font-mono text-emerald-400 font-semibold">Handling HTTP 402 Micropayment Challenge...</span>
                </div>
                <p className="text-slate-400 text-[11px]">Signing payload &middot; Settling on Kite Chain (Chain ID 2368)</p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || !activeAgent}
            placeholder={
              activeAgent
                ? `Ask ${activeAgent.name} (sub-cent micro-fee: $${activeAgent.pricePerCallUSD} pieUSD)...`
                : 'Select an agent first...'
            }
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !activeAgent}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-semibold rounded-xl text-sm transition-all flex items-center space-x-1.5"
          >
            <span>Execute</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
