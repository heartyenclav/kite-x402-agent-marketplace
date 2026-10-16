import React from 'react';
import { ShieldCheck, Zap, Wallet } from 'lucide-react';
import { KitePassportSession } from '../types';

interface HeaderProps {
  passport: KitePassportSession;
  userBalance: number;
  onOpenPassport: () => void;
  activeTab: 'marketplace' | 'playground' | 'developer' | 'history';
  setActiveTab: (tab: 'marketplace' | 'playground' | 'developer' | 'history') => void;
}

export const Header: React.FC<HeaderProps> = ({
  passport,
  userBalance,
  onOpenPassport,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Network */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Zap className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">Kite AI</span>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 font-medium px-2 py-0.5 rounded-full border border-emerald-500/30">
                  x402 Gateway
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Sub-cent autonomous agent micropayments
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'marketplace'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              Agent Catalog
            </button>
            <button
              onClick={() => setActiveTab('playground')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'playground'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              Interactive x402
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              Settlement Ledger
            </button>
            <button
              onClick={() => setActiveTab('developer')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'developer'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              Register Agent
            </button>
          </nav>

          {/* Wallet & Passport Status */}
          <div className="flex items-center space-x-3">
            {/* Network Badge */}
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300 font-mono">Chain 2368</span>
            </div>

            {/* Balance */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-sm">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="font-mono font-semibold text-white">{userBalance.toFixed(2)}</span>
              <span className="text-xs text-emerald-400 font-semibold">pieUSD</span>
            </div>

            {/* Kite Passport Delegation */}
            <button
              onClick={onOpenPassport}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                passport.authorized
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/30 hover:brightness-110'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${passport.authorized ? 'text-white' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">
                {passport.authorized ? `Passport: $${(passport.remainingCents / 100).toFixed(2)}` : 'Connect Passport'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
