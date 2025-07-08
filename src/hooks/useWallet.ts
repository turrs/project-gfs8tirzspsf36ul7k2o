import { useState, useEffect, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';

interface WalletAdapter {
  publicKey: PublicKey | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendTransaction: (transaction: any, connection: any) => Promise<string>;
}

interface UseWalletReturn {
  wallet: WalletAdapter | null;
  connected: boolean;
  connecting: boolean;
  publicKey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  walletAddress: string | null;
}

export const useWallet = (): UseWalletReturn => {
  const [wallet, setWallet] = useState<WalletAdapter | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);

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

  // Initialize wallet connection
  useEffect(() => {
    const walletAdapter = getWallet();
    if (walletAdapter) {
      setWallet(walletAdapter);
      
      // Check if already connected
      if (walletAdapter.isConnected) {
        setConnected(true);
        setPublicKey(walletAdapter.publicKey);
      }

      // Listen for connection events
      walletAdapter.on('connect', (publicKey: PublicKey) => {
        console.log('Wallet connected:', publicKey.toString());
        setConnected(true);
        setPublicKey(publicKey);
        setConnecting(false);
      });

      walletAdapter.on('disconnect', () => {
        console.log('Wallet disconnected');
        setConnected(false);
        setPublicKey(null);
        setConnecting(false);
      });

      // Auto-connect if previously connected
      if (walletAdapter.isConnected) {
        walletAdapter.connect({ onlyIfTrusted: true }).catch(() => {
          // Ignore errors for auto-connect
        });
      }
    }

    return () => {
      // Cleanup listeners
      if (walletAdapter) {
        walletAdapter.removeAllListeners();
      }
    };
  }, [getWallet]);

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
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
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
    walletAddress
  };
};