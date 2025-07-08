import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ExternalLink, Clock } from 'lucide-react';

interface TransactionStatusProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'pending' | 'success' | 'error' | null;
  signature?: string;
  error?: string;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  isOpen,
  onClose,
  status,
  signature,
  error
}) => {
  const openInExplorer = () => {
    if (signature) {
      window.open(`https://explorer.solana.com/tx/${signature}?cluster=devnet`, '_blank');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="w-16 h-16 text-dex-warning animate-pulse" />;
      case 'success':
        return <CheckCircle className="w-16 h-16 text-dex-success" />;
      case 'error':
        return <XCircle className="w-16 h-16 text-dex-error" />;
      default:
        return null;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'pending':
        return 'Transaction Pending';
      case 'success':
        return 'Swap Successful!';
      case 'error':
        return 'Transaction Failed';
      default:
        return '';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'pending':
        return 'Your transaction is being processed on the Solana network. This may take a few moments.';
      case 'success':
        return 'Your swap has been completed successfully. The tokens should appear in your wallet shortly.';
      case 'error':
        return error || 'An error occurred while processing your transaction. Please try again.';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dex-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl text-center">
            {getStatusTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6 py-4">
          {/* Status Icon */}
          <div className="flex justify-center">
            {getStatusIcon()}
          </div>

          {/* Status Message */}
          <div className="space-y-2">
            <p className="text-gray-300 text-sm leading-relaxed">
              {getStatusMessage()}
            </p>
            
            {signature && (
              <div className="bg-dex-gray/30 rounded-xl p-3 mt-4">
                <p className="text-xs text-gray-400 mb-2">Transaction Signature:</p>
                <p className="text-xs font-mono text-white break-all">
                  {signature.slice(0, 20)}...{signature.slice(-20)}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            {signature && (
              <Button
                onClick={openInExplorer}
                variant="outline"
                className="w-full border-dex-primary text-dex-primary hover:bg-dex-primary hover:text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Solana Explorer
              </Button>
            )}
            
            <Button
              onClick={onClose}
              className="w-full dex-button"
            >
              {status === 'success' ? 'Continue Trading' : 'Close'}
            </Button>
          </div>

          {/* Additional Info for Pending */}
          {status === 'pending' && (
            <div className="bg-dex-warning/10 border border-dex-warning/20 rounded-xl p-3">
              <p className="text-xs text-dex-warning">
                <strong>Note:</strong> Do not close this window or refresh the page while the transaction is pending.
              </p>
            </div>
          )}

          {/* Additional Info for Error */}
          {status === 'error' && (
            <div className="bg-dex-error/10 border border-dex-error/20 rounded-xl p-3">
              <p className="text-xs text-dex-error">
                <strong>Common issues:</strong> Insufficient balance, high network congestion, or slippage tolerance too low.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};