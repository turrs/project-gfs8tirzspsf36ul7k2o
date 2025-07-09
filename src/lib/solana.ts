import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Jupiter API configuration
export const JUPITER_API_BASE = 'https://quote-api.jup.ag/v6';

// Solana RPC endpoints
const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
  clusterApiUrl('mainnet-beta')
];

let connection: Connection | null = null;
let currentEndpointIndex = 0;

// Get connection with fallback endpoints
export const getConnection = async (): Promise<Connection> => {
  if (!connection) {
    connection = new Connection(RPC_ENDPOINTS[currentEndpointIndex], {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000,
    });
  }
  
  try {
    // Test the connection
    await connection.getLatestBlockhash();
    return connection;
  } catch (error) {
    console.warn(`RPC endpoint ${RPC_ENDPOINTS[currentEndpointIndex]} failed, trying next...`);
    
    // Try next endpoint
    currentEndpointIndex = (currentEndpointIndex + 1) % RPC_ENDPOINTS.length;
    connection = new Connection(RPC_ENDPOINTS[currentEndpointIndex], {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60000,
    });
    
    return connection;
  }
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