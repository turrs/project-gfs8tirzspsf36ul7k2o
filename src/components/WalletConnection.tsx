import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, LogOut, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { toast } from 'sonner';

export const WalletConnection: React.FC = () => {
  const { connected, connecting, connect, disconnect, walletAddress, solBalance, refreshBalance, balanceLoading } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
      toast.success('Wallet connected successfully!');
    } catch (error) {
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.success('Wallet disconnected');
    }
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      toast.success('Address copied to clipboard');
    }
  };

  const openInExplorer = () => {
    if (walletAddress) {
      window.open(`https://explorer.solana.com/address/${walletAddress}`, '_blank');
    }
  };

  const handleRefreshBalance = async () => {
    try {
      await refreshBalance();
      toast.success('Balance refreshed');
    } catch (error) {
      toast.error('Failed to refresh balance. RPC may be rate limited.');
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (connected && walletAddress) {
    return (
      <Card className="bg-[#1C1C28] border-[#2A2A3A] rounded-2xl overflow-hidden">
        {/* Wallet Info Header */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#2A2A3A] rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Connected Wallet</p>
                <p className="font-bold text-white">{formatAddress(walletAddress)}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="text-gray-400 hover:text-white hover:bg-[#2A2A3A] p-2 rounded-full"
                title="Copy Address"
              >
                <Copy className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={openInExplorer}
                className="text-gray-400 hover:text-white hover:bg-[#2A2A3A] p-2 rounded-full"
                title="View in Explorer"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDisconnect}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-full"
                title="Disconnect Wallet"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Balance Display */}
          <div className="bg-[#1A1A25] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">SOL Balance</p>
                <p className="text-2xl font-bold text-white">
                  {balanceLoading ? (
                    <span className="flex items-center space-x-3">
                      <div className="w-5 h-5 border-2 border-[#9AE462] border-t-transparent rounded-full animate-spin" />
                      <span>Loading...</span>
                    </span>
                  ) : solBalance !== null ? (
                    `${solBalance.toFixed(4)} SOL`
                  ) : (
                    <span className="text-gray-500">Unable to load</span>
                  )}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefreshBalance}
                disabled={balanceLoading}
                className="text-gray-400 hover:text-white hover:bg-[#2A2A3A] disabled:opacity-50 p-2 rounded-full"
                title="Refresh Balance"
              >
                <RefreshCw className={`w-4 h-4 ${balanceLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            {solBalance === null && !balanceLoading && (
              <p className="text-xs text-gray-500 mt-2">
                RPC rate limited. Click refresh to retry.
              </p>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1C1C28] border-[#2A2A3A] rounded-2xl overflow-hidden p-8 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-[#2A2A3A] rounded-full flex items-center justify-center mx-auto mb-6">
          <Wallet className="w-10 h-10 text-[#9AE462]" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">
          Connect Wallet
        </h3>
        <p className="text-gray-400 leading-relaxed">
          Connect your Solana wallet to start trading
        </p>
      </div>
      
      <Button
        onClick={handleConnect}
        disabled={connecting}
        className="w-full bg-[#9AE462] hover:bg-[#8AD452] text-[#1A1A25] font-bold py-4 rounded-xl"
      >
        {connecting ? (
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-[#1A1A25] border-t-transparent rounded-full animate-spin" />
            <span>Connecting...</span>
          </div>
        ) : (
          'Connect Wallet'
        )}
      </Button>
      
      <p className="text-sm text-gray-500 mt-6">
        Supports Phantom, Solflare, and other Solana wallets
      </p>
    </Card>
  );
};