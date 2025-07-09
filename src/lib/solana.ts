// Alchemy API endpoint
const ALCHEMY_RPC_ENDPOINT = 'https://solana-mainnet.g.alchemy.com/v2/U0EeAoRs5SyyPwBos2dq-';

// Fallback RPC endpoints
const FALLBACK_RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
  'https://rpc.ankr.com/solana',
  'https://solana.public-rpc.com'
];

export const SOLANA_RPC_ENDPOINT = ALCHEMY_RPC_ENDPOINT;

// Jupiter API base URL
export const JUPITER_API_BASE = 'https://quote-api.jup.ag/v6';

// Common token addresses on Mainnet
export const COMMON_TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
};

// Helper function to get a working RPC connection with Alchemy first
export const getConnection = async () => {
  const { Connection } = await import('@solana/web3.js');
  
  // Try Alchemy first
  try {
    const connection = new Connection(ALCHEMY_RPC_ENDPOINT, 'confirmed');
    // Test the connection with a simple call
    await connection.getSlot();
    console.log(`Using Alchemy RPC endpoint: ${ALCHEMY_RPC_ENDPOINT}`);
    return connection;
  } catch (error) {
    console.warn(`Alchemy RPC endpoint failed:`, error);
  }
  
  // Try fallback endpoints if Alchemy fails
  for (const endpoint of FALLBACK_RPC_ENDPOINTS) {
    try {
      const connection = new Connection(endpoint, 'confirmed');
      // Test the connection with a simple call
      await connection.getSlot();
      console.log(`Using fallback RPC endpoint: ${endpoint}`);
      return connection;
    } catch (error) {
      console.warn(`RPC endpoint ${endpoint} failed:`, error);
      continue;
    }
  }
  
  // If all fail, return Alchemy connection and let the caller handle the error
  console.warn('All RPC endpoints failed, using Alchemy as default');
  return new Connection(ALCHEMY_RPC_ENDPOINT, 'confirmed');
};

// Helper function to validate Solana address
export const isValidSolanaAddress = (address: string): boolean => {
  try {
    // Basic validation without importing PublicKey initially
    return address.length >= 32 && address.length <= 44;
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

// Helper function to get token balance using direct connection with retry logic
export const getTokenBalance = async (
  walletAddress: string,
  tokenMint: string,
  retries: number = 3
): Promise<number> => {
  let lastError: Error | null = null;
  
  for (let i = 0; i < retries; i++) {
    try {
      const { PublicKey } = await import('@solana/web3.js');
      const publicKey = new PublicKey(walletAddress);
      
      if (tokenMint === COMMON_TOKENS.SOL) {
        // Try each endpoint until one works
        for (const endpoint of [ALCHEMY_RPC_ENDPOINT, ...FALLBACK_RPC_ENDPOINTS]) {
          try {
            const { Connection } = await import('@solana/web3.js');
            const connection = new Connection(endpoint, 'confirmed');
            const balance = await connection.getBalance(publicKey);
            console.log(`Balance fetched successfully using ${endpoint}: ${balance} lamports`);
            return balance;
          } catch (endpointError) {
            console.warn(`Balance fetch failed with ${endpoint}:`, endpointError);
            lastError = endpointError as Error;
            // Continue to next endpoint
          }
        }
        
        // If we get here, all endpoints failed
        throw lastError || new Error('All RPC endpoints failed');
      }
      
      // For SPL tokens, we would need to get token account balance
      // This is a simplified version - in production, you'd use getTokenAccountsByOwner
      return 0;
    } catch (error) {
      console.error(`Balance fetch attempt ${i + 1} failed:`, error);
      lastError = error as Error;
      
      if (i === retries - 1) {
        throw error;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
    }
  }
  
  throw lastError || new Error('Failed to fetch balance after multiple attempts');
};

// Helper function to send transaction
export const sendTransaction = async (
  transaction: any,
  wallet: any
): Promise<string> => {
  try {
    if (!wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    const connection = await getConnection();
    const signature = await wallet.sendTransaction(transaction, connection);

    // Wait for confirmation
    await connection.confirmTransaction(signature, 'confirmed');
    return signature;
  } catch (error) {
    console.error('Error sending transaction:', error);
    throw error;
  }
};