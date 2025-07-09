import React from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';
import { Wallet } from 'lucide-react';

export const Header: React.FC = () => {
  const { connected, connecting, connect, walletAddress } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D0E14]/80 backdrop-blur-md border-b border-[#2A2A3A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#2A2A3A] rounded-full flex items-center justify-center">
                <Wallet className="w-4 h-4 text-[#9AE462]" />
              </div>
              <span className="font-bold text-white">SolSwap</span>
            </div>
          </div>
          
          <div>
            {!connected ? (
              <Button
                onClick={handleConnect}
                disabled={connecting}
                className="bg-[#9AE462] hover:bg-[#8AD452] text-[#1A1A25] font-bold rounded-full px-4 py-2 h-9"
              >
                {connecting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-[#1A1A25] border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </div>
                ) : (
                  'Connect Wallet'
                )}
              </Button>
            ) : (
              <Button
                variant="outline"
                className="bg-[#2A2A3A] border-[#3A3A4A] text-white hover:bg-[#3A3A4A] rounded-full px-4 py-2 h-9"
              >
                {formatAddress(walletAddress || '')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};