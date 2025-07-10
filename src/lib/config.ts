// Frontend Configuration
export const config = {
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://ntnyagxlmgxfgxrxbxqg.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bnlhZ3hsbWd4Zmd4cnhieHFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDU2NDksImV4cCI6MjA2NzY4MTY0OX0.wxx1wXeBtMx9f8neBLzi-FsUXGRDQ1LIq6Fuku2KsTM',
  },
  
  // Backend API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  },
  
  // Solana Configuration
  solana: {
    rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    feeAccount: import.meta.env.VITE_FEE_ACCOUNT || 'A9PApeDzYvnRfZbYTqi9SGYBAegectD7U58jvthAcd57',
  },
  
  // Jupiter Configuration
  jupiter: {
    apiBase: 'https://quote-api.jup.ag/v6',
  },
}; 