import { useState, useEffect, useCallback } from 'react';
import { getConnection, getTokenBalance } from '@/lib/solana';
import { COMMON_TOKENS } from '@/lib/tokens';

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

  // Event handlers moved out of useEffect for reuse
  const handleConnect = useCallback((publicKey: any) => {
    console.log('Wallet connected:', publicKey?.toString());
    setConnected(true);
    setPublicKey(publicKey);
    setConnecting(false);
  }, []);

  const handleDisconnect = useCallback(() => {
    console.log('Wallet disconnected');
    setConnected(false);
    setPublicKey(null);
    setSolBalance(null);
    setConnecting(false);
  }, []);

  // Function to get SOL balance with improved error handling and retries
  const refreshBalance = useCallback(async () => {
    if (!publicKey || !connected) {
      setSolBalance(null);
      return;
    }

    setBalanceLoading(true);
    try {
      console.log('Fetching balance for:', publicKey.toString());
      
      // Try to get connection
      const connection = await getConnection();
      
      // Get SOL balance directly from connection
      const balance = await connection.getBalance(publicKey);
      const solAmount = balance / 1e9; // Convert lamports to SOL
      
      console.log('SOL Balance fetched successfully:', solAmount);
      setSolBalance(solAmount);
    } catch (error) {
      console.error('Error fetching balance:', error);
      
      // Try fallback method
      try {
        const balance = await getTokenBalance(publicKey.toString(), COMMON_TOKENS.SOL);
        const solAmount = balance / 1e9;
        setSolBalance(solAmount);
        console.log('SOL Balance fetched using fallback:', solAmount);
      } catch (fallbackError) {
        console.error('Fallback balance fetch failed:', fallbackError);
        setSolBalance(null);
      }
    } finally {
      setBalanceLoading(false);
    }
  }, [publicKey, connected]);

  // Initialize wallet connection and listeners
  useEffect(() => {
    const walletAdapter = getWallet();
    if (walletAdapter) {
      setWallet(walletAdapter);

      // Remove all listeners to avoid duplicates
      if (walletAdapter.removeAllListeners) {
        try { walletAdapter.removeAllListeners(); } catch {}
      }
      walletAdapter.on('connect', handleConnect);
      walletAdapter.on('disconnect', handleDisconnect);

      // Check if already connected
      if (walletAdapter.isConnected && walletAdapter.publicKey) {
        setConnected(true);
        setPublicKey(walletAdapter.publicKey);
      }

      // Auto-connect if previously connected
      if (walletAdapter.isConnected) {
        walletAdapter.connect({ onlyIfTrusted: true }).catch(() => {
          // Ignore errors for auto-connect
        });
      }
    }

    return () => {
      // Cleanup listeners
      if (walletAdapter && walletAdapter.removeAllListeners) {
        try { walletAdapter.removeAllListeners(); } catch {}
      }
    };
  }, [getWallet, handleConnect, handleDisconnect]);

  // Refresh balance when wallet connects
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
      window.open('https://phantom.app/', '_blank');
      return;
    }

    try {
      setConnecting(true);
      // Remove old listeners to avoid duplicates
      wallet.removeAllListeners && wallet.removeAllListeners();
      // Set up listeners before connecting
      wallet.on('connect', handleConnect);
      wallet.on('disconnect', handleDisconnect);
      await wallet.connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  }, [wallet, handleConnect, handleDisconnect]);

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