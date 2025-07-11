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
import { getTokenBalance, formatSolAmount } from '@/lib/solana';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RecentTransactions from './RecentTransactions';
import { apiClient } from '@/lib/api';

export function useJupiterPrice(fromToken, toToken, amount = "1") {
  const { quote, getQuote, loading, error } = useJupiter();

  useEffect(() => {
    if (fromToken && toToken) {
      getQuote(fromToken, toToken, amount);
    }
  }, [fromToken, toToken, amount, getQuote]);

  let price = null;
  if (quote) {
    price = (parseFloat(quote.outAmount) / Math.pow(10, toToken.decimals)) /
            (parseFloat(quote.inAmount) / Math.pow(10, fromToken.decimals));
  }

  return { price, loading, error };
}

export const SwapInterface: React.FC<{
  fromToken: Token | null;
  toToken: Token | null;
  setFromToken: (token: Token) => void;
  setToToken: (token: Token) => void;
}> = ({ fromToken, toToken, setFromToken, setToToken }) => {
  const { connected, connect, disconnect, publicKey, wallet, connecting, walletAddress } = useWallet();
  const { quote, loading, error, getQuote, executeSwap, resetQuote } = useJupiter();
  
  const [fromAmount, setFromAmount] = useState('');
  const [showFromTokenSelector, setShowFromTokenSelector] = useState(false);
  const [showToTokenSelector, setShowToTokenSelector] = useState(false);
  const [slippage, setSlippage] = useState(0.5);
  const [isSwapping, setIsSwapping] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'pending' | 'success' | 'error' | null>(null);
  const [transactionSignature, setTransactionSignature] = useState<string>('');
  const [transactionError, setTransactionError] = useState<string>('');
  const [fromTokenBalance, setFromTokenBalance] = useState<string>('');
  const [loadingFromTokenBalance, setLoadingFromTokenBalance] = useState(false);
  const [showSlippageDialog, setShowSlippageDialog] = useState(false);
  const [manualSlippage, setManualSlippage] = useState('');
  const [balanceRefreshKey, setBalanceRefreshKey] = useState(0);

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

  // Fetch balance for selected fromToken
  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress || !connected || !fromToken) {
        setFromTokenBalance('');
        return;
      }
      setLoadingFromTokenBalance(true);
      try {
        const rawBalance = await getTokenBalance(walletAddress, fromToken.address);
        const formatted = fromToken.symbol === 'SOL'
          ? formatSolAmount(rawBalance)
          : (rawBalance / Math.pow(10, fromToken.decimals)).toFixed(4);
        setFromTokenBalance(formatted);
      } catch {
        setFromTokenBalance('0.00');
      } finally {
        setLoadingFromTokenBalance(false);
      }
    };
    fetchBalance();
  }, [walletAddress, connected, fromToken, balanceRefreshKey]);

  // Only reset amount when wallet disconnects
  useEffect(() => {
    if (!connected) {
      setFromAmount('');
    }
  }, [connected]);

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
    const balance = parseFloat(fromTokenBalance || '0');
    if (!isNaN(balance) && balance > 0) {
      setFromAmount(balance.toFixed(2));
    }
  };

  const handleHalfClick = () => {
    const balance = parseFloat(fromTokenBalance || '0');
    if (!isNaN(balance) && balance > 0) {
      setFromAmount((balance / 2).toFixed(2));
    }
  };

  const handleSlippageSelect = (value: number) => {
    setSlippage(value);
    setManualSlippage('');
    setShowSlippageDialog(false);
  };

  const handleManualSlippage = () => {
    const value = parseFloat(manualSlippage);
    if (!isNaN(value) && value > 0) {
      setSlippage(value);
      setShowSlippageDialog(false);
    }
  };

  const handleSwap = async () => {
    if (!connected || !walletAddress || !quote) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsSwapping(true);
    setTransactionStatus('pending');

    try {
      const signature = await executeSwap(wallet);
      
          // Store the signature as a string
    const txHash = signature || '';
    setTransactionSignature(txHash);
      
              // Save transaction to backend
        try {
          const transactionData = {
            from_token: fromToken?.symbol || '',
            to_token: toToken?.symbol || '',
            from_amount: fromAmount,
            to_amount: quote ? (parseFloat(quote.outAmount) / Math.pow(10, toToken?.decimals || 1)).toString() : '0',
            tx_hash: txHash,
            status: 'pending',
            fee_amount: '0.1', // You can calculate this from the quote
            slippage: slippage.toString(),
            wallet_address: walletAddress
          };
          
          const result = await apiClient.createTransaction(transactionData);
        } catch (backendError) {
          console.error('Failed to save transaction to backend:', backendError);
          // Don't fail the swap if backend save fails
          toast.error('Transaction completed but failed to save to database');
        }
      
      setTransactionStatus('success');
      toast.success('Swap completed successfully!');
      
      setFromAmount('');
      resetQuote();
      setBalanceRefreshKey((k) => k + 1); // <-- Add this
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
    if (fromToken?.symbol === 'SOL' && walletAddress) {
      return true; // Assuming solBalance is not directly available here, so we'll always allow for SOL
    }
    return true;
  };

  const canSwap = connected && quote && fromAmount && !loading && !isSwapping && hasEnoughBalance();

  const getEstimatedUsdValue = (amount: string) => {
    // This is a placeholder - in a real app, you'd use an oracle or API for price data
    const price = fromToken?.symbol === 'SOL' ? 154.35 : 0.99985;
    return parseFloat(amount || '0') * price;
  };

  // Get token balance based on selected token
  const getTokenBalanceText = () => {
    if (!connected) return '';
    if (loadingFromTokenBalance) return 'Loading...';
    if (!fromTokenBalance) return 'Balance: 0.00';
    return `Balance: ${fromTokenBalance} ${fromToken?.symbol}`;
  };

  const handleRefresh = () => {
    if (fromToken && toToken && fromAmount) {
      getQuote(fromToken, toToken, fromAmount, slippage * 100);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Swap Card - New Design */}
      <Card className="bg-[#1C1C28] border-[#2A2A3A] rounded-2xl overflow-hidden">
        {/* Settings Bar */}
        <div className="flex items-center justify-between p-4 border-b border-[#2A2A3A]">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white p-2 rounded-full"
              onClick={() => setShowSlippageDialog(true)}
              aria-label="Change slippage"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <span className="text-xs text-[#9AE462]">Slippage: {slippage}%</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white p-2 rounded-full"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {/* Slippage Dialog */}
        <Dialog open={showSlippageDialog} onOpenChange={setShowSlippageDialog}>
          <DialogContent className="bg-[#1C1C28] border-[#2A2A3A] text-white max-w-xs w-full p-0 rounded-2xl">
            <DialogHeader className="p-4 border-b border-[#2A2A3A]">
              <DialogTitle className="text-white">Select Slippage</DialogTitle>
            </DialogHeader>
            <div className="p-4 space-y-3">
              <div className="flex space-x-2">
                {[3, 5, 10].map((val) => (
                  <Button
                    key={val}
                    variant={slippage === val ? 'default' : 'outline'}
                    className="rounded-full px-4 py-2"
                    onClick={() => handleSlippageSelect(val)}
                  >
                    {val}%
                  </Button>
                ))}
                <Button
                  variant={manualSlippage !== '' ? 'default' : 'outline'}
                  className="rounded-full px-4 py-2"
                  onClick={() => setManualSlippage(slippage.toString())}
                >
                  Manual
                </Button>
              </div>
              {manualSlippage !== '' && (
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={manualSlippage}
                    onChange={e => setManualSlippage(e.target.value)}
                    className="w-20 bg-[#2A2A3A] border-[#3A3A4A] text-white rounded-xl"
                    placeholder="Custom %"
                  />
                  <Button onClick={handleManualSlippage} className="rounded-full px-4 py-2">Set</Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* From Token Section */}
        <div className="p-6 bg-[#1A1A25] border-b border-[#2A2A3A]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Selling</span>
              <span className="text-xs text-gray-500 mt-1">{getTokenBalanceText()}</span>
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
              {fromToken?.logoURI && (
                <img
                  src={fromToken.logoURI}
                  alt={fromToken.symbol}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="font-bold text-white">{fromToken?.symbol}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
            
            <div className="text-right">
              <input
                type="text"
                value={fromAmount}
                onChange={e => handleFromAmountChange(e.target.value)}
                className="text-3xl font-bold text-white bg-transparent border-none outline-none text-right w-32"
                placeholder="0.00"
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
              />
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
                ≈ {(parseFloat(quote.outAmount) / Math.pow(10, toToken?.decimals)).toFixed(8)} {toToken?.symbol}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setShowToTokenSelector(true)}
              className="flex items-center space-x-2 bg-[#2A2A3A] hover:bg-[#3A3A4A] rounded-full px-4 py-2 h-auto"
            >
              {toToken?.logoURI && (
                <img
                  src={toToken.logoURI}
                  alt={toToken.symbol}
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="font-bold text-white">{toToken?.symbol}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-white">
                {quote ? (parseFloat(quote.outAmount) / Math.pow(10, toToken?.decimals)).toFixed(4) : '0.00'}
              </div>
              <div className="text-sm text-gray-400">
                ${quote ? ((parseFloat(quote.outAmount) / Math.pow(10, toToken?.decimals)) * (toToken?.symbol === 'SOL' ? 154.35 : 0.99985)).toFixed(2) : '0.00'}
              </div>
            </div>
          </div>
        </div>


        {/* Router Info */}
        <div className="px-6 py-4 border-t border-[#2A2A3A] flex items-center justify-between">
          <span className="text-sm text-gray-400">Routers: Auto</span>
          {quote && quote.priceImpactPct && (
            <span className="text-xs text-gray-400">Price Impact: <span className="font-semibold text-white">{(parseFloat(quote.priceImpactPct) * 100).toFixed(2)}%</span></span>
          )}
        </div>

        {/* Swap Button */}
        <div className="p-6 pt-2">
          {!connected ? (
            <Button
              onClick={() => connect()}
              disabled={connecting}
              className="w-full bg-[#9AE462] hover:bg-[#8AD452] text-[#1A1A25] font-bold py-6 rounded-xl"
            >
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          ) : (
            <Button
              onClick={handleSwap}
              disabled={!canSwap}
              className="w-full bg-[#9AE462] hover:bg-[#8AD452] text-[#1A1A25] font-bold py-6 rounded-xl"
            >
              {loading ? 'Getting Quote...' :
                isSwapping ? 'Swapping...' :
                !fromAmount ? 'Enter an amount' :
                !hasEnoughBalance() ? 'Insufficient Balance' :
                !quote ? 'Invalid Pair' :
                'Swap'}
            </Button>
          )}
        </div>

      


        {/* Previous Interface Link */}
        <div className="border-t border-[#2A2A3A] p-4">
          <Button variant="ghost" onClick={() => window.open('https://letsbonk.fun/token/Kqxig2UMsry1z9CxiKsAvDm4EeBaKq52qAfjJAKbonk', '_blank')} className="w-full justify-between text-gray-400 hover:text-white">
            <div className="text-left">
              <div className="text-sm">Contract Address </div>
              <div className="text-xs text-gray-500">Kqxig2UMsry1z9CxiKsAvDm4EeBaKq52qAfjJAKbonk</div>
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