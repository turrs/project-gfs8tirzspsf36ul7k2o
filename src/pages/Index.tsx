import React, { useState } from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { SwapInterface } from '@/components/SwapInterface';
import { useWallet } from '@/hooks/useWallet';
import Header from '@/components/Header';
import TradingViewChart from '@/components/TradingViewChart';
import RecentTransactions from '@/components/RecentTransactions';
import DatabaseTest from '@/components/DatabaseTest';
import Jumbotron from '@/components/Jumbotron';

const Index = () => {
  const { connected, walletAddress } = useWallet();
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);

  return (
    <div className="min-h-screen bg-[#0D0E14]">
      <Header />
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="w-full md:w-1/2">
            <SwapInterface
              fromToken={fromToken}
              toToken={toToken}
              setFromToken={setFromToken}
              setToToken={setToToken}
            />
          </div>
          <div className="w-full md:w-1/2">
            <Jumbotron />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;