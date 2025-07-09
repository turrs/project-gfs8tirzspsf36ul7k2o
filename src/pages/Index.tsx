import React from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { SwapInterface } from '@/components/SwapInterface';
import { useWallet } from '@/hooks/useWallet';
import { Zap } from 'lucide-react';

const Index = () => {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen bg-gradient-to-br from-dex-dark via-dex-darker to-dex-dark">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-dex-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-dex-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/10 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-dex rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">solanavibes2021</h1>
                  <p className="text-xs text-gray-400">Powered by Jupiter</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-6 text-sm">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-dex-secondary font-medium">Mainnet</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-md mx-auto px-4 py-8">
          {!connected ? (
            <WalletConnection />
          ) : (
            <SwapInterface />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Built on Solana Mainnet • Powered by Jupiter Aggregator
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Trade real tokens with live market data
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;