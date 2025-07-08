import React from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { SwapInterface } from '@/components/SwapInterface';
import { useWallet } from '@/hooks/useWallet';
import { Zap, TrendingUp, Shield, Clock } from 'lucide-react';

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
                  <h1 className="text-xl font-bold text-white">SolDEX</h1>
                  <p className="text-xs text-gray-400">Powered by Jupiter</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-6 text-sm">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-dex-secondary font-medium">Devnet</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Features */}
            <div className="lg:col-span-1 space-y-6">
              {/* Welcome Section */}
              <div className="dex-card p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Welcome to SolDEX
                </h2>
                <p className="text-gray-400 mb-6">
                  The fastest and most efficient way to swap tokens on Solana. 
                  Powered by Jupiter's advanced routing technology.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-dex-primary/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-dex-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Best Prices</h4>
                      <p className="text-sm text-gray-400">Aggregated from all DEXs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-dex-secondary/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-dex-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Fast Execution</h4>
                      <p className="text-sm text-gray-400">Lightning-fast swaps</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-dex-accent/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-dex-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Secure</h4>
                      <p className="text-sm text-gray-400">Non-custodial trading</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="dex-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Platform Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-dex-primary">$2.1B+</div>
                    <div className="text-sm text-gray-400">Volume (24h)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-dex-secondary">150K+</div>
                    <div className="text-sm text-gray-400">Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-dex-accent">500+</div>
                    <div className="text-sm text-gray-400">Tokens</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">99.9%</div>
                    <div className="text-sm text-gray-400">Uptime</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Column - Swap Interface */}
            <div className="lg:col-span-1">
              {!connected ? (
                <WalletConnection />
              ) : (
                <SwapInterface />
              )}
            </div>

            {/* Right Column - Additional Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Market Trends */}
              <div className="dex-card p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-dex-secondary" />
                  <h3 className="text-lg font-semibold text-white">Trending Tokens</h3>
                </div>
                
                <div className="space-y-3">
                  {[
                    { symbol: 'SOL', name: 'Solana', change: '+5.2%', price: '$98.45' },
                    { symbol: 'BONK', name: 'Bonk', change: '+12.8%', price: '$0.000015' },
                    { symbol: 'USDC', name: 'USD Coin', change: '+0.1%', price: '$1.00' },
                  ].map((token, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-dex-gray/20 rounded-xl">
                      <div>
                        <div className="font-semibold text-white">{token.symbol}</div>
                        <div className="text-sm text-gray-400">{token.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">{token.price}</div>
                        <div className={`text-sm ${token.change.startsWith('+') ? 'text-dex-success' : 'text-dex-error'}`}>
                          {token.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="dex-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Swaps</h3>
                <div className="space-y-3">
                  {[
                    { from: 'SOL', to: 'USDC', amount: '2.5', time: '2m ago' },
                    { from: 'USDC', to: 'BONK', amount: '100', time: '5m ago' },
                    { from: 'SOL', to: 'USDT', amount: '1.2', time: '8m ago' },
                  ].map((swap, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-dex-gray/20 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{swap.amount} {swap.from}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-dex-secondary font-medium">{swap.to}</span>
                      </div>
                      <span className="text-sm text-gray-400">{swap.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Built on Solana Devnet • Powered by Jupiter Aggregator
              </p>
              <p className="text-gray-500 text-xs mt-2">
                This is a demo DEX for educational purposes only
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;