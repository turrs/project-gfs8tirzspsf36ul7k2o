import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight, Info, Zap, Clock, TrendingUp } from 'lucide-react';
import { Token, formatTokenAmount } from '@/lib/tokens';
import { getPriceImpactColorClass } from '@/lib/tokens';

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

interface PriceDisplayProps {
  quote: QuoteResponse | null;
  fromToken: Token;
  toToken: Token;
  loading: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  quote,
  fromToken,
  toToken,
  loading
}) => {
  if (loading) {
    return (
      <Card className="raydium-card p-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full loading-spinner" />
            <span className="text-purple-300 text-lg font-medium">Getting best price...</span>
          </div>
        </div>
      </Card>
    );
  }

  if (!quote) {
    return (
      <Card className="raydium-card p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 neon-glow">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <p className="text-purple-300 text-lg font-medium">Enter an amount to see price quote</p>
          <p className="text-gray-400 text-sm mt-2">Get the best rates across all DEXs</p>
        </div>
      </Card>
    );
  }

  const inputAmount = formatTokenAmount(parseInt(quote.inAmount), fromToken);
  const outputAmount = formatTokenAmount(parseInt(quote.outAmount), toToken);
  const priceImpact = parseFloat(quote.priceImpactPct);
  const slippage = quote.slippageBps / 100;

  // Calculate exchange rate
  const rate = parseFloat(outputAmount) / parseFloat(inputAmount);

  return (
    <Card className="raydium-card p-6 space-y-6">
      {/* Main Price Display */}
      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-3xl font-bold text-white mb-2">{parseFloat(inputAmount).toFixed(4)}</p>
          <p className="text-purple-300 font-medium">{fromToken.symbol}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center neon-glow">
            <ArrowRight className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            {parseFloat(outputAmount).toFixed(4)}
          </p>
          <p className="text-purple-300 font-medium">{toToken.symbol}</p>
        </div>
      </div>

      {/* Exchange Rate */}
      <div className="bg-slate-800/60 rounded-2xl p-4 border border-purple-400/20">
        <div className="flex items-center justify-between text-sm">
          <span className="text-purple-300 font-medium">Exchange Rate</span>
          <span className="text-white font-bold">
            1 {fromToken.symbol} = {rate.toFixed(6)} {toToken.symbol}
          </span>
        </div>
      </div>

      {/* Price Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 font-medium">Price Impact</span>
          </div>
          <span className={`font-bold ${getPriceImpactColorClass(priceImpact)}`}>
            {priceImpact < 0.01 ? '< 0.01%' : `${priceImpact.toFixed(2)}%`}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-purple-300 font-medium">Max Slippage</span>
          <span className="text-white font-bold">{slippage}%</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-purple-300 font-medium">Minimum Received</span>
          <span className="text-white font-bold">
            {formatTokenAmount(parseInt(quote.otherAmountThreshold), toToken)} {toToken.symbol}
          </span>
        </div>
      </div>

      {/* Route Information */}
      {quote.routePlan && quote.routePlan.length > 0 && (
        <div className="border-t border-purple-400/20 pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-medium">
              Route via {quote.routePlan.length} step(s)
            </span>
          </div>
          
          <div className="space-y-2">
            {quote.routePlan.map((route, index) => (
              <div key={index} className="flex items-center justify-between text-sm bg-slate-800/40 rounded-xl p-3 border border-purple-400/10">
                <span className="text-purple-300 font-medium">{route.swapInfo.label}</span>
                <span className="text-pink-400 font-bold">{route.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning for high price impact */}
      {priceImpact > 5 && (
        <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-bold">High Price Impact Warning</span>
          </div>
          <p className="text-red-300 text-sm">
            This trade has a high price impact. You may receive significantly less tokens than expected.
          </p>
        </div>
      )}
    </Card>
  );
};