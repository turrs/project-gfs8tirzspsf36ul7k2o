-- SolSwap Database Setup (Safe Version)
-- Run these commands in your Supabase SQL Editor

-- Step 1: Create transactions table with wallet_address instead of user_id
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

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_address ON transactions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Step 3: No foreign key constraint needed since we're using wallet_address
-- This step is removed as we're not using user_id anymore

-- Step 4: Enable Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policies for transactions table
-- Policy for users to view their own transactions
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (
    wallet_address IS NULL -- Allow viewing all transactions for now
  );

-- Policy for users to insert their own transactions
CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (true); -- Allow inserting transactions

-- Policy for users to update their own transactions
CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (true); -- Allow updating transactions

-- Public read access for recent transactions
CREATE POLICY "Public can view recent transactions" ON transactions
  FOR SELECT USING (true);

-- Step 6: Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 7: Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 8: Insert sample data (only if you want to test)
-- Uncomment the lines below and replace 'your-wallet-address' with an actual wallet address

-- INSERT INTO transactions (wallet_address, from_token, to_token, from_amount, to_amount, status, fee_amount, slippage)
-- VALUES 
--   ('your-wallet-address-here', 'SOL', 'USDC', 1.5, 150.00, 'completed', 0.1, 0.5),
--   ('your-wallet-address-here', 'USDC', 'SOL', 100.00, 0.95, 'pending', 0.05, 0.3);

-- Step 9: Verify setup
SELECT 
  'Table created successfully' as status,
  COUNT(*) as transaction_count
FROM transactions; 