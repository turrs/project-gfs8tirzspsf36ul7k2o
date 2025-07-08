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
      toast.success('Wallet disconnected'); // Show success even if there's an error
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
      <Card className="dex-card p-4 space-y-4">
        {/* Wallet Info Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-dex rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Connected</p>
              <p className="font-semibold text-white">{formatAddress(walletAddress)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAddress}
              className="text-gray-400 hover:text-white p-2"
              title="Copy Address"
            >
              <Copy className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={openInExplorer}
              className="text-gray-400 hover:text-white p-2"
              title="View in Explorer"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Balance Display */}
        <div className="bg-dex-gray/30 rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">SOL Balance</p>
              <p className="text-lg font-semibold text-white">
                {balanceLoading ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-dex-primary border-t-transparent rounded-full loading-spinner" />
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
              className="text-gray-400 hover:text-white disabled:opacity-50 p-2"
              title="Refresh Balance"
            >
              <RefreshCw className={`w-4 h-4 ${balanceLoading ? 'loading-spinner' : ''}`} />
            </Button>
          </div>
          
          {solBalance === null && !balanceLoading && (
            <p className="text-xs text-gray-500 mt-1">
              RPC rate limited. Click refresh to retry.
            </p>
          )}
        </div>

        {/* Disconnect Button - Made more prominent */}
        <div className="pt-2 border-t border-white/10">
          <Button
            variant="outline"
            onClick={handleDisconnect}
            className="w-full bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 transition-all duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect Wallet
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="dex-card p-6 text-center">
      <div className="mb-4">
        <div className="w-16 h-16 bg-gradient-dex rounded-full flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
        <p className="text-gray-400 text-sm">
          Connect your Solana wallet to start trading on mainnet
        </p>
      </div>
      
      <Button
        onClick={handleConnect}
        disabled={connecting}
        className="dex-button w-full"
      >
        {connecting ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full loading-spinner" />
            <span>Connecting...</span>
          </div>
        ) : (
          'Connect Wallet'
        )}
      </Button>
      
      <p className="text-xs text-gray-500 mt-3">
        Supports Phantom, Solflare, and other Solana wallets
      </p>
    </Card>
  );
};