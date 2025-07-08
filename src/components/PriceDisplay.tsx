import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight, Info, Zap, Clock } from 'lucide-react';
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
      <Card className="dex-card p-4">
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-dex-primary border-t-transparent rounded-full loading-spinner" />
            <span className="text-gray-400">Getting best price...</span>
          </div>
        </div>
      </Card>
    );
  }

  if (!quote) {
    return (
      <Card className="dex-card p-4">
        <div className="text-center py-8">
          <Zap className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Enter an amount to see price quote</p>
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
    <Card className="dex-card p-4 space-y-4">
      {/* Main Price Display */}
      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{parseFloat(inputAmount).toFixed(4)}</p>
          <p className="text-sm text-gray-400">{fromToken.symbol}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <ArrowRight className="w-6 h-6 text-dex-primary" />
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold text-dex-secondary">{parseFloat(outputAmount).toFixed(4)}</p>
          <p className="text-sm text-gray-400">{toToken.symbol}</p>
        </div>
      </div>

      {/* Exchange Rate */}
      <div className="bg-dex-gray/30 rounded-xl p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Rate</span>
          <span className="text-white font-medium">
            1 {fromToken.symbol} = {rate.toFixed(6)} {toToken.symbol}
          </span>
        </div>
      </div>

      {/* Price Details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Price Impact</span>
          </div>
          <span className={`font-medium ${getPriceImpactColorClass(priceImpact)}`}>
            {priceImpact < 0.01 ? '< 0.01%' : `${priceImpact.toFixed(2)}%`}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Max Slippage</span>
          <span className="text-white">{slippage}%</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Minimum Received</span>
          <span className="text-white">
            {formatTokenAmount(parseInt(quote.otherAmountThreshold), toToken)} {toToken.symbol}
          </span>
        </div>
      </div>

      {/* Route Information */}
      {quote.routePlan && quote.routePlan.length > 0 && (
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center space-x-2 mb-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Route via {quote.routePlan.length} step(s)</span>
          </div>
          
          <div className="space-y-2">
            {quote.routePlan.map((route, index) => (
              <div key={index} className="flex items-center justify-between text-xs bg-dex-gray/20 rounded-lg p-2">
                <span className="text-gray-400">{route.swapInfo.label}</span>
                <span className="text-dex-secondary">{route.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning for high price impact */}
      {priceImpact > 5 && (
        <div className="bg-dex-error/10 border border-dex-error/20 rounded-xl p-3">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-dex-error" />
            <span className="text-sm text-dex-error font-medium">High Price Impact Warning</span>
          </div>
          <p className="text-xs text-dex-error/80 mt-1">
            This trade has a high price impact. You may receive significantly less tokens than expected.
          </p>
        </div>
      )}
    </Card>
  );
};