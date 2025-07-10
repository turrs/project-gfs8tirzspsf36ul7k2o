import { Connection, PublicKey } from '@solana/web3.js';

// Alchemy Solana RPC endpoint
const ALCHEMY_RPC_ENDPOINT = 'https://solana-mainnet.g.alchemy.com/v2/U0EeAoRs5SyyPwBos2dq-';

let connection: Connection | null = null;

// Get connection using Alchemy endpoint
export const getConnection = async (): Promise<Connection> => {
  if (!connection) {
    connection = new Connection(ALCHEMY_RPC_ENDPOINT, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000,
    });
  }
  return connection;
};

// Get token balance for a given wallet and token mint
export const getTokenBalance = async (walletAddress: string, tokenMint: string): Promise<number> => {
  try {
    const connection = await getConnection();
    const publicKey = new PublicKey(walletAddress);
    
    if (tokenMint === 'So11111111111111111111111111111111111111112') {
      // SOL balance
      const balance = await connection.getBalance(publicKey);
      return balance; // Returns in lamports
    } else {
      // SPL Token balance
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(tokenMint)
      });
      
      if (tokenAccounts.value.length === 0) {
        return 0;
      }
      
      const tokenAccount = tokenAccounts.value[0];
      const balance = tokenAccount.account.data.parsed.info.tokenAmount.amount;
      return parseInt(balance);
    }
  } catch (error) {
    console.error('Error fetching token balance:', error);
    throw error;
  }
};

// Validate Solana address
export const isValidSolanaAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

// Format SOL amount from lamports
export const formatSolAmount = (lamports: number): string => {
  return (lamports / 1e9).toFixed(4);
};

// Convert SOL to lamports
export const solToLamports = (sol: number): number => {
  return Math.floor(sol * 1e9);
};

export const JUPITER_API_BASE = 'https://quote-api.jup.ag/v6';