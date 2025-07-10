const { supabase } = require('./config/supabase');

async function testTransactionCreation() {
  console.log('🧪 Testing transaction creation...');
  
  const testTransaction = {
    wallet_address: 'TestWallet123456789',
    from_token: 'SOL',
    to_token: 'USDC',
    from_amount: '1.0',
    to_amount: '100.0',
    tx_hash: 'test_hash_' + Date.now(),
    status: 'pending',
    fee_amount: '0.1',
    slippage: '0.5'
  };

  console.log('📝 Transaction data:', testTransaction);

  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert(testTransaction)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return;
    }

    console.log('✅ Transaction created successfully:', data);
  } catch (error) {
    console.error('❌ Error creating transaction:', error);
  }
}

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Database connection error:', error);
      return;
    }

    console.log('✅ Database connection successful');
    console.log('📊 Data:', data);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

async function main() {
  console.log('🚀 Starting debug tests...\n');
  
  await testDatabaseConnection();
  console.log('');
  await testTransactionCreation();
  
  console.log('\n🏁 Debug tests completed');
}

main().catch(console.error); 