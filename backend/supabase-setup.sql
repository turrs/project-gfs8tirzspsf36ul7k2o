-- SolSwap Database Setup
-- Run these commands in your Supabase SQL Editor

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

-- Enable Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions table
CREATE POLICY "Users can view their own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" ON transactions
  FOR UPDATE USING (auth.uid() = user_id);

-- Public read access for recent transactions (optional)
CREATE POLICY "Public can view recent transactions" ON transactions
  FOR SELECT USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Note: Sample data insertion is commented out because it requires valid user_id
-- from auth.users table. Uncomment and update with actual user IDs after creating users.

-- INSERT INTO transactions (user_id, from_token, to_token, from_amount, to_amount, status, fee_amount, slippage)
-- VALUES 
--   ('actual-user-id-here', 'SOL', 'USDC', 1.5, 150.00, 'completed', 0.1, 0.5),
--   ('actual-user-id-here', 'USDC', 'SOL', 100.00, 0.95, 'pending', 0.05, 0.3); 