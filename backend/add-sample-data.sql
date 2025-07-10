-- Add Sample Transaction Data
-- Run this to add sample transaction data with wallet addresses

-- Step 1: Insert sample transactions with wallet addresses
INSERT INTO transactions (wallet_address, from_token, to_token, from_amount, to_amount, status, fee_amount, slippage)
VALUES 
  ('A9PApeDzYvnRfZbYTqi9SGYBAegectD7U58jvthAcd57', 'SOL', 'USDC', 1.5, 150.00, 'completed', 0.1, 0.5),
  ('A9PApeDzYvnRfZbYTqi9SGYBAegectD7U58jvthAcd57', 'USDC', 'SOL', 100.00, 0.95, 'pending', 0.05, 0.3),
  ('A9PApeDzYvnRfZbYTqi9SGYBAegectD7U58jvthAcd57', 'SOL', 'USDT', 2.0, 200.00, 'completed', 0.15, 0.4),
  ('A9PApeDzYvnRfZbYTqi9SGYBAegectD7U58jvthAcd57', 'USDT', 'SOL', 150.00, 1.45, 'failed', 0.08, 0.6),
  ('11111111111111111111111111111112', 'SOL', 'USDC', 0.5, 50.00, 'completed', 0.05, 0.3),
  ('11111111111111111111111111111112', 'USDC', 'SOL', 75.00, 0.7, 'pending', 0.04, 0.2);

RAISE NOTICE 'Sample data inserted successfully';

-- Step 2: Verify the sample data was inserted
SELECT 
  'Sample data verification' as check_type,
  COUNT(*) as total_transactions,
  COUNT(DISTINCT wallet_address) as unique_wallets,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_transactions,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_transactions,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_transactions
FROM transactions;

-- Step 3: Show recent transactions
SELECT 
  id,
  wallet_address,
  from_token,
  to_token,
  from_amount,
  to_amount,
  status,
  created_at
FROM transactions 
ORDER BY created_at DESC 
LIMIT 5; 