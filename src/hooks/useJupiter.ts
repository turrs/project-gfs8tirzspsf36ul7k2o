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

// Import Buffer polyfill for browser environment
import { Buffer } from 'buffer';

export async function searchToken(query) {
  const url = `https://lite-api.jup.ag/ultra/v1/search?query=${encodeURIComponent(query)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Token search failed');
  return await response.json();
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

      const url = `${JUPITER_API_BASE}/quote?${params}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Quote request failed:', response.status, errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error) {
            throw new Error(errorData.error);
          }
        } catch (parseError) {
          // If we can't parse the error, use the status text
        }
        
        throw new Error(`Quote request failed: ${response.status} ${response.statusText}`);
      }

      const quoteData = await response.json();
      
      if (quoteData.error) {
        throw new Error(quoteData.error);
      }

      console.log('Quote received:', quoteData);
      setQuote(quoteData);
    } catch (err) {
      console.error('Error getting quote:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to get quote';
      setError(errorMessage);
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
      console.log('Starting swap execution...');
      console.log('Wallet object:', wallet);
      console.log('Available wallet methods:', Object.getOwnPropertyNames(wallet));

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
          prioritizationFeeLamports: 'auto',
          feeAccount: 'A9PApeDzYvnRfZbYTqi9SGYBAegectD7U58jvthAcd57',
          platformFeeBps: 1000, // 10% fee
        }),
      });

      if (!swapResponse.ok) {
        const errorText = await swapResponse.text();
        console.error('Swap request failed:', swapResponse.status, errorText);
        throw new Error(`Swap request failed: ${swapResponse.statusText}`);
      }

      const swapData: SwapResponse = await swapResponse.json();

      if (!swapData.swapTransaction) {
        throw new Error('No swap transaction returned');
      }

      console.log('Swap transaction received, processing...');

      // Use Buffer from the imported polyfill
      try {
        // Create a buffer from the base64 transaction
        const swapTransactionBuf = Buffer.from(swapData.swapTransaction, 'base64');
        
        // Dynamically import Solana Web3.js
        const solanaWeb3 = await import('@solana/web3.js');
        const transaction = solanaWeb3.VersionedTransaction.deserialize(swapTransactionBuf);
        
        console.log('Transaction deserialized successfully');

        // Check different wallet methods for sending transactions
        let signature: string;
        
        if (typeof wallet.signAndSendTransaction === 'function') {
          console.log('Using wallet.signAndSendTransaction method');
          const result = await wallet.signAndSendTransaction(transaction);
          // Handle different response formats
          signature = typeof result === 'object' && result.signature 
            ? result.signature 
            : String(result);
        } else if (typeof wallet.sendTransaction === 'function') {
          console.log('Using wallet.sendTransaction method');
          const result = await wallet.sendTransaction(transaction, {
            skipPreflight: false,
            preflightCommitment: 'confirmed',
            maxRetries: 3
          });
          signature = String(result);
        } else if (typeof wallet.signTransaction === 'function') {
          console.log('Using wallet.signTransaction method with connection');
          const signedTransaction = await wallet.signTransaction(transaction);
          
          // Get connection and send the signed transaction
          const { getConnection } = await import('@/lib/solana');
          const connection = await getConnection();
          signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
            skipPreflight: false,
            preflightCommitment: 'confirmed',
            maxRetries: 3
          });
        } else {
          console.error('No suitable transaction method found on wallet');
          throw new Error('Wallet does not support transaction sending');
        }

        console.log('Swap transaction sent:', signature);
        return signature;
      } catch (bufferError) {
        console.error('Transaction processing error:', bufferError);
        throw new Error('Failed to process transaction. Please try again.');
      }
    } catch (err) {
      console.error('Error executing swap:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute swap';
      setError(errorMessage);
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