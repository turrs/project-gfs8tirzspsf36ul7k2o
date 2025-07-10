import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Token, COMMON_TOKENS } from '@/lib/tokens';
import { useWallet } from '@/hooks/useWallet';
import { getTokenBalance, formatSolAmount } from '@/lib/solana';
import { searchToken } from '@/hooks/useJupiter';

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
  const { walletAddress, connected } = useWallet();
  const [balances, setBalances] = useState<{ [mint: string]: string }>({});
  const [loadingBalances, setLoadingBalances] = useState(false);
  const [searchResults, setSearchResults] = useState<Token[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Fetch token balances (unchanged)
  useEffect(() => {
    const fetchBalances = async () => {
      if (!walletAddress || !connected) {
        setBalances({});
        return;
      }
      setLoadingBalances(true);
      const newBalances: { [mint: string]: string } = {};
      await Promise.all(
        tokenList.map(async (token) => {
          try {
            const rawBalance = await getTokenBalance(walletAddress, token.address);
            newBalances[token.address] = token.symbol === 'SOL'
              ? formatSolAmount(rawBalance)
              : (rawBalance / Math.pow(10, token.decimals)).toFixed(4);
          } catch {
            newBalances[token.address] = '0.00';
          }
        })
      );
      setBalances(newBalances);
      setLoadingBalances(false);
    };
    if (isOpen) {
      fetchBalances();
    }
  }, [walletAddress, connected, isOpen]);

  // Search tokens using Jupiter Ultra API
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    const timeout = setTimeout(async () => {
      try {
        const results = await searchToken(searchQuery);
        // Map API results to Token type (id, symbol, name, icon, decimals)
        setSearchResults(
          results
            .filter(token => !selectedToken || token.id !== selectedToken.address)
            .map(token => ({
              symbol: token.symbol,
              name: token.name,
              address: token.id,
              decimals: token.decimals,
              logoURI: token.icon,
            }))
        );
      } catch (err) {
        setSearchError('Token search failed');
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400); // debounce
    return () => clearTimeout(timeout);
  }, [searchQuery, selectedToken]);

  // Use search results if searching, otherwise default token list
  const filteredTokens = searchQuery
    ? searchResults
    : tokenList.filter(token =>
        (token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!selectedToken || token.address !== selectedToken.address)
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
              placeholder="Search by token name, symbol, or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#2A2A3A] border-[#3A3A4A] text-white placeholder:text-gray-500 rounded-xl"
            />
          </div>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {searchLoading ? (
            <div className="text-center text-gray-400 py-8">Searching...</div>
          ) : searchError ? (
            <div className="text-center text-red-400 py-8">{searchError}</div>
          ) : filteredTokens.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No tokens found.</div>
          ) : (
            filteredTokens.map((token) => (
              <div
                key={token.address}
                onClick={() => handleSelectToken(token)}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-[#2A2A3A] ${
                  selectedToken && selectedToken.address === token.address ? 'bg-[#2A2A3A]' : ''
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
                    {loadingBalances
                      ? '...'
                      : balances[token.address] ?? '0.00'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};