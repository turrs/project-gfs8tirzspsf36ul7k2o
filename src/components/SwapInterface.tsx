import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, Settings, ChevronDown, Zap, RefreshCw } from 'lucide-react';
import { TokenSelector } from './TokenSelector';
import { TransactionStatus } from './TransactionStatus';
import { useWallet } from '@/hooks/useWallet';
import { useJupiter } from '@/hooks/useJupiter';
import { Token, DEFAULT_FROM_TOKEN, DEFAULT_TO_TOKEN, isValidTokenAmount } from '@/lib/tokens';
import { toast } from 'sonner';

export const SwapInterface: React.FC = () => {
  const { connected, wallet, solBalance, refreshBalance } = useWallet();
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
    if (!fromAmount || parseFloat(fromAmount) <= 0 || !fromToken || !toToken) {
      resetQuote();
      return;
    }

    // Debounce the quote request
    const handler = setTimeout(() => {
      getQuote(fromToken, toToken, fromAmount, slippage * 100);
    }, 500);

    return () => clearTimeout(handler);
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

  const handleHalfClick = () => {
    if (fromToken.symbol === 'SOL' && solBalance !== null) {
      const halfAmount = (solBalance - 0.01) / 2;
      if (halfAmount > 0) {
        setFromAmount(halfAmount.toFixed(4));
      }
    } else {
      setFromAmount('50.0');
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
      console.log('Swap transaction sent:', signature);
      
      // Store the signature as a string
      if (typeof signature === 'object' && signature.signature) {
        setTransactionSignature(signature.signature);
      } else if (typeof signature === 'string') {
        setTransactionSignature(signature);
      } else {
        setTransactionSignature(String(signature));
      }
      
      setTransactionStatus('success');
      toast.success('Swap completed successfully!');
      
      setFromAmount('');
      resetQuote();
      refreshBalance(); // Refresh balance after successful swap
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

  const getEstimatedUsdValue = (amount: string) => {
    // This is a placeholder - in a real app, you'd use an oracle or API for price data
    const price = fromToken.symbol === 'SOL' ? 154.35 : 0.99985;
    return parseFloat(amount || '0') * price;
  };

  // Get token balance based on selected token
  const getTokenBalance = () => {
    if (fromToken.symbol === 'SOL') {
      return solBalance !== null ? `${solBalance.toFixed(4)} SOL` : 'Loading...';
    }
    return 'Balance: 0.00'; // Placeholder for other tokens
  };

  return (
    <div className="space-y-6">
      {/* Main Swap Card - New Design */}
      <Card className="bg-[#1C1C28] border-[#2A2A3A] rounded-2xl overflow-hidden">
        {/* Settings Bar */}
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A3A]">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="rounded-full bg-[#2A2A3A] border-[#3A3A4A] text-white hover:bg-[#3A3A4A]">
              <span className="text-xs">Manual</span>
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-[#2A2A3A] border-[#3A3A4A] text-white hover:bg-[#3A3A4A]">
              <span className="text-xs text-[#9AE462]">31%</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2 rounded-full">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* From Token Section */}
        <div className="p-6 bg-[#1A1A25] border-b border-[#2A2A3A]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Selling</span>
              <span className="text-xs text-gray-500 mt-1">{getTokenBalance()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleHalfClick}
                className="rounded-full bg-[#2A2A3A] border-[#3A3A4A] text-white hover:bg-[#3A3A4A] h-8 px-4"
              >
                HALF
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleMaxClick}
                className="rounded-full bg-[#2A2A3A] border-[#3A3A4A] text-white hover:bg-[#3A3A4A] h-8 px-4"
              >
                MAX
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setShowFromTokenSelector(true)}
              className="flex items-center space-x-2 bg-[#2A2A3A] hover:bg-[#3A3A4A] rounded-full px-4 py-2 h-auto"
            >
              {fromToken.logoURI && (
                <img
                  src={fromToken.logoURI}
                  alt={fromToken.symbol}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="font-bold text-white">{fromToken.symbol}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {fromAmount || '0.00'}
              </div>
              <div className="text-sm text-gray-400">
                ${getEstimatedUsdValue(fromAmount).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSwapTokens}
            className="absolute -top-4 bg-[#2A2A3A] hover:bg-[#3A3A4A] rounded-full p-2 border border-[#3A3A4A] z-10"
          >
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
          </Button>
        </div>

        {/* To Token Section */}
        <div className="p-6 bg-[#1A1A25]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Buying</span>
            {quote && (
              <span className="text-xs text-gray-400">
                ≈ {(parseFloat(quote.outAmount) / Math.pow(10, toToken.decimals)).toFixed(8)} {toToken.symbol}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setShowToTokenSelector(true)}
              className="flex items-center space-x-2 bg-[#2A2A3A] hover:bg-[#3A3A4A] rounded-full px-4 py-2 h-auto"
            >
              {toToken.logoURI && (
                <img
                  src={toToken.logoURI}
                  alt={toToken.symbol}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="font-bold text-white">{toToken.symbol}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {quote ? (parseFloat(quote.outAmount) / Math.pow(10, toToken.decimals)).toFixed(4) : '0.00'}
              </div>
              <div className="text-sm text-gray-400">
                ${quote ? ((parseFloat(quote.outAmount) / Math.pow(10, toToken.decimals)) * (toToken.symbol === 'SOL' ? 154.35 : 0.99985)).toFixed(2) : '0.00'}
              </div>
            </div>
          </div>
        </div>

        {/* Router Info */}
        <div className="px-6 py-4 border-t border-[#2A2A3A]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Routers: Auto</span>
          </div>
        </div>

        {/* Swap Button */}
        <div className="p-6 pt-2">
          <Button
            onClick={handleSwap}
            disabled={!canSwap}
            className="w-full bg-[#9AE462] hover:bg-[#8AD452] text-[#1A1A25] font-bold py-6 rounded-xl"
          >
            {!connected ? 'Connect Wallet' : 
             loading ? 'Getting Quote...' :
             isSwapping ? 'Swapping...' :
             !fromAmount ? 'Enter an amount' :
             !hasEnoughBalance() ? 'Insufficient Balance' :
             !quote ? 'Invalid Pair' :
             'Swap'}
          </Button>
        </div>

        {/* Token Price Info */}
        <div className="px-6 pb-6 flex space-x-4">
          <div className="flex-1 bg-[#1A1A25] rounded-xl p-4">
            <div className="flex items-center space-x-2">
              {fromToken.logoURI && (
                <img
                  src={fromToken.logoURI}
                  alt={fromToken.symbol}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="font-bold text-white">{fromToken.symbol}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold text-white">${fromToken.symbol === 'SOL' ? '154.35' : '0.99985'}</span>
              <span className={`text-sm ${fromToken.symbol === 'SOL' ? 'text-green-400' : 'text-red-400'}`}>
                {fromToken.symbol === 'SOL' ? '+1.35%' : '0%'}
              </span>
            </div>
          </div>
          
          <div className="flex-1 bg-[#1A1A25] rounded-xl p-4">
            <div className="flex items-center space-x-2">
              {toToken.logoURI && (
                <img
                  src={toToken.logoURI}
                  alt={toToken.symbol}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="font-bold text-white">{toToken.symbol}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-lg font-bold text-white">${toToken.symbol === 'SOL' ? '154.35' : '0.99985'}</span>
              <span className={`text-sm ${toToken.symbol === 'SOL' ? 'text-green-400' : 'text-red-400'}`}>
                {toToken.symbol === 'SOL' ? '+1.35%' : '0%'}
              </span>
            </div>
          </div>
        </div>

        {/* Previous Interface Link */}
        <div className="border-t border-[#2A2A3A] p-4">
          <Button variant="ghost" className="w-full justify-between text-gray-400 hover:text-white">
            <div className="text-left">
              <div className="text-sm">Prefer the previous swap interface?</div>
              <div className="text-xs text-gray-500">Head to the dedicated Swap page</div>
            </div>
            <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
          </Button>
        </div>
      </Card>

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