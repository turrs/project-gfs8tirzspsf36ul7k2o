export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  tags?: string[];
  verified?: boolean;
}

// Popular tokens on Solana Mainnet that are tradable on Jupiter
export const POPULAR_TOKENS: Token[] = [
  {
    address: 'So11111111111111111111111111111111111111112',
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
    verified: true,
    tags: ['native']
  },
  {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
    verified: true,
    tags: ['stablecoin']
  },
  {
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
    verified: true,
    tags: ['stablecoin']
  },
  {
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    symbol: 'BONK',
    name: 'Bonk',
    decimals: 5,
    logoURI: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I',
    verified: true,
    tags: ['meme']
  },
  {
    address: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    symbol: 'mSOL',
    name: 'Marinade staked SOL',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png',
    verified: true,
    tags: ['lst']
  },
  {
    address: 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn',
    symbol: 'jitoSOL',
    name: 'Jito Staked SOL',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn/logo.png',
    verified: true,
    tags: ['lst']
  },
  {
    address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
    symbol: 'JUP',
    name: 'Jupiter',
    decimals: 6,
    logoURI: 'https://static.jup.ag/jup/icon.png',
    verified: true,
    tags: ['governance']
  },
  {
    address: 'WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk',
    symbol: 'WEN',
    name: 'Wen',
    decimals: 5,
    logoURI: 'https://shdw-drive.genesysgo.net/7nPP797RprCMJaSXsyoTiFvMZVQ6y1dUgobvczdWGd35/wen.png',
    verified: true,
    tags: ['meme']
  },
  {
    address: 'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',
    symbol: 'bSOL',
    name: 'BlazeStake Staked SOL',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1/logo.png',
    verified: true,
    tags: ['lst']
  },
  {
    address: 'hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux',
    symbol: 'HNT',
    name: 'Helium Network Token',
    decimals: 8,
    logoURI: 'https://shdw-drive.genesysgo.net/CsDkETHRRR1EcueeN346MJoqzymkkr7RFjMqGpZMzAib/hnt.png',
    verified: true,
    tags: ['depin']
  },
  {
    address: 'rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof',
    symbol: 'RENDER',
    name: 'Render',
    decimals: 8,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof/logo.png',
    verified: true,
    tags: ['ai']
  },
  {
    address: '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
    symbol: 'WIF',
    name: 'dogwifhat',
    decimals: 6,
    logoURI: 'https://bafkreibk3covs5ltyqxa272oieh7kqzle5ym4t7qbrvgr2n7b2jtcza5aq.ipfs.nftstorage.link/',
    verified: true,
    tags: ['meme']
  }
];

// Default tokens for swap interface
export const DEFAULT_FROM_TOKEN = POPULAR_TOKENS[0]; // SOL
export const DEFAULT_TO_TOKEN = POPULAR_TOKENS[1]; // USDC

// Helper function to find token by address
export const findTokenByAddress = (address: string): Token | undefined => {
  return POPULAR_TOKENS.find(token => token.address === address);
};

// Helper function to find token by symbol
export const findTokenBySymbol = (symbol: string): Token | undefined => {
  return POPULAR_TOKENS.find(token => token.symbol.toLowerCase() === symbol.toLowerCase());
};

// Helper function to format token amount with proper decimals
export const formatTokenAmount = (amount: number, token: Token): string => {
  const formatted = (amount / Math.pow(10, token.decimals)).toFixed(6);
  return parseFloat(formatted).toString(); // Remove trailing zeros
};

// Helper function to parse token amount to raw units
export const parseTokenAmount = (amount: string, token: Token): number => {
  return Math.floor(parseFloat(amount) * Math.pow(10, token.decimals));
};

// Helper function to get token display name
export const getTokenDisplayName = (token: Token): string => {
  return `${token.symbol} - ${token.name}`;
};

// Helper function to validate token amount
export const isValidTokenAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && isFinite(num);
};

// Helper function to get price impact color class
export const getPriceImpactColorClass = (priceImpact: number): string => {
  if (priceImpact < 1) return 'price-impact-low';
  if (priceImpact < 3) return 'price-impact-medium';
  return 'price-impact-high';
};