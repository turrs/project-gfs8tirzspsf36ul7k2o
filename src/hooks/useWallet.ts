import { useState, useEffect, useCallback } from 'react';
import { getConnection, getTokenBalance, COMMON_TOKENS } from '@/lib/solana';

interface WalletAdapter {
  publicKey: any;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendTransaction: (transaction: any, connection?: any) => Promise<string>;
  on: (event: string, callback: (data: any) => void) => void;
  removeAllListeners: () => void;
  isConnected: boolean;
}

interface UseWalletReturn {
  wallet: WalletAdapter | null;
  connected: boolean;
  connecting: boolean;
  publicKey: any;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  walletAddress: string | null;
  solBalance: number | null;
  refreshBalance: () => Promise<void>;
  balanceLoading: boolean;
}

export const useWallet = (): UseWalletReturn => {
  const [wallet, setWallet] = useState<WalletAdapter | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<any>(null);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Check if wallet is available
  const getWallet = useCallback(() => {
    if (typeof window !== 'undefined') {
      // Check for Phantom wallet
      if ('solana' in window) {
        const solanaWallet = (window as any).solana;
        if (solanaWallet?.isPhantom) {
          return solanaWallet;
        }
      }
      
      // Check for Solflare wallet
      if ('solflare' in window) {
        return (window as any).solflare;
      }
    }
    return null;
  }, []);

  // Function to get SOL balance using Alchemy API
  const refreshBalance = useCallback(async () => {
    if (!publicKey || !connected) {
      setSolBalance(null);
      return;
    }

    setBalanceLoading(true);
    try {
      console.log('Fetching balance using Alchemy API for:', publicKey.toString());
      const balance = await getTokenBalance(publicKey.toString(), COMMON_TOKENS.SOL);
      const solAmount = balance / 1e9; // Convert lamports to SOL
      setSolBalance(solAmount);
      console.log('SOL Balance updated successfully:', solAmount);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setSolBalance(null);
      
      // Show user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('403') || error.message.includes('forbidden')) {
          console.warn('API rate limit or access issue, balance will be retried later');
        } else {
          console.warn('Balance fetch failed:', error.message);
        }
      }
    } finally {
      setBalanceLoading(false);
    }
  }, [publicKey, connected]);

  // Initialize wallet connection
  useEffect(() => {
    const walletAdapter = getWallet();
    if (walletAdapter) {
      setWallet(walletAdapter);
      
      // Check if already connected
      if (walletAdapter.isConnected && walletAdapter.publicKey) {
        setConnected(true);
        setPublicKey(walletAdapter.publicKey);
      }

      // Listen for connection events
      const handleConnect = (publicKey: any) => {
        console.log('Wallet connected:', publicKey?.toString());
        setConnected(true);
        setPublicKey(publicKey);
        setConnecting(false);
      };

      const handleDisconnect = () => {
        console.log('Wallet disconnected');
        setConnected(false);
        setPublicKey(null);
        setSolBalance(null);
        setConnecting(false);
      };

      try {
        walletAdapter.on('connect', handleConnect);
        walletAdapter.on('disconnect', handleDisconnect);

        // Auto-connect if previously connected
        if (walletAdapter.isConnected) {
          walletAdapter.connect({ onlyIfTrusted: true }).catch(() => {
            // Ignore errors for auto-connect
          });
        }
      } catch (error) {
        console.error('Error setting up wallet listeners:', error);
      }
    }

    return () => {
      // Cleanup listeners
      if (walletAdapter && walletAdapter.removeAllListeners) {
        try {
          walletAdapter.removeAllListeners();
        } catch (error) {
          console.error('Error removing wallet listeners:', error);
        }
      }
    };
  }, [getWallet]);

  // Refresh balance when wallet connects (reduced delay since using Alchemy)
  useEffect(() => {
    if (connected && publicKey) {
      // Add a small delay to avoid immediate requests
      const timer = setTimeout(() => {
        refreshBalance();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [connected, publicKey, refreshBalance]);

  const connect = useCallback(async () => {
    if (!wallet) {
      // Redirect to wallet installation
      window.open('https://phantom.app/', '_blank');
      return;
    }

    try {
      setConnecting(true);
      await wallet.connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setConnecting(false);
      throw error;
    }
  }, [wallet]);

  const disconnect = useCallback(async () => {
    if (!wallet) return;

    try {
      await wallet.disconnect();
      // Force reset state
      setConnected(false);
      setPublicKey(null);
      setSolBalance(null);
      setBalanceLoading(false);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      // Force reset state even if disconnect fails
      setConnected(false);
      setPublicKey(null);
      setSolBalance(null);
      setBalanceLoading(false);
      throw error;
    }
  }, [wallet]);

  const walletAddress = publicKey ? publicKey.toString() : null;

  return {
    wallet,
    connected,
    connecting,
    publicKey,
    connect,
    disconnect,
    walletAddress,
    solBalance,
    refreshBalance,
    balanceLoading
  };
};