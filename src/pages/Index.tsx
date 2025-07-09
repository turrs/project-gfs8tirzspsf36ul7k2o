import React from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { SwapInterface } from '@/components/SwapInterface';
import { useWallet } from '@/hooks/useWallet';
import { Header } from '@/components/Header';

const Index = () => {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-[#0D0E14]">
      <Header />
      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pt-24 pb-12">
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