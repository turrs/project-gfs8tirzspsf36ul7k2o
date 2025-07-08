// Solana RPC endpoints with fallbacks
const RPC_ENDPOINTS = [
  'https://api.mainnet-beta.solana.com',
  'https://solana-api.projectserum.com',
  'https://rpc.ankr.com/solana',
  'https://solana-mainnet.g.alchemy.com/v2/demo' // Alchemy demo endpoint
];

export const SOLANA_RPC_ENDPOINT = RPC_ENDPOINTS[0];

// Jupiter API base URL
export const JUPITER_API_BASE = 'https://quote-api.jup.ag/v6';

// Common token addresses on Mainnet
export const COMMON_TOKENS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
};

// Helper function to get a working RPC connection
export const getConnection = async () => {
  const { Connection } = await import('@solana/web3.js');
  
  // Try each endpoint until one works
  for (const endpoint of RPC_ENDPOINTS) {
    try {
      const connection = new Connection(endpoint, 'confirmed');
      // Test the connection with a simple call
      await connection.getSlot();
      console.log(`Using RPC endpoint: ${endpoint}`);
      return connection;
    } catch (error) {
      console.warn(`RPC endpoint ${endpoint} failed:`, error);
      continue;
    }
  }
  
  // If all fail, return the first one and let the caller handle the error
  console.warn('All RPC endpoints failed, using default');
  return new Connection(RPC_ENDPOINTS[0], 'confirmed');
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

// Helper function to get token balance with retry logic
export const getTokenBalance = async (
  walletAddress: string,
  tokenMint: string,
  retries: number = 3
): Promise<number> => {
  for (let i = 0; i < retries; i++) {
    try {
      if (tokenMint === COMMON_TOKENS.SOL) {
        const { PublicKey } = await import('@solana/web3.js');
        const connection = await getConnection();
        const balance = await connection.getBalance(new PublicKey(walletAddress));
        return balance;
      }
      
      // For SPL tokens, we would need to get token account balance
      // This is a simplified version - in production, you'd use getTokenAccountsByOwner
      return 0;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        throw error;
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  return 0;
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