import React, { useState } from 'react';
import { ShieldCheck, X, Zap, Lock, AlertTriangle } from 'lucide-react';
import { KitePassportSession } from '../types';

interface PassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  passport: KitePassportSession;
  onAuthorize: (budgetCents: number) => void;
  onRevoke: () => void;
}

export const PassportModal: React.FC<PassportModalProps> = ({
  isOpen,
  onClose,
  passport,
  onAuthorize,
  onRevoke,
}) => {
  const [budgetUsd, setBudgetUsd] = useState('5.00');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Kite Passport Delegation</h3>
              <p className="text-xs text-slate-400">Autonomous session budget authorization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passport Concept explanation */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
            <Zap className="w-4 h-4" />
            <span>Frictionless Agent Interactions</span>
          </div>
          <p>
            Kite Passport allows you to set a daily spending cap for AI agent queries. Once authorized via EIP-712 signature, x402 micropayments will be settled automatically without wallet confirmation popups on every inference token!
          </p>
        </div>

        {/* Current Status */}
        {passport.authorized ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Session Status</span>
                <span className="font-semibold text-emerald-400 uppercase tracking-wider">Active</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Daily Allowance</span>
                <span className="font-mono text-white">${(passport.dailyBudgetCents / 100).toFixed(2)} pieUSD</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Remaining Today</span>
                <span className="font-mono text-emerald-300 font-bold">
                  ${(passport.remainingCents / 100).toFixed(2)} pieUSD
                </span>
              </div>
            </div>

            <button
              onClick={onRevoke}
              className="w-full py-2.5 bg-red-950/60 hover:bg-red-900/60 border border-red-800/50 text-red-300 font-medium rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <Lock className="w-4 h-4" />
              <span>Revoke Kite Passport Delegation</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                Select Daily Budget Cap (pieUSD)
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {['1.00', '5.00', '20.00'].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBudgetUsd(val)}
                    className={`py-2 rounded-xl text-xs font-mono font-medium border transition-colors ${
                      budgetUsd === val
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-start space-x-2 text-[11px] text-amber-400/90 bg-amber-950/20 border border-amber-800/30 p-3 rounded-xl">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Funds remain in your Kite wallet until an agent query is actually settled through the x402 facilitator.
              </span>
            </div>

            <button
              onClick={() => onAuthorize(Math.round(parseFloat(budgetUsd) * 100))}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center space-x-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Sign Session Delegation (EIP-712)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
