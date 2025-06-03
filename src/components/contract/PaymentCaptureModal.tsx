
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Lock, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { PaymentTranche } from '@/types/contract';
import { cn } from '@/lib/utils';

interface PaymentCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  tranche: PaymentTranche | null;
  trancheIndex: number;
}

const PaymentCaptureModal: React.FC<PaymentCaptureModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  tranche,
  trancheIndex
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentComplete(true);
      
      // After showing success, close and trigger the approval
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
        setPaymentComplete(false);
      }, 2000);
    }, 2000);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Don't render anything if tranche is null
  if (!tranche) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Capture Payment
          </DialogTitle>
          <DialogDescription>
            Complete your payment to approve this payment request.
          </DialogDescription>
        </DialogHeader>

        {paymentComplete ? (
          <div className="flex flex-col items-center py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">Payment Successful!</h3>
              <p className="text-sm text-green-600">
                Your payment has been processed and the request has been approved.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Payment Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payment #{trancheIndex + 1}</span>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Due {formatDate(tranche.DueDate)}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Amount to Pay:</span>
                <span className="text-xl font-bold text-blue-600">
                  {tranche.Amount.CurrencyCode} {tranche.Amount.Value.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">Secure Payment</p>
                <p className="text-xs text-blue-600">
                  Your payment information is encrypted and processed securely through Stripe.
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Payment Method</h4>
              <div className="border border-gray-200 rounded-lg p-3 flex items-center gap-3">
                <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">••••</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                  <p className="text-xs text-gray-500">Expires 12/28</p>
                </div>
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Pay Now
                  </div>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentCaptureModal;
