import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Token, COMMON_TOKENS } from '@/lib/tokens';

interface TokenSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (token: Token) => void;
  selectedToken: Token;
  title: string;
}

// Sample token list - in a real app, you'd fetch this from an API
const tokenList: Token[] = [
  {
    symbol: 'SOL',
    name: 'Solana',
    address: COMMON_TOKENS.SOL,
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: COMMON_TOKENS.USDC,
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: COMMON_TOKENS.USDT,
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png'
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin (Sollet)',
    address: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E/logo.png'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum (Sollet)',
    address: '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk/logo.png'
  },
  {
    symbol: 'SRM',
    name: 'Serum',
    address: 'SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt/logo.png'
  },
  {
    symbol: 'RAY',
    name: 'Raydium',
    address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png'
  }
];

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  isOpen,
  onClose,
  onSelectToken,
  selectedToken,
  title
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = tokenList.filter(token => 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectToken = (token: Token) => {
    onSelectToken(token);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C1C28] border-[#2A2A3A] text-white max-w-md w-full p-0 rounded-2xl">
        <DialogHeader className="p-4 border-b border-[#2A2A3A]">
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="p-4 border-b border-[#2A2A3A]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by token name or symbol"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#2A2A3A] border-[#3A3A4A] text-white placeholder:text-gray-500 rounded-xl"
            />
          </div>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredTokens.map((token) => (
            <div
              key={token.address}
              onClick={() => handleSelectToken(token)}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-[#2A2A3A] ${
                selectedToken.address === token.address ? 'bg-[#2A2A3A]' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {token.logoURI && (
                  <img
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <p className="font-medium text-white">{token.symbol}</p>
                  <p className="text-sm text-gray-400">{token.name}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-400">Balance</p>
                <p className="font-medium text-white">
                  {token.symbol === 'SOL' ? '0.0000' : '0.00'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};