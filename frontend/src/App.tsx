import React, { useState } from 'react';
import { Header } from './components/Header';
import { AgentCatalog } from './components/AgentCatalog';
import { ChatPlayground } from './components/ChatPlayground';
import { DeveloperConsole } from './components/DeveloperConsole';
import { PaymentHistory } from './components/PaymentHistory';
import { PassportModal } from './components/PassportModal';
import { useMarketplace } from './hooks/useMarketplace';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'playground' | 'developer' | 'history'>('marketplace');

  const {
    agents,
    activeAgent,
    setActiveAgent,
    messages,
    receipts,
    isLoading,
    passport,
    userBalance,
    isPassportModalOpen,
    setIsPassportModalOpen,
    sendQuery,
    authorizePassport,
    revokePassport,
    refreshAgents,
  } = useMarketplace();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        passport={passport}
        userBalance={userBalance}
        onOpenPassport={() => setIsPassportModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'marketplace' && (
          <AgentCatalog
            agents={agents}
            onSelectAgent={(agent) => {
              setActiveAgent(agent);
              setActiveTab('playground');
            }}
          />
        )}

        {activeTab === 'playground' && (
          <ChatPlayground
            activeAgent={activeAgent}
            agents={agents}
            onSelectAgent={setActiveAgent}
            messages={messages}
            isLoading={isLoading}
            onSendQuery={sendQuery}
          />
        )}

        {activeTab === 'developer' && (
          <DeveloperConsole onAgentRegistered={refreshAgents} />
        )}

        {activeTab === 'history' && (
          <PaymentHistory receipts={receipts} />
        )}
      </main>

      <PassportModal
        isOpen={isPassportModalOpen}
        onClose={() => setIsPassportModalOpen(false)}
        passport={passport}
        onAuthorize={authorizePassport}
        onRevoke={revokePassport}
      />

      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Kite AI Agent Marketplace &middot; x402 Micropayment Protocol</span>
          <span className="font-mono text-slate-400">Deployed for Kite Chain Testnet (Chain ID 2368)</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
