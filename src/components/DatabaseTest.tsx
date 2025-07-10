import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const DatabaseTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');
  const { toast } = useToast();

  const testDatabaseConnection = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
      const result = await apiClient.testDatabase();
      setTestResult(`✅ Database connection successful: ${JSON.stringify(result, null, 2)}`);
      toast({
        title: "Success",
        description: "Database connection test passed",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTestResult(`❌ Database connection failed: ${errorMessage}`);
      toast({
        title: "Error",
        description: "Database connection test failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const testTransactionCreation = async () => {
    setLoading(true);
    setTestResult('');
    
    try {
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

      const result = await apiClient.createTransaction(testTransaction);
      setTestResult(`✅ Transaction created successfully: ${JSON.stringify(result, null, 2)}`);
      toast({
        title: "Success",
        description: "Transaction creation test passed",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setTestResult(`❌ Transaction creation failed: ${errorMessage}`);
      toast({
        title: "Error",
        description: "Transaction creation test failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[#1C1C28] border-[#2A2A3A] rounded-2xl p-4">
      <h3 className="text-white text-lg font-bold mb-4">Database Test</h3>
      
      <div className="space-y-3">
        <Button
          onClick={testDatabaseConnection}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? 'Testing...' : 'Test Database Connection'}
        </Button>
        
        <Button
          onClick={testTransactionCreation}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {loading ? 'Testing...' : 'Test Transaction Creation'}
        </Button>
      </div>

      {testResult && (
        <div className="mt-4 p-3 bg-[#1A1A25] border border-[#2A2A3A] rounded-lg">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap">
            {testResult}
          </pre>
        </div>
      )}
    </Card>
  );
};

export default DatabaseTest; 