
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ContractStepper, { Step } from '@/components/contract/ContractStepper';
import ContractSummary from '@/components/contract/ContractSummary';
import ReviewPanel from '@/components/contract/ReviewPanel';
import PaymentPlanDisplay from '@/components/contract/PaymentPlanDisplay';
import PaymentSchedule from '@/components/contract/PaymentSchedule';
import EditContractModal from '@/components/contract/EditContractModal';
import SignatureTab from '@/components/contract/SignatureTab';
import HistoryTab from '@/components/contract/HistoryTab';
import { 
  Info, 
  Edit, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  Save, 
  X, 
  User, 
  MapPin, 
  Clock, 
  FileText, 
  Paperclip, 
  History,
  MessageSquare,
  Send,
  FileSignature,
  PlayCircle,
  CheckCheck,
  ThumbsUp,
  AlertCircle
} from 'lucide-react';
import { Contract, ContractHistoryItem, PaymentInterval, PaymentTranche } from '@/types/contract';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, addDays, addWeeks, addMonths } from 'date-fns';

const Index = () => {
  const { toast } = useToast();
  const [isReviewPanelOpen, setIsReviewPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFromUser, setIsFromUser] = useState(true);
  const [selectedPaymentType, setSelectedPaymentType] = useState<'one-time' | 'partial' | undefined>(undefined);
  const [selectedPaymentFrequency, setSelectedPaymentFrequency] = useState<'Monthly' | 'Weekly' | 'Daily' | undefined>(undefined);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [activePaymentIntervals, setActivePaymentIntervals] = useState<PaymentInterval[]>([]);
  
  const [editingSections, setEditingSections] = useState({
    from: false,
    to: false,
    place: false,
    time: false,
    rate: false,
    additionalDetails: false,
  });

  const [contractSteps, setContractSteps] = useState<Step[]>([
    { 
      id: 1, 
      name: 'Draft', 
      status: 'current' as const,
      description: 'Review contract details and sign',
      actionIcon: <div className="flex items-center text-xs text-blue-600"><FileSignature className="w-3 h-3 mr-1" /> Sign the contract</div>
    },
    { 
      id: 2, 
      name: 'Pending Review', 
      status: 'upcoming' as const,
      description: 'Waiting for other party to review'
    },
    { 
      id: 3, 
      name: 'Active', 
      status: 'upcoming' as const,
      description: 'Contract is active, ready to start'
    },
    { 
      id: 4, 
      name: 'In Progress', 
      status: 'upcoming' as const,
      description: 'Contract work in progress'
    },
    { 
      id: 5, 
      name: 'Pending Completion', 
      status: 'upcoming' as const,
      description: 'Waiting for completion approval'
    },
    { 
      id: 6, 
      name: 'Completed', 
      status: 'upcoming' as const,
      description: 'Contract successfully completed'
    },
  ]);
  
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
        PaymentOption: "Full" as const,
        PaymentIntervals: [
          {
            PaymentFrequency: "Monthly" as const,
            Tranches: [
              {
                DueDate: "2025-04-01T00:00:00Z",
                Amount: {
                  CurrencyCode: "USD",
                  Value: 500.00
                },
                Status: "not_paid" as const
              },
              {
                DueDate: "2025-05-01T00:00:00Z",
                Amount: {
                  CurrencyCode: "USD",
                  Value: 500.00
                },
                Status: "not_paid" as const
              }
            ]
          },
          {
            PaymentFrequency: "Weekly" as const,
            Tranches: [
              {
                DueDate: "2025-04-07T00:00:00Z",
                Amount: {
                  CurrencyCode: "USD",
                  Value: 250.00
                },
                Status: "not_paid" as const
              },
              {
                DueDate: "2025-04-14T00:00:00Z",
                Amount: {
                  CurrencyCode: "USD",
                  Value: 250.00
                },
                Status: "not_paid" as const
              },
              {
                DueDate: "2025-04-21T00:00:00Z",
                Amount: {
                  CurrencyCode: "USD",
                  Value: 250.00
                },
                Status: "not_paid" as const
              },
              {
                DueDate: "2025-04-28T00:00:00Z",
                Amount: {
                  CurrencyCode: "USD",
                  Value: 250.00
                },
                Status: "not_paid" as const
              }
            ]
          },
          {
            PaymentFrequency: "Daily" as const,
            Tranches: [
              {
                DueDate: "2025-04-01T00:00:00Z",
                Amount: {
                  CurrencyCode: "USD",
                  Value: 50.00
                },
                Status: "not_paid" as const
              },
              {
                DueDate: "2025-04-02T00:00:00Z",
                Amount: {
                  CurrencyCode: "USD",
                  Value: 50.00
                },
                Status: "not_paid" as const
              },
              {
                DueDate: "2025-04-03T00:00:00Z",
                Amount: {
                  CurrencyCode: "USD",
                  Value: 50.00
                },
                Status: "not_paid" as const
              }
            ]
          }
        ]
      }
    ]
  };

  const [contract, setContract] = useState<Contract>({
    id: 'c-12345',
    subject: 'Contract Template',
    type: 'Basic',
    facilitatedBy: 'Eveniopro',
    status: 'draft',
    progress: 25,
    from: {
      name: 'Sai Teja Kotagiri',
      email: 'samjose@gmail.com',
    },
    to: {
      name: 'Mittu HIC',
      email: 'mittuhic@example.com',
    },
    details: {
      placeOfService: 'Building number 220Hyderabad Telangana 50007',
      startDate: 'Mar 18 2025, 1:58 PM',
      endDate: 'Mar 25 2025, 1:58 PM',
      rate: 'USD 22/hour',
      mealsIncluded: true,
    },
    payment: {
      ...mockPaymentPlans,
      selectedPaymentType: undefined,
      selectedPaymentFrequency: undefined
    },
    history: [],
    createdAt: '2023-09-10T10:00:00Z',
    updatedAt: '2023-09-10T10:00:00Z',
  });

  const [formState, setFormState] = useState({
    from: { ...contract.from },
    to: { ...contract.to },
    details: { ...contract.details },
  });

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    section: {
      type: 'from' | 'to' | 'place' | 'duration' | 'rate';
      title: string;
      data: any;
    };
  }>({
    isOpen: false,
    section: {
      type: 'from',
      title: '',
      data: null
    }
  });

  // Generate payment schedules based on contract details
  const generatePaymentSchedules = () => {
    const { details } = contract;
    let startDate: Date;
    let endDate: Date;
    
    try {
      startDate = new Date(details.startDate);
      endDate = new Date(details.endDate);
    } catch (e) {
      // If the date format is not standard, try to parse it manually
      const startParts = details.startDate.split(',')[0].split(' ');
      const endParts = details.endDate.split(',')[0].split(' ');
      
      const monthMap: {[key: string]: number} = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      
      startDate = new Date(
        parseInt(startParts[2]), // year
        monthMap[startParts[0]], // month
        parseInt(startParts[1])  // day
      );
      
      endDate = new Date(
        parseInt(endParts[2]), // year
        monthMap[endParts[0]], // month
        parseInt(endParts[1])  // day
      );
    }
    
    // For one-time payment
    const oneTimePayment: PaymentInterval = {
      PaymentFrequency: 'Monthly',
      Tranches: [
        {
          DueDate: endDate.toISOString(),
          Amount: {
            CurrencyCode: "USD",
            Value: 1000.00
          },
          Status: "not_paid"
        }
      ]
    };
    
    // For monthly payments
    const monthlyPayments: PaymentInterval = {
      PaymentFrequency: 'Monthly',
      Tranches: []
    };
    
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      monthlyPayments.Tranches.push({
        DueDate: currentDate.toISOString(),
        Amount: {
          CurrencyCode: "USD",
          Value: 500.00
        },
        Status: "not_paid"
      });
      currentDate = addMonths(currentDate, 1);
    }
    
    // For weekly payments
    const weeklyPayments: PaymentInterval = {
      PaymentFrequency: 'Weekly',
      Tranches: []
    };
    
    currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      weeklyPayments.Tranches.push({
        DueDate: currentDate.toISOString(),
        Amount: {
          CurrencyCode: "USD",
          Value: 250.00
        },
        Status: "not_paid"
      });
      currentDate = addWeeks(currentDate, 1);
    }
    
    // For daily payments
    const dailyPayments: PaymentInterval = {
      PaymentFrequency: 'Daily',
      Tranches: []
    };
    
    currentDate = new Date(startDate);
    let dailyAmount = 1000 / (Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    while (currentDate <= endDate) {
      dailyPayments.Tranches.push({
        DueDate: currentDate.toISOString(),
        Amount: {
          CurrencyCode: "USD",
          Value: parseFloat(dailyAmount.toFixed(2))
        },
        Status: "not_paid"
      });
      currentDate = addDays(currentDate, 1);
    }
    
    // Ensure the total amount is the same for all payment types
    const adjustPaymentAmounts = (interval: PaymentInterval, totalAmount: number) => {
      const count = interval.Tranches.length;
      const baseAmount = parseFloat((totalAmount / count).toFixed(2));
      let remaining = totalAmount;
      
      for (let i = 0; i < count; i++) {
        if (i === count - 1) {
          // Last payment - assign the remaining amount to avoid floating point issues
          interval.Tranches[i].Amount.Value = parseFloat(remaining.toFixed(2));
        } else {
          interval.Tranches[i].Amount.Value = baseAmount;
          remaining -= baseAmount;
        }
      }
      
      return interval;
    };
    
    const totalAmount = 1000;
    
    return [
      oneTimePayment,
      adjustPaymentAmounts(monthlyPayments, totalAmount),
      adjustPaymentAmounts(weeklyPayments, totalAmount),
      adjustPaymentAmounts(dailyPayments, totalAmount)
    ];
  };

  // Initialize payment intervals
  useEffect(() => {
    const intervals = generatePaymentSchedules();
    setActivePaymentIntervals(intervals);
  }, [contract.details]);

  const handleEdit = (type: 'from' | 'to' | 'place' | 'duration' | 'rate', title: string, data: any) => {
    setEditModal({
      isOpen: true,
      section: {
        type,
        title,
        data
      }
    });
  };

  const handleSaveEdit = (data: any) => {
    switch (editModal.section.type) {
      case 'from':
        setContract(prev => ({ ...prev, from: data }));
        break;
      case 'to':
        setContract(prev => ({ ...prev, to: data }));
        break;
      case 'place':
        setContract(prev => ({ ...prev, details: { ...prev.details, placeOfService: data.placeOfService } }));
        break;
      case 'duration':
        setContract(prev => ({ ...prev, details: { ...prev.details, startDate: data.startDate, endDate: data.endDate } }));
        break;
      case 'rate':
        setContract(prev => ({ ...prev, details: { ...prev.details, rate: data.rate } }));
        break;
    }

    const historyItem: ContractHistoryItem = {
      id: `history-${Date.now()}`,
      date: new Date().toISOString(),
      action: `Edited ${editModal.section.title}`,
      user: isFromUser ? contract.from.name : contract.to.name,
    };
    
    setContract(prev => ({
      ...prev,
      history: [...(prev.history || []), historyItem]
    }));

    toast({
      title: "Changes Saved",
      description: `${editModal.section.title} has been updated.`,
    });
  };

  const handleSign = (signature: string) => {
    setContract(prev => ({
      ...prev,
      [isFromUser ? 'from' : 'to']: {
        ...prev[isFromUser ? 'from' : 'to'],
        signature
      }
    }));
    
    const historyItem: ContractHistoryItem = {
      id: `history-${Date.now()}`,
      date: new Date().toISOString(),
      action: 'Contract Signed',
      user: isFromUser ? contract.from.name : contract.to.name,
      notes: `Signed by ${isFromUser ? 'From' : 'To'} party`
    };
    
    setContract(prev => ({
      ...prev,
      history: [...(prev.history || []), historyItem]
    }));

    if (!isFromUser && contract.status === 'pending_review') {
      setContract(prev => ({
        ...prev,
        status: 'active',
        progress: 60
      }));
    }

    toast({
      title: "Contract Signed",
      description: "Your signature has been added to the contract.",
    });
    
    updateStepperStatus();
  };

  const handleSendForReview = () => {
    if (isFromUser && !contract.from.signature) {
      toast({
        title: "Signature Required",
        description: "Please sign the contract before sending for review.",
        variant: "destructive"
      });
      setActiveTab('signature');
      return;
    }
    
    if (!contract.payment?.selectedPaymentType) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method before sending for review.",
        variant: "destructive"
      });
      setActiveTab('payments');
      return;
    }

    const updatedPayment = { ...contract.payment! };
    
    setContract({
      ...contract,
      status: 'pending_review',
      progress: 40,
      payment: updatedPayment
    });
    
    const historyItem: ContractHistoryItem = {
      id: `history-${Date.now()}`,
      date: new Date().toISOString(),
      action: 'Contract Sent for Review',
      user: contract.from.name,
    };
    
    setContract(prev => ({
      ...prev,
      history: [...(prev.history || []), historyItem]
    }));
    
    toast({
      title: "Contract Sent for Review",
      description: `Your contract has been sent to ${contract.to.name} for review.`,
    });
    
    updateStepperStatus();
  };

  const handleStartContract = () => {
    if (contract.status !== 'active') {
      return;
    }
    
    setContract(prev => ({
      ...prev,
      status: 'in_progress',
      progress: 75
    }));
    
    const historyItem: ContractHistoryItem = {
      id: `history-${Date.now()}`,
      date: new Date().toISOString(),
      action: 'Contract Started',
      user: isFromUser ? contract.from.name : contract.to.name,
    };
    
    setContract(prev => ({
      ...prev,
      history: [...(prev.history || []), historyItem]
    }));
    
    toast({
      title: "Contract Started",
      description: "The contract has been marked as In Progress.",
    });
    
    updateStepperStatus();
  };

  const handleCompleteContract = () => {
    if (isFromUser) {
      // From user can mark it as completed only when it's in pending_completion
      if (contract.status !== 'pending_completion') {
        toast({
          title: "Action Not Allowed",
          description: "You can only complete the contract when it's in pending completion state.",
          variant: "destructive"
        });
        return;
      }
      
      // Check if all payments are made
      const selectedInterval = getPaymentIntervalDetails(contract.payment?.selectedPaymentFrequency);
      if (selectedInterval) {
        const unpaidTranches = selectedInterval.Tranches.filter(t => t.Status !== 'paid');
        if (unpaidTranches.length > 0) {
          toast({
            title: "Payments Required",
            description: "All payments must be completed before finalizing the contract.",
            variant: "destructive"
          });
          setActiveTab('payments');
          return;
        }
      }
      
      setIsFeedbackModalOpen(true);
    } else {
      // To user initiates completion request
      if (contract.status !== 'in_progress') {
        toast({
          title: "Action Not Allowed",
          description: "You can only request completion when the contract is in progress.",
          variant: "destructive"
        });
        return;
      }
      
      setIsFeedbackModalOpen(true);
    }
  };

  const handleSubmitFeedback = () => {
    setContract(prev => ({
      ...prev,
      [isFromUser ? 'from' : 'to']: {
        ...prev[isFromUser ? 'from' : 'to'],
        feedback: {
          rating: feedbackRating,
          comment: feedbackComment
        }
      }
    }));
    
    const historyItem: ContractHistoryItem = {
      id: `history-${Date.now()}`,
      date: new Date().toISOString(),
      action: isFromUser ? 'Contract Completed' : 'Contract Completion Requested',
      user: isFromUser ? contract.from.name : contract.to.name,
      notes: `Feedback: ${feedbackRating}/5. ${feedbackComment}`
    };
    
    let newStatus = isFromUser ? 'completed' : 'pending_completion';
    let newProgress = isFromUser ? 100 : 90;
    
    setContract(prev => ({
      ...prev,
      status: newStatus,
      progress: newProgress,
      history: [...(prev.history || []), historyItem]
    }));
    
    setIsFeedbackModalOpen(false);
    setFeedbackRating(5);
    setFeedbackComment('');
    
    toast({
      title: isFromUser ? "Contract Completed" : "Completion Requested",
      description: isFromUser 
        ? "The contract has been marked as completed. Thank you for your feedback!" 
        : "Your completion request has been sent for approval.",
    });
    
    updateStepperStatus();
  };

  const handleSavePaymentMethod = () => {
    if (!selectedPaymentType) {
      toast({
        title: "Selection Required",
        description: "Please select a payment type.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedPaymentType === 'partial' && !selectedPaymentFrequency) {
      toast({
        title: "Selection Required",
        description: "Please select a payment frequency.",
        variant: "destructive"
      });
      return;
    }
    
    // Find the selected payment interval
    let selectedInterval: PaymentInterval | undefined;
    
    if (selectedPaymentType === 'one-time') {
      selectedInterval = activePaymentIntervals[0]; // One-time payment
    } else if (selectedPaymentFrequency) {
      selectedInterval = activePaymentIntervals.find(
        interval => interval.PaymentFrequency === selectedPaymentFrequency
      );
    }
    
    if (!selectedInterval) {
      toast({
        title: "Error",
        description: "Could not find the selected payment schedule.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedPayment = { ...contract.payment! };
    updatedPayment.selectedPaymentType = selectedPaymentType;
    updatedPayment.selectedPaymentFrequency = selectedPaymentType === 'partial' ? selectedPaymentFrequency : 'Monthly';
    
    // Replace the payment intervals with our generated ones
    updatedPayment.PaymentPlans[0].PaymentIntervals = activePaymentIntervals;
    
    setContract(prev => ({
      ...prev,
      payment: updatedPayment
    }));
    
    toast({
      title: "Payment Method Saved",
      description: "Your payment method has been saved successfully.",
    });
  };

  const handleDeleteContract = () => {
    toast({
      title: "Contract Deleted",
      description: "The contract has been deleted successfully.",
      variant: "destructive",
    });
  };

  const handleDownloadPdf = () => {
    toast({
      title: "Downloading PDF",
      description: "Your contract PDF is being downloaded.",
    });
  };

  const getPaymentIntervalDetails = (frequency?: string) => {
    if (!frequency || !contract.payment) return null;
    
    let interval: PaymentInterval | undefined;
    
    if (contract.payment.selectedPaymentType === 'one-time') {
      interval = activePaymentIntervals[0];
    } else {
      interval = activePaymentIntervals.find(
        interval => interval.PaymentFrequency === frequency
      );
    }
    
    return interval;
  };

  const selectedPaymentInterval = getPaymentIntervalDetails(
    contract.payment?.selectedPaymentType === 'one-time' 
      ? 'Monthly' 
      : contract.payment?.selectedPaymentFrequency
  );

  const handleRequestPayment = (trancheIndex: number) => {
    if (!selectedPaymentInterval) return;
    
    const updatedContract = { ...contract };
    if (!updatedContract.payment) return;
    
    const intervalIndex = updatedContract.payment.PaymentPlans[0].PaymentIntervals.findIndex(
      interval => interval.PaymentFrequency === updatedContract.payment?.selectedPaymentFrequency
    );
    
    if (intervalIndex === -1) return;
    
    updatedContract.payment.PaymentPlans[0].PaymentIntervals[intervalIndex].Tranches[trancheIndex].Status = 'requested';
    updatedContract.payment.PaymentPlans[0].PaymentIntervals[intervalIndex].Tranches[trancheIndex].RequestDate = new Date().toISOString();
    
    setContract(updatedContract);
    
    const historyItem: ContractHistoryItem = {
      id: `history-${Date.now()}`,
      date: new Date().toISOString(),
      action: 'Payment Requested',
      user: contract.to.name,
      notes: `Payment of ${updatedContract.payment.PaymentPlans[0].PaymentIntervals[intervalIndex].Tranches[trancheIndex].Amount.CurrencyCode} ${updatedContract.payment.PaymentPlans[0].PaymentIntervals[intervalIndex].Tranches[trancheIndex].Amount.Value.toFixed(2)} requested.`
    };
    
    setContract(prev => ({
      ...prev,
      history: [...(prev.history || []), historyItem]
    }));
    
    toast({
      title: "Payment Requested",
      description: `Payment request has been sent to ${contract.from.name}.`,
    });
  };

  const handleApprovePayment = (trancheIndex: number) => {
    if (!selectedPaymentInterval) return;
    
    const updatedContract = { ...contract };
    if (!updatedContract.payment) return;
    
    const intervalIndex = updatedContract.payment.PaymentPlans[0].PaymentIntervals.findIndex(
      interval => interval.PaymentFrequency === updatedContract.payment?.selectedPaymentFrequency
    );
    
    if (intervalIndex === -1) return;
    
    updatedContract.payment.PaymentPlans[0].PaymentIntervals[intervalIndex].Tranches[trancheIndex].Status = 'paid';
    updatedContract.payment.PaymentPlans[0].PaymentIntervals[intervalIndex].Tranches[trancheIndex].PaymentDate = new Date().toISOString();
    
    setContract(updatedContract);
    
    const historyItem: ContractHistoryItem = {
      id: `history-${Date.now()}`,
      date: new Date().toISOString(),
      action: 'Payment Completed',
      user: contract.from.name,
      notes: `Payment of ${updatedContract.payment.PaymentPlans[0].PaymentIntervals[intervalIndex].Tranches[trancheIndex].Amount.CurrencyCode} ${updatedContract.payment.PaymentPlans[0].PaymentIntervals[intervalIndex].Tranches[trancheIndex].Amount.Value.toFixed(2)} completed.`
    };
    
    setContract(prev => ({
      ...prev,
      history: [...(prev.history || []), historyItem]
    }));
    
    toast({
      title: "Payment Successful",
      description: `Your payment has been processed successfully.`,
    });
  };

  const handleCancelPayment = (trancheIndex: number) => {
    if (!selectedPaymentInterval) return;
    
    const updatedContract = { ...contract };
    if (!updatedContract.payment) return;
    
    const intervalIndex = updatedContract.payment.PaymentPlans[0].PaymentIntervals.findIndex(
      interval => interval.PaymentFrequency === updatedContract.payment?.selectedPaymentFrequency
    );
    
    if (intervalIndex === -1) return;
    
    updatedContract.payment.PaymentPlans[0].PaymentIntervals[intervalIndex].Tranches[trancheIndex].Status = 'cancelled';
    
    setContract(updatedContract);
    
    const historyItem: ContractHistoryItem = {
      id: `history-${Date.now()}`,
      date: new Date().toISOString(),
      action: 'Payment Cancelled',
      user: contract.from.name,
      notes: `Payment of ${updatedContract.payment.PaymentPlans[0].PaymentIntervals[intervalIndex].Tranches[trancheIndex].Amount.CurrencyCode} ${updatedContract.payment.PaymentPlans[0].PaymentIntervals[intervalIndex].Tranches[trancheIndex].Amount.Value.toFixed(2)} cancelled.`
    };
    
    setContract(prev => ({
      ...prev,
      history: [...(prev.history || []), historyItem]
    }));
    
    toast({
      title: "Payment Cancelled",
      description: `You have cancelled the payment request.`,
      variant: "destructive",
    });
  };

  const toggleEditSection = (section: keyof typeof editingSections) => {
    if (editingSections[section]) {
      setContract(prev => ({
        ...prev,
        from: section === 'from' ? formState.from : prev.from,
        to: section === 'to' ? formState.to : prev.to,
        details: {
          ...prev.details,
          placeOfService: section === 'place' ? formState.details.placeOfService : prev.details.placeOfService,
          startDate: section === 'time' ? formState.details.startDate : prev.details.startDate,
          endDate: section === 'time' ? formState.details.endDate : prev.details.endDate,
          rate: section === 'rate' ? formState.details.rate : prev.details.rate,
          mealsIncluded: section === 'additionalDetails' ? formState.details.mealsIncluded : prev.details.mealsIncluded,
        }
      }));
      
      toast({
        title: "Changes Saved",
        description: `${section.charAt(0).toUpperCase() + section.slice(1)} section has been updated.`,
      });
    } else {
      setFormState({
        from: { ...contract.from },
        to: { ...contract.to },
        details: { ...contract.details },
      });
    }
    
    setEditingSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFormChange = (
    section: 'from' | 'to' | 'details',
    field: string,
    value: string | boolean
  ) => {
    setFormState(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const updateStepperStatus = () => {
    const newSteps = [...contractSteps];
    
    newSteps.forEach(step => {
      step.status = 'upcoming';
    });
    
    switch(contract.status) {
      case 'draft':
        newSteps[0].status = 'current';
        newSteps[0].description = 'Review contract details and sign';
        newSteps[0].actionIcon = contract.from.signature ? 
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            <CheckCheck className="w-3 h-3 mr-1" /> Signed
          </Badge> :
          <div className="flex items-center text-xs text-blue-600">
            <FileSignature className="w-3 h-3 mr-1" /> Sign the contract
          </div>;
        break;
      case 'pending_review':
        newSteps[0].status = 'completed';
        newSteps[1].status = 'current';
        newSteps[1].description = isFromUser ? 
          'Waiting for other party to review' : 
          'Review contract details and sign';
        newSteps[1].actionIcon = !isFromUser ? 
          <div className="flex items-center text-xs text-blue-600">
            <FileSignature className="w-3 h-3 mr-1" /> Sign the contract
          </div> : undefined;
        break;
      case 'active':
        newSteps[0].status = 'completed';
        newSteps[1].status = 'completed';
        newSteps[2].status = 'current';
        newSteps[2].description = 'Contract is signed by both parties';
        newSteps[2].actionIcon = isFromUser ?
          <div className="flex items-center text-xs text-blue-600">
            <PlayCircle className="w-3 h-3 mr-1" /> Start Contract
          </div> : undefined;
        break;
      case 'in_progress':
        newSteps[0].status = 'completed';
        newSteps[1].status = 'completed';
        newSteps[2].status = 'completed';
        newSteps[3].status = 'current';
        newSteps[3].description = 'Contract is in progress';
        newSteps[3].actionIcon = !isFromUser ?
          <div className="flex items-center text-xs text-blue-600">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Complete Contract
          </div> : undefined;
        break;
      case 'pending_completion':
        newSteps[0].status = 'completed';
        newSteps[1].status = 'completed';
        newSteps[2].status = 'completed';
        newSteps[3].status = 'completed';
        newSteps[4].status = 'current';
        newSteps[4].description = 'Waiting for final approval';
        newSteps[4].actionIcon = isFromUser ?
          <div className="flex items-center text-xs text-blue-600">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Complete Contract
          </div> : undefined;
        break;
      case 'completed':
        newSteps[0].status = 'completed';
        newSteps[1].status = 'completed';
        newSteps[2].status = 'completed';
        newSteps[3].status = 'completed';
        newSteps[4].status = 'completed';
        newSteps[5].status = 'current';
        break;
    }
    
    setContractSteps(newSteps);
  };

  const isSendForReviewEnabled = () => {
    if (isFromUser) {
      return !!contract.from.signature && !!contract.payment?.selectedPaymentType;
    }
    return false;
  };

  const showStartContractButton = isFromUser && contract.status === 'active';
  const showCompleteContractButton = 
    (!isFromUser && contract.status === 'in_progress') || 
    (isFromUser && contract.status === 'pending_completion');

  const isContractEditable = isFromUser && contract.status === 'draft';

  const getActionButton = () => {
    if (isFromUser) {
      switch (contract.status) {
        case 'draft':
          return (
            <Button 
              onClick={handleSendForReview}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!isSendForReviewEnabled()}
            >
              <Send className="w-4 h-4 mr-2" />
              Send for Review
            </Button>
          );
        case 'active':
          return (
            <Button 
              onClick={handleStartContract}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Start Contract
            </Button>
          );
        case 'pending_completion':
          return (
            <Button 
              onClick={handleCompleteContract}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Complete Contract
            </Button>
          );
        default:
          return null;
      }
    } else {
      // To user actions
      if (contract.status === 'pending_review' && !contract.to.signature) {
        return (
          <Button 
            onClick={() => setActiveTab('signature')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileSignature className="w-4 h-4 mr-2" />
            Sign Contract
          </Button>
        );
      }
      
      if (contract.status === 'in_progress') {
        return (
          <Button 
            onClick={handleCompleteContract}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Request Completion
          </Button>
        );
      }
    }
    
    return null;
  };

  const renderStatusBanner = () => {
    switch (contract.status) {
      case 'draft':
        if (isFromUser) {
          return (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start mb-8 animate-fade-in">
              <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-blue-800 font-medium">Confirm the details, add your signature and send for review.</p>
                <p className="text-sm text-blue-600">
                  Please review all contract details carefully before sending it for review.
                </p>
              </div>
            </div>
          );
        }
        break;
      case 'pending_review':
        if (!isFromUser) {
          return (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start mb-8 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-amber-800 font-medium">Contract is pending your review.</p>
                <p className="text-sm text-amber-600">
                  Please review the contract details and add your signature to activate the contract.
                </p>
              </div>
            </div>
          );
        } else {
          return (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start mb-8 animate-fade-in">
              <Clock className="w-5 h-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-amber-800 font-medium">Contract is pending review by the other party.</p>
                <p className="text-sm text-amber-600">
                  We'll notify you when they take action.
                </p>
              </div>
            </div>
          );
        }
      case 'active':
        return (
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start mb-8 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-green-800 font-medium">Contract is active and ready to start.</p>
              <p className="text-sm text-green-600">
                Both parties have signed the contract. {isFromUser ? "You can now start the contract." : "Waiting for the contract to be started."}
              </p>
            </div>
          </div>
        );
      case 'in_progress':
        return (
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-start mb-8 animate-fade-in">
            <PlayCircle className="w-5 h-5 text-indigo-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-indigo-800 font-medium">Contract is in progress.</p>
              <p className="text-sm text-indigo-600">
                {!isFromUser ? "You can request completion when the work is done." : "The other party can request completion when the work is done."}
              </p>
            </div>
          </div>
        );
      case 'pending_completion':
        return (
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex items-start mb-8 animate-fade-in">
            <ThumbsUp className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-purple-800 font-medium">Contract is pending completion.</p>
              <p className="text-sm text-purple-600">
                {isFromUser ? "Please review and complete final payments." : "Waiting for final approval and payment."}
              </p>
            </div>
          </div>
        );
      case 'completed':
        return (
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex items-start mb-8 animate-fade-in">
            <CheckCheck className="w-5 h-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-emerald-800 font-medium">Contract is completed.</p>
              <p className="text-sm text-emerald-600">
                This contract has been successfully completed.
              </p>
            </div>
          </div>
        );
    }
  };

  useEffect(() => {
    updateStepperStatus();
  }, [contract.status, isFromUser]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container flex justify-between items-center h-16 px-4 md:px-6">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-blue-600">
              Eveniopro
            </a>
          </div>
          
          <div className="flex gap-4 items-center">
            <a href="/offers" className="flex items-center px-3 py-1.5 text-sm">
              Offers
            </a>
            <a href="/home" className="flex items-center px-3 py-1.5 text-sm">
              Home
            </a>
            <a href="/dashboard" className="flex items-center px-3 py-1.5 text-sm">
              Dashboard
            </a>
            <div className="ml-4 relative flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                ST
              </div>
              <span className="text-sm">Sai Teja</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 md:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">Contract</h1>
            <Badge variant="outline" className={cn(
              "uppercase px-2 py-0.5",
              contract.status === 'draft' ? "bg-blue-50 text-blue-700 border-blue-200" :
              contract.status === 'pending_review' ? "bg-amber-50 text-amber-700 border-amber-200" :
              contract.status === 'active' ? "bg-green-50 text-green-700 border-green-200" :
              contract.status === 'in_progress' ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
              contract.status === 'pending_completion' ? "bg-purple-50 text-purple-700 border-purple-200" :
              contract.status === 'completed' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
              "bg-gray-50 text-gray-700 border-gray-200"
            )}>
              {contract.status.replace(/_/g, ' ')}
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            {getActionButton()}
            
            <Button
              onClick={() => setIsFromUser(!isFromUser)}
              variant="outline"
              className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
            >
              Switch to {isFromUser ? '"To" User View' : '"From" User View'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <div className="sticky top-24 bg-white rounded-lg shadow-soft border border-gray-100 p-8">
              <ContractStepper steps={contractSteps} />
            </div>
          </div>

          <div className="col-span-9">
            {renderStatusBanner()}

            <div className="space-y-6">
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4 grid grid-cols-6 gap-2 bg-gray-100 p-1">
                  <TabsTrigger value="overview">
                    <FileText className="w-4 h-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="payments">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Payments
                  </TabsTrigger>
                  <TabsTrigger value="signature">
                    <Edit className="w-4 h-4 mr-2" />
                    Signature
                  </TabsTrigger>
                  <TabsTrigger value="files">
                    <Paperclip className="w-4 h-4 mr-2" />
                    Files
                  </TabsTrigger>
                  <TabsTrigger value="chat">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="history">
                    <History className="w-4 h-4 mr-2" />
                    History
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6 animate-fade-in">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium">Contract Overview</CardTitle>
                      <div className="flex items-center gap-2">
                        {showCompleteContractButton && (
                          <Button 
                            onClick={handleCompleteContract}
                            variant="outline"
                            className="bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100"
                            size="sm"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            {isFromUser ? "Complete Contract" : "Request Completion"}
                          </Button>
                        )}
                        {showStartContractButton && (
                          <Button 
                            onClick={handleStartContract}
                            variant="outline"
                            className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                            size="sm"
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Start Contract
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ContractSummary 
                        contract={contract}
                        onEdit={isContractEditable ? handleEdit : undefined}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="payments" className="space-y-6 animate-fade-in">
                  {(contract.status === 'draft' && isFromUser) && (
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                        <CardDescription>Select how you would like to pay for this contract</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <Label>Payment Type</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div 
                              className={`p-4 border rounded-lg cursor-pointer ${selectedPaymentType === 'one-time' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                              onClick={() => setSelectedPaymentType('one-time')}
                            >
                              <div className="flex items-center">
                                <div className={`w-4 h-4 rounded-full border-2 ${selectedPaymentType === 'one-time' ? 'border-blue-500' : 'border-gray-300'} flex items-center justify-center`}>
                                  {selectedPaymentType === 'one-time' && (
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                  )}
                                </div>
                                <span className="ml-2 font-medium">One-time Payment</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-2">Pay the full amount at once</p>
                            </div>
                            
                            <div 
                              className={`p-4 border rounded-lg cursor-pointer ${selectedPaymentType === 'partial' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                              onClick={() => setSelectedPaymentType('partial')}
                            >
                              <div className="flex items-center">
                                <div className={`w-4 h-4 rounded-full border-2 ${selectedPaymentType === 'partial' ? 'border-blue-500' : 'border-gray-300'} flex items-center justify-center`}>
                                  {selectedPaymentType === 'partial' && (
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                  )}
                                </div>
                                <span className="ml-2 font-medium">Partial Payments</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-2">Split your payments over time</p>
                            </div>
                          </div>
                        </div>
                        
                        {selectedPaymentType === 'partial' && (
                          <div className="space-y-4 animate-in fade-in-50 slide-in-from-top-5 duration-200">
                            <Label>Payment Frequency</Label>
                            <Select
                              value={selectedPaymentFrequency}
                              onValueChange={(value) => setSelectedPaymentFrequency(value as any)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="Weekly">Weekly</SelectItem>
                                <SelectItem value="Daily">Daily</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            {selectedPaymentFrequency && (
                              <div className="mt-8 space-y-4">
                                <h3 className="text-lg font-medium">Payment Schedule Preview</h3>
                                {activePaymentIntervals
                                  .filter(interval => interval.PaymentFrequency === selectedPaymentFrequency)
                                  .map((interval, index) => (
                                    <PaymentSchedule 
                                      key={index}
                                      interval={interval}
                                      selected={true}
                                      onSelect={() => {}}
                                    />
                                  ))
                                }
                              </div>
                            )}
                          </div>
                        )}
                        
                        {selectedPaymentType === 'one-time' && (
                          <div className="mt-8 space-y-4 animate-in fade-in-50 slide-in-from-top-5 duration-200">
                            <h3 className="text-lg font-medium">Payment Details</h3>
                            {activePaymentIntervals[0] && (
                              <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-blue-800">Full Amount Due:</span>
                                  <span className="font-bold text-blue-800">
                                    {activePaymentIntervals[0].Tranches[0].Amount.CurrencyCode} {activePaymentIntervals[0].Tranches[0].Amount.Value.toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-blue-600">Due Date:</span>
                                  <span className="text-blue-600">
                                    {format(new Date(activePaymentIntervals[0].Tranches[0].DueDate), 'MMM d, yyyy')}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <Button 
                          onClick={handleSavePaymentMethod} 
                          className="w-full"
                          disabled={!selectedPaymentType || (selectedPaymentType === 'partial' && !selectedPaymentFrequency)}
                        >
                          Save Payment Method
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                  
                  <PaymentPlanDisplay 
                    paymentType={contract.payment?.selectedPaymentType}
                    paymentFrequency={contract.payment?.selectedPaymentFrequency}
                    interval={getPaymentIntervalDetails(
                      contract.payment?.selectedPaymentType === 'one-time' 
                        ? 'Monthly' 
                        : contract.payment?.selectedPaymentFrequency
                    )}
                    isFromUser={isFromUser}
                    onRequestPayment={handleRequestPayment}
                    onApprovePayment={handleApprovePayment}
                    onCancelPayment={handleCancelPayment}
                  />
                </TabsContent>
                
                <TabsContent value="signature" className="space-y-6 animate-fade-in">
                  <SignatureTab
                    contract={contract}
                    isFromUser={isFromUser}
                    onSign={handleSign}
                  />
                </TabsContent>
                
                <TabsContent value="files" className="space-y-6 animate-fade-in">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contract Files</CardTitle>
                      <CardDescription>View and manage contract documents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 border border-dashed rounded-lg">
                        <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Drag and drop files here or click to browse</p>
                        <Button variant="outline" className="mt-4">Add Files</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="chat" className="space-y-6 animate-fade-in">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contract Discussion</CardTitle>
                      <CardDescription>Chat with other parties involved in this contract</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg">
                        <p className="text-gray-500">Chat feature coming soon</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="history" className="space-y-6 animate-fade-in">
                  <HistoryTab history={contract.history} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <ReviewPanel 
        isOpen={isReviewPanelOpen}
        onClose={() => setIsReviewPanelOpen(false)}
        onComplete={(data) => {
          setContract({
            ...contract,
            status: 'pending_review',
            progress: 40
          });
          
          updateStepperStatus();
          
          toast({
            title: "Contract Sent for Review",
            description: `Your contract has been sent to ${contract.to.name} for review.`,
          });
          
          setIsReviewPanelOpen(false);
        }}
        contractData={{
          fromName: contract.from.name,
          toName: contract.to.name,
          rate: contract.details.rate,
        }}
      />
      
      <EditContractModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal(prev => ({ ...prev, isOpen: false }))}
        onSave={handleSaveEdit}
        section={editModal.section}
      />
      
      <Dialog open={isFeedbackModalOpen} onOpenChange={setIsFeedbackModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isFromUser ? "Complete Contract" : "Request Contract Completion"}
            </DialogTitle>
            <DialogDescription>
              {isFromUser 
                ? "Please provide your feedback to finalize the contract." 
                : "Please provide your feedback on the completed work."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFeedbackRating(rating)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      feedbackRating >= rating 
                        ? 'bg-yellow-400 text-white' 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comment">Comments</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFeedbackModalOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmitFeedback}
              className={isFromUser ? "bg-emerald-600 hover:bg-emerald-700" : "bg-purple-600 hover:bg-purple-700"}
            >
              {isFromUser ? "Complete Contract" : "Submit Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
