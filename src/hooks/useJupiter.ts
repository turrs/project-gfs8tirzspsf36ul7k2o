import { useState, useCallback } from 'react';
import { JUPITER_API_BASE } from '../lib/solana';
import { Token } from '../lib/tokens';

interface QuoteResponse {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  platformFee?: any;
  priceImpactPct: string;
  routePlan: RouteInfo[];
}

interface RouteInfo {
  swapInfo: {
    ammKey: string;
    label: string;
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    feeAmount: string;
    feeMint: string;
  };
  percent: number;
}

interface SwapResponse {
  swapTransaction: string;
  lastValidBlockHeight: number;
}

interface UseJupiterReturn {
  quote: QuoteResponse | null;
  loading: boolean;
  error: string | null;
  getQuote: (fromToken: Token, toToken: Token, amount: string, slippage?: number) => Promise<void>;
  executeSwap: (wallet: any) => Promise<string>;
  resetQuote: () => void;
}

export const useJupiter = (): UseJupiterReturn => {
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuote = useCallback(async (
    fromToken: Token,
    toToken: Token,
    amount: string,
    slippage: number = 50 // 0.5% default slippage
  ) => {
    if (!amount || parseFloat(amount) <= 0) {
      setQuote(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert amount to raw units
      const rawAmount = Math.floor(parseFloat(amount) * Math.pow(10, fromToken.decimals));

      const params = new URLSearchParams({
        inputMint: fromToken.address,
        outputMint: toToken.address,
        amount: rawAmount.toString(),
        slippageBps: slippage.toString(),
        onlyDirectRoutes: 'false',
        asLegacyTransaction: 'false'
      });

      const response = await fetch(`${JUPITER_API_BASE}/quote?${params}`);
      
      if (!response.ok) {
        throw new Error(`Quote request failed: ${response.statusText}`);
      }

      const quoteData = await response.json();
      
      if (quoteData.error) {
        throw new Error(quoteData.error);
      }

      setQuote(quoteData);
    } catch (err) {
      console.error('Error getting quote:', err);
      setError(err instanceof Error ? err.message : 'Failed to get quote');
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const executeSwap = useCallback(async (wallet: any): Promise<string> => {
    if (!quote || !wallet.publicKey) {
      throw new Error('No quote available or wallet not connected');
    }

    setLoading(true);
    setError(null);

    try {
      // Get swap transaction
      const swapResponse = await fetch(`${JUPITER_API_BASE}/swap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey: wallet.publicKey.toString(),
          wrapAndUnwrapSol: true,
          dynamicComputeUnitLimit: true,
          prioritizationFeeLamports: 'auto'
        }),
      });

      if (!swapResponse.ok) {
        throw new Error(`Swap request failed: ${swapResponse.statusText}`);
      }

      const swapData: SwapResponse = await swapResponse.json();

      if (!swapData.swapTransaction) {
        throw new Error('No swap transaction returned');
      }

      // Deserialize and send transaction
      const swapTransactionBuf = Buffer.from(swapData.swapTransaction, 'base64');
      const transaction = require('@solana/web3.js').VersionedTransaction.deserialize(swapTransactionBuf);

      // Send transaction through wallet
      const signature = await wallet.sendTransaction(transaction, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 3
      });

      console.log('Swap transaction sent:', signature);
      return signature;

    } catch (err) {
      console.error('Error executing swap:', err);
      setError(err instanceof Error ? err.message : 'Failed to execute swap');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [quote]);

  const resetQuote = useCallback(() => {
    setQuote(null);
    setError(null);
  }, []);

  return {
    quote,
    loading,
    error,
    getQuote,
    executeSwap,
    resetQuote
  };
};