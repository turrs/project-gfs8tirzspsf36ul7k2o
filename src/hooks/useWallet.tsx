import React, { useState, useEffect, useCallback, useContext } from 'react';
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

const WalletContext = React.createContext<UseWalletReturn | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletAdapter | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<any>(null);
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const getWallet = useCallback(() => {
    if (typeof window !== 'undefined') {
      if ('solana' in window) {
        const solanaWallet = (window as any).solana;
        if (solanaWallet?.isPhantom) {
          return solanaWallet;
        }
      }
      if ('solflare' in window) {
        return (window as any).solflare;
      }
    }
    return null;
  }, []);

  const handleConnect = useCallback((publicKey: any) => {
    setConnected(true);
    setPublicKey(publicKey);
    setConnecting(false);
  }, []);

  const handleDisconnect = useCallback(() => {
    setConnected(false);
    setPublicKey(null);
    setSolBalance(null);
    setConnecting(false);
  }, []);

  const refreshBalance = useCallback(async () => {
    if (!publicKey || !connected) {
      setSolBalance(null);
      return;
    }
    setBalanceLoading(true);
    try {
      const connection = await getConnection();
      const balance = await connection.getBalance(publicKey);
      const solAmount = balance / 1e9;
      setSolBalance(solAmount);
    } catch (error) {
      try {
        const balance = await getTokenBalance(publicKey.toString(), COMMON_TOKENS.SOL);
        const solAmount = balance / 1e9;
        setSolBalance(solAmount);
      } catch {
        setSolBalance(null);
      }
    } finally {
      setBalanceLoading(false);
    }
  }, [publicKey, connected]);

  useEffect(() => {
    const walletAdapter = getWallet();
    if (walletAdapter) {
      setWallet(walletAdapter);
      if (walletAdapter.removeAllListeners) {
        try { walletAdapter.removeAllListeners(); } catch {}
      }
      walletAdapter.on('connect', handleConnect);
      walletAdapter.on('disconnect', handleDisconnect);
      if (walletAdapter.isConnected && walletAdapter.publicKey) {
        setConnected(true);
        setPublicKey(walletAdapter.publicKey);
      }
      if (walletAdapter.isConnected) {
        walletAdapter.connect({ onlyIfTrusted: true }).catch(() => {});
      }
    }
    return () => {
      if (walletAdapter && walletAdapter.removeAllListeners) {
        try { walletAdapter.removeAllListeners(); } catch {}
      }
    };
  }, [getWallet, handleConnect, handleDisconnect]);

  useEffect(() => {
    if (connected && publicKey) {
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
      wallet.removeAllListeners && wallet.removeAllListeners();
      wallet.on('connect', handleConnect);
      wallet.on('disconnect', handleDisconnect);
      await wallet.connect();
    } catch (error) {
      throw error;
    } finally {
      setConnecting(false);
    }
  }, [wallet, handleConnect, handleDisconnect]);

  const disconnect = useCallback(async () => {
    if (!wallet) return;
    try {
      await wallet.disconnect();
      setConnected(false);
      setPublicKey(null);
      setSolBalance(null);
      setBalanceLoading(false);
    } catch (error) {
      setConnected(false);
      setPublicKey(null);
      setSolBalance(null);
      setBalanceLoading(false);
      throw error;
    }
  }, [wallet]);

  const walletAddress = publicKey ? publicKey.toString() : null;

  const value: UseWalletReturn = {
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

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
};