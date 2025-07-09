import React from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { SwapInterface } from '@/components/SwapInterface';
import { useWallet } from '@/hooks/useWallet';
import { Zap, TrendingUp } from 'lucide-react';

const Index = () => {
  const { connected } = useWallet();

  return (
    <div className="min-h-screen raydium-bg">
      {/* Retro grid overlay */}
      <div className="fixed inset-0 retro-grid opacity-30 pointer-events-none" />
      
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10">
        {/* Header - Classic Raydium style */}
        <header className="raydium-header backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center neon-glow">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    solanavibes2021
                  </h1>
                  <p className="text-sm text-purple-300/80">Automated Market Maker</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="hidden md:flex items-center space-x-8 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300">Mainnet</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300">Live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-lg mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Swap Tokens
            </h2>
            <p className="text-gray-400 text-lg">
              Trade tokens instantly with the best rates on Solana
            </p>
          </div>

          {!connected ? (
            <WalletConnection />
          ) : (
            <SwapInterface />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-purple-500/20 mt-20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  solanavibes2021
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                Powered by Jupiter Protocol • Built on Solana
              </p>
              <p className="text-gray-500 text-xs">
                Experience the future of decentralized trading
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;