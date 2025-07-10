import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Card } from '@/components/ui/card';
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { PublicKey } from '@solana/web3.js';

interface Transaction {
  id: string;
  wallet_address?: string;
  from_token: string;
  to_token: string;
  from_amount: string;
  to_amount: string;
  status: 'pending' | 'completed' | 'failed';
  tx_hash?: string;
  created_at: string;
  fee_amount: string;
  slippage: string;
}

const RecentTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { connected, walletAddress } = useWallet();

  const fetchTransactions = async () => {
    if (!connected || !walletAddress) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getRecentTransactions(walletAddress);
      setTransactions(response.transactions || []);
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (connected && walletAddress) {
      fetchTransactions();
    } else {
      setTransactions([]);
    }
  }, [connected, walletAddress]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatAmount = (amount: string) => {
    return parseFloat(amount).toFixed(4);
  };

  const handleConnect = async () => {
    if (window.solana && window.solana.isPhantom) {
      try {
        const resp = await window.solana.connect();
        // resp.publicKey is a PublicKey object from @solana/web3.js
        // You can now use resp.publicKey.toString() as the wallet address
        // Optionally, update your wallet state here if not using useWallet
      } catch (err) {
        console.error('Wallet connection failed:', err);
      }
    } else {
      window.open('https://phantom.app/', '_blank');
    }
  };

  return (
    <Card className="bg-[#1C1C28] border-[#2A2A3A] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-lg font-bold">Recent Transactions</h3>
        <button
          onClick={fetchTransactions}
          disabled={loading || !connected || !walletAddress}
          className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-[#2A2A3A] transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {!connected || !walletAddress ? (
        <div className="text-center text-gray-400 py-8">
          Connect your wallet to view recent transactions.
        </div>
      ) : loading ? (
        <div className="text-center text-gray-400 py-8">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
          Loading transactions...
        </div>
      ) : error ? (
        <div className="text-center text-red-400 py-8">
          {error}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No recent transactions found.
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-[#1A1A25] border border-[#2A2A3A] rounded-xl p-4 hover:bg-[#2A2A3A] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">
                    {formatAmount(tx.from_amount)} {tx.from_token}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="text-white font-medium">
                    {formatAmount(tx.to_amount)} {tx.to_token}
                  </span>
                </div>
              </div>
              {tx.tx_hash && (
                <div className="mt-2 text-xs text-gray-500">
                  <span className="font-medium">TX:</span> {tx.tx_hash.slice(0, 8)}...{tx.tx_hash.slice(-8)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RecentTransactions; 