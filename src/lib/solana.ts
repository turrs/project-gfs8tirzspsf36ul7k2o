import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

// Solana Devnet RPC endpoint
export const SOLANA_RPC_ENDPOINT = 'https://api.devnet.solana.com';

// Create connection to Solana devnet
export const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');

// Jupiter API base URL
export const JUPITER_API_BASE = 'https://quote-api.jup.ag/v6';

// Common token addresses on Devnet
export const COMMON_TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU', // Devnet USDC
  USDT: 'EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS', // Devnet USDT
};

// Helper function to validate Solana address
export const isValidSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

// Helper function to format SOL amount
export const formatSOL = (lamports: number): string => {
  return (lamports / 1e9).toFixed(4);
};

// Helper function to format token amount
export const formatTokenAmount = (amount: number, decimals: number): string => {
  return (amount / Math.pow(10, decimals)).toFixed(6);
};

// Helper function to get token balance
export const getTokenBalance = async (
  walletAddress: string,
  tokenMint: string
): Promise<number> => {
  try {
    if (tokenMint === COMMON_TOKENS.SOL) {
      const balance = await connection.getBalance(new PublicKey(walletAddress));
      return balance;
    }
    
    // For SPL tokens, we would need to get token account balance
    // This is a simplified version - in production, you'd use getTokenAccountsByOwner
    return 0;
  } catch (error) {
    console.error('Error getting token balance:', error);
    return 0;
  }
};

// Helper function to send transaction
export const sendTransaction = async (
  transaction: Transaction | VersionedTransaction,
  wallet: any
): Promise<string> => {
  try {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    let signature: string;
    
    if (transaction instanceof VersionedTransaction) {
      signature = await wallet.sendTransaction(transaction, connection);
    } else {
      signature = await wallet.sendTransaction(transaction, connection);
    }

    // Wait for confirmation
    await connection.confirmTransaction(signature, 'confirmed');
    return signature;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};