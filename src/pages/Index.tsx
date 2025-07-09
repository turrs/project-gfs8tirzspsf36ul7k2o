import React from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { SwapInterface } from '@/components/SwapInterface';
import { useWallet } from '@/hooks/useWallet';

const Index = () => {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-[#0D0E14]">
      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-12">
        {!connected ? (
          <WalletConnection />
        ) : (
          <SwapInterface />
        )}
      </main>
    </div>
  );
};

export default Index;