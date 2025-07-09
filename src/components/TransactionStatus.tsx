import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react';

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
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Loader2 className="w-12 h-12 text-[#9AE462] animate-spin" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'pending':
        return 'Transaction Pending';
      case 'success':
        return 'Transaction Successful';
      case 'error':
        return 'Transaction Failed';
      default:
        return '';
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'pending':
        return 'Your transaction is being processed...';
      case 'success':
        return 'Your swap has been completed successfully!';
      case 'error':
        return error || 'Something went wrong with your transaction.';
      default:
        return '';
    }
  };

  const handleViewTransaction = () => {
    if (signature) {
      window.open(`https://solscan.io/tx/${signature}`, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1C1C28] border-[#2A2A3A] text-white max-w-md w-full rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-white">
            {getStatusTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 p-6">
          {getStatusIcon()}
          
          <div className="text-center space-y-2">
            <p className="text-gray-300">{getStatusMessage()}</p>
            
            {signature && status === 'success' && (
              <div className="space-y-3 mt-4">
                <Button
                  onClick={handleViewTransaction}
                  variant="outline"
                  className="bg-[#2A2A3A] border-[#3A3A4A] text-white hover:bg-[#3A3A4A] rounded-xl"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on Solscan
                </Button>
                
                <div className="text-xs text-gray-500 break-all">
                  Transaction: {signature}
                </div>
              </div>
            )}
          </div>
          
          <Button
            onClick={onClose}
            className="bg-[#9AE462] hover:bg-[#8AD452] text-[#1A1A25] font-bold rounded-xl px-8"
          >
            {status === 'pending' ? 'Close' : 'Done'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};