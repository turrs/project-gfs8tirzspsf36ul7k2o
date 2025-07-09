import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWallet } from '@/hooks/useWallet';
import { Wallet, ExternalLink } from 'lucide-react';

export const WalletConnection: React.FC = () => {
  const { connect, connecting } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <Card className="bg-[#1C1C28] border-[#2A2A3A] rounded-2xl p-8 text-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="w-16 h-16 bg-[#2A2A3A] rounded-full flex items-center justify-center">
          <Wallet className="w-8 h-8 text-[#9AE462]" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Connect your Solana wallet to start swapping tokens
          </p>
        </div>

        <Button
          onClick={handleConnect}
          disabled={connecting}
          className="bg-[#9AE462] hover:bg-[#8AD452] text-[#1A1A25] font-bold py-3 px-8 rounded-xl"
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

        <div className="text-sm text-gray-500 space-y-2">
          <p>Don't have a wallet?</p>
          <a
            href="https://phantom.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-[#9AE462] hover:text-[#8AD452]"
          >
            <span>Get Phantom Wallet</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </Card>
  );
};