-- Reset Database (Use with caution!)
-- This will drop and recreate the transactions table

-- Step 1: Drop existing table and related objects
DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
DROP TABLE IF EXISTS transactions CASCADE;

-- Step 2: Drop the function (will be recreated)
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Step 3: Recreate the table
CREATE TABLE transactions (
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

-- Step 4: Create indexes
CREATE INDEX idx_transactions_wallet_address ON transactions(wallet_address);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_status ON transactions(status);

-- Step 5: Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Step 6: Create policies
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (true); -- Allow viewing all transactions

CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (true); -- Allow inserting transactions

CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (true); -- Allow updating transactions

CREATE POLICY "Public can view recent transactions" ON transactions
  FOR SELECT USING (true);

-- Step 7: Recreate function and trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Step 8: Verify reset
SELECT 
  'Database reset completed' as status,
  COUNT(*) as transaction_count
FROM transactions; 