import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Star, Verified } from 'lucide-react';
import { Token, POPULAR_TOKENS } from '@/lib/tokens';

interface TokenSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (token: Token) => void;
  selectedToken?: Token;
  title?: string;
}

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  isOpen,
  onClose,
  onSelectToken,
  selectedToken,
  title = 'Select Token'
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = POPULAR_TOKENS.filter(token =>
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectToken = (token: Token) => {
    onSelectToken(token);
    onClose();
    setSearchQuery('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dex-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, symbol, or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dex-input pl-10"
            />
          </div>

          {/* Popular Tokens */}
          {!searchQuery && (
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Popular Tokens
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {POPULAR_TOKENS.slice(0, 4).map((token) => (
                  <Button
                    key={token.address}
                    variant="ghost"
                    onClick={() => handleSelectToken(token)}
                    className="h-auto p-3 justify-start bg-dex-gray/30 hover:bg-dex-gray/50 border border-white/10"
                    disabled={selectedToken?.address === token.address}
                  >
                    <div className="flex items-center space-x-2">
                      {token.logoURI && (
                        <img
                          src={token.logoURI}
                          alt={token.symbol}
                          className="token-logo"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div className="text-left">
                        <div className="flex items-center space-x-1">
                          <span className="font-semibold text-white text-sm">{token.symbol}</span>
                          {token.verified && (
                            <Verified className="w-3 h-3 text-dex-secondary" />
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{token.name}</span>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Token List */}
          <div className="max-h-80 overflow-y-auto space-y-1">
            {filteredTokens.map((token) => (
              <Button
                key={token.address}
                variant="ghost"
                onClick={() => handleSelectToken(token)}
                className="w-full h-auto p-4 justify-start hover:bg-dex-gray/30 border border-transparent hover:border-white/10 rounded-xl"
                disabled={selectedToken?.address === token.address}
              >
                <div className="flex items-center space-x-3 w-full">
                  {token.logoURI && (
                    <img
                      src={token.logoURI}
                      alt={token.symbol}
                      className="token-logo"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{token.symbol}</span>
                        {token.verified && (
                          <Verified className="w-4 h-4 text-dex-secondary" />
                        )}
                      </div>
                      {token.tags && token.tags.length > 0 && (
                        <div className="flex space-x-1">
                          {token.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-dex-primary/20 text-dex-primary rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-400">{token.name}</span>
                      <span className="text-xs text-gray-500 font-mono">
                        {token.address.slice(0, 6)}...{token.address.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          {filteredTokens.length === 0 && searchQuery && (
            <div className="text-center py-8">
              <p className="text-gray-400">No tokens found matching "{searchQuery}"</p>
              <p className="text-sm text-gray-500 mt-2">
                Try searching by symbol, name, or contract address
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};