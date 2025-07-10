-- SolSwap Database Setup (Simple Version)
-- Run these commands in your Supabase SQL Editor

-- Create transactions table with wallet_address
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT,
  from_token TEXT NOT NULL,
  to_token TEXT NOT NULL,
  from_amount DECIMAL NOT NULL,
  to_amount DECIMAL NOT NULL,
  tx_hash TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  fee_amount DECIMAL DEFAULT 0,
  slippage DECIMAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_address ON transactions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Enable Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions table
CREATE POLICY "Allow all operations" ON transactions
  FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO transactions (wallet_address, from_token, to_token, from_amount, to_amount, status, fee_amount, slippage)
VALUES 
  ('A9PApeDzYvnRfZbYTqi9SGYBAegectD7U58jvthAcd57', 'SOL', 'USDC', 1.5, 150.00, 'completed', 0.1, 0.5),
  ('A9PApeDzYvnRfZbYTqi9SGYBAegectD7U58jvthAcd57', 'USDC', 'SOL', 100.00, 0.95, 'pending', 0.05, 0.3),
  ('11111111111111111111111111111112', 'SOL', 'USDC', 0.5, 50.00, 'completed', 0.05, 0.3);

-- Verify setup
SELECT 
  'Database setup completed' as status,
  COUNT(*) as transaction_count,
  COUNT(DISTINCT wallet_address) as unique_wallets
FROM transactions; 