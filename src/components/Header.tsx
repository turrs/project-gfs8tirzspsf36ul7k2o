import React from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';

const Header: React.FC = () => {
  const { connected, connecting, connect, disconnect, publicKey } = useWallet();
  const walletAddress = publicKey ? publicKey.toBase58() : null;

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      // Optionally handle error
    }
  };

  const formatAddress = (address: string) => `${address.slice(0, 4)}...${address.slice(-4)}`;

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-[#0D0E14] border-b border-[#2A2A3A]">
      <div className="flex items-center gap-3">
        <img src="/jupsuck-logo.png" alt="Jup-suck Logo" className="h-20 w-20 rounded-full" />
        <span className="font-bold text-white text-xl">Jupiter Suck</span>
      </div>
      {!connected ? (
        <Button onClick={handleConnect} disabled={connecting} className="bg-[#9AE462] hover:bg-[#8AD452] text-[#1A1A25] font-bold rounded-full px-4 py-2 h-9">
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-[#2A2A3A] border-[#3A3A4A] text-white rounded-full px-4 py-2 h-9" disabled>
            {formatAddress(walletAddress || '')}
          </Button>
          <Button onClick={disconnect} className="bg-[#9AE462] hover:bg-[#8AD452] text-[#1A1A25] font-bold rounded-full px-4 py-2 h-9">
            Disconnect
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
