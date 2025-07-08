import { useState, useEffect, useCallback } from 'react';

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
}

export const useWallet = (): UseWalletReturn => {
  const [wallet, setWallet] = useState<WalletAdapter | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<any>(null);

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