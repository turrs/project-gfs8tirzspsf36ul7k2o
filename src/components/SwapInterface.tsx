import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, Settings, ChevronDown } from 'lucide-react';
import { TokenSelector } from './TokenSelector';
import { PriceDisplay } from './PriceDisplay';
import { TransactionStatus } from './TransactionStatus';
import { useWallet } from '@/hooks/useWallet';
import { useJupiter } from '@/hooks/useJupiter';
import { Token, DEFAULT_FROM_TOKEN, DEFAULT_TO_TOKEN, isValidTokenAmount } from '@/lib/tokens';
import { toast } from 'sonner';

export const SwapInterface: React.FC = () => {
  const { connected, wallet } = useWallet();
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
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
    }
  };

  const handleMaxClick = () => {
    // In a real implementation, you would get the actual token balance
    // For demo purposes, we'll set a placeholder amount
    if (fromToken.symbol === 'SOL') {
      setFromAmount('1.0');
    } else {
      setFromAmount('100.0');
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
      
      // Reset form
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

  const canSwap = connected && quote && fromAmount && !loading && !isSwapping;

  return (
    <div className="space-y-4">
      {/* Main Swap Card */}
      <Card className="dex-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Swap</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* From Token Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">From</label>
              <button
                onClick={handleMaxClick}
                className="text-xs text-dex-primary hover:text-dex-primary/80 transition-colors"
              >
                MAX
              </button>
            </div>
            
            <div className="bg-dex-gray/30 rounded-xl p-4 border border-white/10">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowFromTokenSelector(true)}
                  className="flex items-center space-x-2 bg-dex-gray/50 hover:bg-dex-gray/70 rounded-xl px-3 py-2 h-auto"
                >
                  {fromToken.logoURI && (
                    <img
                      src={fromToken.logoURI}
                      alt={fromToken.symbol}
                      className="token-logo"
                    />
                  )}
                  <span className="font-semibold text-white">{fromToken.symbol}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Button>
                
                <Input
                  type="text"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => handleFromAmountChange(e.target.value)}
                  className="flex-1 bg-transparent border-none text-right text-2xl font-semibold text-white placeholder-gray-500 focus:ring-0 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSwapTokens}
              className="bg-dex-gray/30 hover:bg-dex-gray/50 rounded-full p-2 border border-white/10"
            >
              <ArrowUpDown className="w-5 h-5 text-gray-400" />
            </Button>
          </div>

          {/* To Token Input */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400">To</label>
            
            <div className="bg-dex-gray/30 rounded-xl p-4 border border-white/10">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowToTokenSelector(true)}
                  className="flex items-center space-x-2 bg-dex-gray/50 hover:bg-dex-gray/70 rounded-xl px-3 py-2 h-auto"
                >
                  {toToken.logoURI && (
                    <img
                      src={toToken.logoURI}
                      alt={toToken.symbol}
                      className="token-logo"
                    />
                  )}
                  <span className="font-semibold text-white">{toToken.symbol}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Button>
                
                <div className="flex-1 text-right">
                  <div className="text-2xl font-semibold text-white">
                    {quote ? (parseFloat(quote.outAmount) / Math.pow(10, toToken.decimals)).toFixed(6) : '0.0'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-dex-error/10 border border-dex-error/20 rounded-xl p-3">
              <p className="text-sm text-dex-error">{error}</p>
            </div>
          )}

          {/* Swap Button */}
          <Button
            onClick={handleSwap}
            disabled={!canSwap}
            className="w-full dex-button h-14 text-lg font-semibold"
          >
            {!connected ? 'Connect Wallet' : 
             loading ? 'Getting Quote...' :
             isSwapping ? 'Swapping...' :
             !fromAmount ? 'Enter Amount' :
             !quote ? 'Invalid Pair' :
             'Swap'}
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