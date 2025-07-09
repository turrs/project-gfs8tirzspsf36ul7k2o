import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, Settings, ChevronDown, Zap } from 'lucide-react';
import { TokenSelector } from './TokenSelector';
import { PriceDisplay } from './PriceDisplay';
import { TransactionStatus } from './TransactionStatus';
import { useWallet } from '@/hooks/useWallet';
import { useJupiter } from '@/hooks/useJupiter';
import { Token, DEFAULT_FROM_TOKEN, DEFAULT_TO_TOKEN, isValidTokenAmount } from '@/lib/tokens';
import { toast } from 'sonner';

export const SwapInterface: React.FC = () => {
  const { connected, wallet, solBalance } = useWallet();
  const { quote, loading, error, getQuote, executeSwap, resetQuote } = useJupiter();
  
  const [fromToken, setFromToken] = useState<Token>(DEFAULT_FROM_TOKEN);
  const [toToken, setToToken] = useState<Token>(DEFAULT_TO_TOKEN);
  const [fromAmount, setFromAmount] = useState('');
  const [showFromTokenSelector, setShowFromTokenSelector] = useState(false);
  const [showToTokenSelector, setShowToTokenSelector] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [isSwapping, setIsSwapping] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'success' | 'error' | null>(null);
  const [transactionSignature, setTransactionSignature] = useState<string>('');
  const [transactionError, setTransactionError] = useState<string>('');

  // Get quote when amount or tokens change
  useEffect(() => {
    if (fromAmount && isValidTokenAmount(fromAmount) && fromToken && toToken) {
      const debounceTimer = setTimeout(() => {
        getQuote(fromToken, toToken, fromAmount, slippage * 100);
      }, 500);

      return () => clearTimeout(debounceTimer);
    } else {
      resetQuote();
    }
  }, [fromAmount, fromToken, toToken, slippage, getQuote, resetQuote]);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount('');
    resetQuote();
  };

  const handleFromAmountChange = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  };

  const handleMaxClick = () => {
    if (fromToken.symbol === 'SOL' && solBalance !== null) {
      const maxAmount = Math.max(0, solBalance - 0.01);
      setFromAmount(maxAmount.toFixed(4));
    } else {
      setFromAmount('100.0');
      toast.info('Token balance fetching not implemented yet');
    }
  };

  const handleSwap = async () => {
    if (!connected || !wallet || !quote) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsSwapping(true);
    setTransactionStatus('pending');

    try {
      const signature = await executeSwap(wallet);
      setTransactionSignature(signature);
      setTransactionStatus('success');
      toast.success('Swap completed successfully!');
      
      setFromAmount('');
      resetQuote();
    } catch (err) {
      console.error('Swap failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Swap failed';
      setTransactionError(errorMessage);
      setTransactionStatus('error');
      toast.error(errorMessage);
    } finally {
      setIsSwapping(false);
    }
  };

  const hasEnoughBalance = () => {
    if (fromToken.symbol === 'SOL' && solBalance !== null && fromAmount) {
      return parseFloat(fromAmount) <= solBalance - 0.01;
    }
    return true;
  };

  const canSwap = connected && quote && fromAmount && !loading && !isSwapping && hasEnoughBalance();

  return (
    <div className="space-y-6">
      {/* Main Swap Card - Raydium 2021 Style */}
      <Card className="raydium-card p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Swap
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-purple-300 hover:text-white hover:bg-purple-500/20 rounded-xl p-3"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* From Token Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-purple-300">From</label>
              <button
                onClick={handleMaxClick}
                className="text-xs text-pink-400 hover:text-pink-300 transition-colors font-medium"
              >
                MAX {fromToken.symbol === 'SOL' && solBalance !== null && `(${solBalance.toFixed(4)})`}
              </button>
            </div>
            
            <div className="bg-slate-800/60 rounded-2xl p-6 border border-purple-400/20">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowFromTokenSelector(true)}
                  className="flex items-center space-x-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-2xl px-4 py-3 h-auto border border-purple-400/20"
                >
                  {fromToken.logoURI && (
                    <img
                      src={fromToken.logoURI}
                      alt={fromToken.symbol}
                      className="token-logo"
                    />
                  )}
                  <span className="font-bold text-white text-lg">{fromToken.symbol}</span>
                  <ChevronDown className="w-5 h-5 text-purple-300" />
                </Button>
                
                <Input
                  type="text"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  className="flex-1 bg-transparent border-none text-right text-3xl font-bold text-white placeholder-gray-500 focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSwapTokens}
              className="bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 rounded-2xl p-4 border border-purple-400/30 neon-glow"
            >
              <ArrowUpDown className="w-6 h-6 text-white" />
            </Button>
          </div>

          {/* To Token Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-purple-300">To</label>
            
            <div className="bg-slate-800/60 rounded-2xl p-6 border border-purple-400/20">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setShowToTokenSelector(true)}
                  className="flex items-center space-x-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-2xl px-4 py-3 h-auto border border-purple-400/20"
                >
                  {toToken.logoURI && (
                    <img
                      src={toToken.logoURI}
                      alt={toToken.symbol}
                      className="token-logo"
                    />
                  )}
                  <span className="font-bold text-white text-lg">{toToken.symbol}</span>
                  <ChevronDown className="w-5 h-5 text-purple-300" />
                </Button>
                
                <div className="flex-1 text-right">
                  <div className="text-3xl font-bold text-white">
                    {quote ? (parseFloat(quote.outAmount) / Math.pow(10, toToken.decimals)).toFixed(6) : '0.0'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-4">
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Insufficient Balance Warning */}
          {fromToken.symbol === 'SOL' && solBalance !== null && parseFloat(fromAmount) > solBalance - 0.01 && (
            <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-2xl p-4">
              <p className="text-sm text-yellow-400 font-medium">
                Insufficient balance. You need to keep at least 0.01 SOL for transaction fees.
              </p>
            </div>
          )}

          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={!canSwap}
            className="w-full raydium-button h-16 text-xl font-bold"
          >
            {!connected ? 'Connect Wallet' : 
             loading ? 'Getting Quote...' :
             isSwapping ? 'Swapping...' :
             !fromAmount ? 'Enter Amount' :
             !hasEnoughBalance() ? 'Insufficient Balance' :
             !quote ? 'Invalid Pair' :
             'SWAP'}
          </Button>
        </div>
      </Card>

      {/* Price Display */}
      <PriceDisplay
        quote={quote}
        fromToken={fromToken}
        toToken={toToken}
        loading={loading}
      />

      {/* Token Selectors */}
      <TokenSelector
        isOpen={showFromTokenSelector}
        onClose={() => setShowFromTokenSelector(false)}
        onSelectToken={setFromToken}
        selectedToken={fromToken}
        title="Select Token to Swap From"
      />

      <TokenSelector
        isOpen={showToTokenSelector}
        onClose={() => setShowToTokenSelector(false)}
        onSelectToken={setToToken}
        selectedToken={toToken}
        title="Select Token to Swap To"
      />

      {/* Transaction Status Modal */}
      <TransactionStatus
        isOpen={transactionStatus !== null}
        onClose={() => {
          setTransactionStatus(null);
          setTransactionSignature('');
          setTransactionError('');
        }}
        status={transactionStatus}
        signature={transactionSignature}
        error={transactionError}
      />
    </div>
  );
};