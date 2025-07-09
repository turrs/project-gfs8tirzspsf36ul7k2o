import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, LogOut, Copy, ExternalLink, RefreshCw, Zap } from 'lucide-react';
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
      <Card className="raydium-card p-6 space-y-6">
        {/* Wallet Info Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center neon-glow">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-purple-300 font-medium">Connected Wallet</p>
              <p className="font-bold text-white text-lg">{formatAddress(walletAddress)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAddress}
              className="text-purple-300 hover:text-white hover:bg-purple-500/20 p-3 rounded-xl"
              title="Copy Address"
            >
              <Copy className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={openInExplorer}
              className="text-purple-300 hover:text-white hover:bg-purple-500/20 p-3 rounded-xl"
              title="View in Explorer"
            >
              <ExternalLink className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisconnect}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-3 rounded-xl"
              title="Disconnect Wallet"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Balance Display */}
        <div className="bg-slate-800/60 rounded-2xl p-6 border border-purple-400/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-300 font-medium mb-2">SOL Balance</p>
              <p className="text-2xl font-bold text-white">
                {balanceLoading ? (
                  <span className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full loading-spinner" />
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
              className="text-purple-300 hover:text-white hover:bg-purple-500/20 disabled:opacity-50 p-3 rounded-xl"
              title="Refresh Balance"
            >
              <RefreshCw className={`w-5 h-5 ${balanceLoading ? 'loading-spinner' : ''}`} />
            </Button>
          </div>
          
          {solBalance === null && !balanceLoading && (
            <p className="text-xs text-gray-500 mt-2">
              RPC rate limited. Click refresh to retry.
            </p>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="raydium-card p-8 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 neon-glow">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Connect Wallet
        </h3>
        <p className="text-gray-400 text-lg leading-relaxed">
          Connect your Solana wallet to start trading<br />
          <span className="text-purple-300">Experience the future of DeFi</span>
        </p>
      </div>
      
      <Button
        onClick={handleConnect}
        disabled={connecting}
        className="raydium-button w-full text-xl"
      >
        {connecting ? (
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full loading-spinner" />
            <span>Connecting...</span>
          </div>
        ) : (
          'Connect Wallet'
        )}
      </Button>
      
      <p className="text-sm text-purple-300/80 mt-6">
        Supports Phantom, Solflare, and other Solana wallets
      </p>
    </Card>
  );
};