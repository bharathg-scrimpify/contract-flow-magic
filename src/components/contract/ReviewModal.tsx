
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, DollarSign, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import PaymentSchedule from './PaymentSchedule';
import { PaymentInterval } from '@/types/contract';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
  contractData: {
    fromName: string;
    toName: string;
    rate: string;
  };
}

// Mock payment plan data based on the provided JSON structure
const mockPaymentPlans = {
  NeedPayableAmount: {
    CurrencyCode: "USD",
    Value: 1000.00
  },
  OfferReceivableAmount: {
    CurrencyCode: "USD",
    Value: 950.00
  },
  PlatformFee: {
    FromNeed: {
      CurrencyCode: "USD",
      Value: 50.00
    },
    FromOffer: {
      CurrencyCode: "USD",
      Value: 25.00
    }
  },
  PaymentPlans: [
    {
      PaymentOption: "Full",
      PaymentIntervals: [
        {
          PaymentFrequency: "Monthly",
          Tranches: [
            {
              DueDate: "2025-04-01T00:00:00Z",
              Amount: {
                CurrencyCode: "USD",
                Value: 500.00
              }
            },
            {
              DueDate: "2025-05-01T00:00:00Z",
              Amount: {
                CurrencyCode: "USD",
                Value: 500.00
              }
            }
          ]
        },
        {
          PaymentFrequency: "Weekly",
          Tranches: [
            {
              DueDate: "2025-04-07T00:00:00Z",
              Amount: {
                CurrencyCode: "USD",
                Value: 250.00
              }
            },
            {
              DueDate: "2025-04-14T00:00:00Z",
              Amount: {
                CurrencyCode: "USD",
                Value: 250.00
              }
            },
            {
              DueDate: "2025-04-21T00:00:00Z",
              Amount: {
                CurrencyCode: "USD",
                Value: 250.00
              }
            },
            {
              DueDate: "2025-04-28T00:00:00Z",
              Amount: {
                CurrencyCode: "USD",
                Value: 250.00
              }
            }
          ]
        },
        {
          PaymentFrequency: "Daily",
          Tranches: [
            {
              DueDate: "2025-04-01T00:00:00Z",
              Amount: {
                CurrencyCode: "USD",
                Value: 50.00
              }
            },
            {
              DueDate: "2025-04-02T00:00:00Z",
              Amount: {
                CurrencyCode: "USD",
                Value: 50.00
              }
            },
            {
              DueDate: "2025-04-03T00:00:00Z",
              Amount: {
                CurrencyCode: "USD",
                Value: 50.00
              }
            }
          ]
        }
      ]
    }
  ]
};

