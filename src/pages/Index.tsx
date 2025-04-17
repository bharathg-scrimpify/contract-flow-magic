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
import { cn } from '@/lib/utils';
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

  const generatePaymentSchedules = () => {
    const { details } = contract;
    let startDate: Date;
    let endDate: Date;
    
    try {
      startDate = new Date(details.startDate);
      endDate = new Date(details.endDate);
    } catch (e) {
      const startParts = details.startDate.split(',')[0].split(' ');
      const endParts = details.endDate.split(',')[0].split(' ');
      
      const monthMap: {[key: string]: number} = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      
      startDate = new Date(
        parseInt(startParts[2]),
        monthMap[startParts[0]],
        parseInt(startParts[1])
      );
      
      endDate = new Date(
        parseInt(endParts[2]),
        monthMap[endParts[0]],
        parseInt(endParts[1])
      );
    }
    
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
    
    const adjustPaymentAmounts = (interval: PaymentInterval, totalAmount: number) => {
      const count = interval.Tranches.length;
      const baseAmount = parseFloat((totalAmount / count).toFixed(2));
      let remaining = totalAmount;
      
      for (let i = 0; i < count; i++) {
        if (i === count - 1) {
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
      status: 'pending_review' as const,
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
      status: 'in_progress' as const,
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
      if (contract.status !== 'pending_completion') {
        toast({
          title: "Action Not Allowed",
          description: "You can only complete the contract when it's in pending completion state.",
          variant: "destructive"
        });
        return;
      }
      
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
    
    let newStatus = isFromUser ? 'completed' as const : 'pending_completion' as const;
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
    
    let selectedInterval: PaymentInterval | undefined;
    
    if (selectedPaymentType === 'one-time') {
      selectedInterval = activePaymentIntervals[0];
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
          <Badge variant="outline" className={cn("bg-green-50 text-green-600 border-green-200")}>
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
            <CheckCircle2 className="w-3 h-3 mr-1" /> Request Completion
          </div> : undefined;
        break;
      case 'pending_completion':
        newSteps[0].status = 'completed';
        newSteps[1].status = 'completed';
        newSteps[2].status = 'completed';
        newSteps[3].status = 'completed';
        newSteps[4].status = 'current';
        newSteps[4].description = isFromUser ? 
          'Approve completion and leave feedback' : 
          'Waiting for approval';
        newSteps[4].actionIcon = isFromUser ?
          <div className="flex items-center text-xs text-blue-600">
            <ThumbsUp className="w-3 h-3 mr-1" /> Complete Contract
          </div> : undefined;
        break;
      case 'completed':
        newSteps[0].status = 'completed';
        newSteps[1].status = 'completed';
        newSteps[2].status = 'completed';
        newSteps[3].status = 'completed';
        newSteps[4].status = 'completed';
        newSteps[5].status = 'completed';
        newSteps[5].description = 'Contract successfully completed';
        break;
    }
    
    setContractSteps(newSteps);
  };

export default Index;
