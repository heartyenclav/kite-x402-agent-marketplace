import React from 'react';
import { PaymentReceipt } from '../types';
import { ExternalLink, Receipt, CheckCircle } from 'lucide-react';

interface PaymentHistoryProps {
  receipts: PaymentReceipt[];
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ receipts }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <span>On-Chain Settlement Ledger</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time Kite Testnet (Chain ID 2368) micro-settlements verified via x402 facilitator.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Settlements recorded: {receipts.length}</span>
        </div>
      </div>

      {receipts.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl space-y-2">
          <p className="text-sm text-slate-400">No payment receipts recorded yet.</p>
          <p className="text-xs text-slate-500">Run a query in the playground to settle your first x402 payment!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Tx Hash</th>
                <th className="py-3 px-4">Agent</th>
                <th className="py-3 px-4">Payer</th>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4 text-right">Amount (pieUSD)</th>
                <th className="py-3 px-4 text-right">Time</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {receipts.map((rcpt) => (
                <tr key={rcpt.paymentId} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 text-emerald-400 font-medium">
                    <span className="flex items-center space-x-1">
                      <span>{rcpt.txHash.slice(0, 10)}...{rcpt.txHash.slice(-8)}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-200 font-sans font-medium">
                    {rcpt.agentId}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {rcpt.payer.slice(0, 6)}...{rcpt.payer.slice(-4)}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {rcpt.recipient.slice(0, 6)}...{rcpt.recipient.slice(-4)}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-300 font-bold">
                    ${rcpt.amountPieUSD}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400 font-sans">
                    {new Date(rcpt.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-sans font-semibold">
                      <CheckCircle className="w-3 h-3" />
                      <span>Settled</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