const ReviewModal = ({ isOpen, onClose, onComplete, contractData }: ReviewModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [subscriptionActive, setSubscriptionActive] = useState(true);
  const [balanceStatus, setBalanceStatus] = useState<'sufficient' | 'insufficient'>('sufficient');
  const [paymentType, setPaymentType] = useState<'one-time' | 'partial'>('one-time');
  const [selectedInterval, setSelectedInterval] = useState<string>('');
  const [autoPayDate, setAutoPayDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Calculate fee breakdown
  const { NeedPayableAmount, OfferReceivableAmount, PlatformFee } = mockPaymentPlans;
  const totalAmount = NeedPayableAmount.Value;
  const platformFee = PlatformFee.FromNeed.Value;
  const receiverAmount = OfferReceivableAmount.Value;
  
  // Reset steps when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setShowSuccess(false);
      setPaymentType('one-time');
      setSelectedInterval('');
    }
  }, [isOpen]);

  // Total number of steps
  const totalSteps = 4;

  // Step titles
  const stepTitles = [
    "Subscription Status",
    "Account Balance",
    "Billing Summary",
    "Payment Method"
  ];

  // Handle step transitions
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      onClose();
    }
  };
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // After showing success message, complete the flow
      setTimeout(() => {
        onComplete({
          paymentType,
          selectedInterval: paymentType === 'partial' ? selectedInterval : null,
          totalAmount,
          platformFee,
          receiverAmount
        });
      }, 2000);
    }, 1500);
  };

  // Get the payment intervals from our mock data
  const paymentIntervals = mockPaymentPlans.PaymentPlans[0].PaymentIntervals;

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl">
            {showSuccess ? "Success!" : `Send Contract for Review - ${stepTitles[currentStep - 1]}`}
          </DialogTitle>
        </DialogHeader>

        {!showSuccess && (
          <div className="px-6 pb-2">
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Step {currentStep}</span>
              <span>of {totalSteps}</span>
            </div>
          </div>
        )}
        
        <div className="px-6 py-4 max-h-[65vh] overflow-y-auto">
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold">Contract Sent Successfully</h3>
              <p className="text-gray-600 max-w-sm">
                Your contract has been sent to {contractData.toName} for review. We'll notify you when they respond.
              </p>
              <Button onClick={onClose} className="mt-4">
                Close
              </Button>
            </div>
          ) : (
            <div className="animate-fade-in">
              {/* Step 1: Subscription Check */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  {subscriptionActive ? (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-800">Active Subscription</p>
                        <p className="text-sm text-green-700">
                          Your subscription is active. You can send this contract for review.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start">
                      <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-amber-800">Inactive Subscription</p>
                        <p className="text-sm text-amber-700 mb-2">
                          Your subscription is inactive. Please subscribe to send contracts for review.
                        </p>
                        <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                          Subscribe Now
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Step 2: Connect Balance Check */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  {balanceStatus === 'sufficient' ? (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-green-800">Sufficient Balance</p>
                        <p className="text-sm text-green-700">
                          You have sufficient balance in your account to process this contract.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start">
                      <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-red-800">Insufficient Balance</p>
                        <p className="text-sm text-red-700 mb-2">
                          Your account balance is insufficient. Please add funds to proceed.
                        </p>
                        <Button className="bg-red-500 hover:bg-red-600 text-white">
                          Add Funds
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Step 3: Billing Summary */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-5">
                    <h4 className="text-lg font-semibold text-blue-800 mb-4">Payment Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Total Amount</span>
                        <span className="font-semibold text-blue-900">${totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-700">Platform Fee</span>
                        <span className="font-medium text-blue-700">-${platformFee.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-blue-200 my-2 pt-2"></div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-blue-800">Amount to {contractData.toName}</span>
                        <span className="font-bold text-xl text-blue-800">${receiverAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-700">
                    <p>
                      The total amount of ${totalAmount.toFixed(2)} will be charged when you confirm sending this contract for review.
                    </p>
                  </div>
                </div>
              )}
              
              {/* Step 4: Payment Type */}
              {currentStep === 4 && (
                <div className="space-y-5">
                  <div className="grid gap-4">
                    <RadioGroup 
                      value={paymentType} 
                      onValueChange={(val) => {
                        setPaymentType(val as 'one-time' | 'partial');
                        if (val === 'one-time') {
                          setSelectedInterval('');
                        }
                      }}
                      className="space-y-3"
                    >
                      <div className={cn(
                        "flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-all duration-200",
                        paymentType === 'one-time' 
                          ? "border-blue-300 bg-blue-50 shadow-sm" 
                          : "border-gray-200 hover:border-blue-200"
                      )}>
                        <RadioGroupItem value="one-time" id="one-time" />
                        <Label htmlFor="one-time" className="flex items-center justify-between w-full cursor-pointer">
                          <div>
                            <div className="font-medium">One-time Payment</div>
                            <div className="text-sm text-gray-500">Pay the full amount now</div>
                          </div>
                          <DollarSign className={cn(
                            "h-5 w-5 transition-colors", 
                            paymentType === 'one-time' ? "text-blue-500" : "text-gray-400"
                          )} />
                        </Label>
                      </div>
                      
                      <div className={cn(
                        "flex items-center space-x-2 border rounded-lg p-4 cursor-pointer transition-all duration-200",
                        paymentType === 'partial' 
                          ? "border-blue-300 bg-blue-50 shadow-sm" 
                          : "border-gray-200 hover:border-blue-200"
                      )}>
                        <RadioGroupItem value="partial" id="partial" />
                        <Label htmlFor="partial" className="flex items-center justify-between w-full cursor-pointer">
                          <div>
                            <div className="font-medium">Partial Payment</div>
                            <div className="text-sm text-gray-500">Split your payments over time</div>
                          </div>
                          <Calendar className={cn(
                            "h-5 w-5 transition-colors", 
                            paymentType === 'partial' ? "text-blue-500" : "text-gray-400"
                          )} />
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {paymentType === 'partial' && (
                    <div className="pt-2 animate-fade-in space-y-4">
                      <h4 className="font-medium text-gray-700">Choose a payment schedule</h4>
                      
                      <div className="space-y-4 mt-2">
                        {paymentIntervals.map((interval: PaymentInterval, index: number) => (
                          <PaymentSchedule
                            key={index}
                            interval={interval}
                            selected={selectedInterval === interval.PaymentFrequency}
                            onSelect={() => setSelectedInterval(interval.PaymentFrequency)}
                          />
                        ))}
                      </div>
                      
                      {!selectedInterval && (
                        <div className="text-sm text-amber-600 mt-2">
                          Please select a payment schedule to continue
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        {!showSuccess && (
          <DialogFooter className="flex justify-between p-6 border-t bg-gray-50">
            <Button 
              variant="outline" 
              onClick={prevStep}
              className="border-gray-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>
            
            <Button 
              onClick={nextStep}
              disabled={
                isSubmitting || 
                (currentStep === 4 && paymentType === 'partial' && !selectedInterval)
              }
              className={`${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing
                </div>
              ) : (
                <>
                  {currentStep === totalSteps ? 'Complete' : 'Continue'} 
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
