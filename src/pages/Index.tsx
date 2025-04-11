
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ContractStepper, { Step } from '@/components/contract/ContractStepper';
import ContractSummary from '@/components/contract/ContractSummary';
import ReviewPanel from '@/components/contract/ReviewPanel';
import ReviewModal from '@/components/contract/ReviewModal';
import PaymentPlanDisplay from '@/components/contract/PaymentPlanDisplay';
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
  Zap,
  Sparkles,
  Star,
  Heart
} from 'lucide-react';
import { Contract, PaymentInterval, PaymentTranche } from '@/types/contract';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Index = () => {
  const { toast } = useToast();
  const [isReviewPanelOpen, setIsReviewPanelOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [useAlternativeDesign, setUseAlternativeDesign] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFromUser, setIsFromUser] = useState(true);
  const [editingSections, setEditingSections] = useState({
    from: false,
    to: false,
    place: false,
    time: false,
    rate: false,
    additionalDetails: false,
  });

  const [contractSteps, setContractSteps] = useState<Step[]>([
    { id: 1, name: 'Draft', status: 'current' },
    { id: 2, name: 'Pending Review', status: 'upcoming' },
    { id: 3, name: 'Active', status: 'upcoming' },
    { id: 4, name: 'In Progress', status: 'upcoming' },
    { id: 5, name: 'Pending Completion', status: 'upcoming' },
    { id: 6, name: 'Completed', status: 'upcoming' },
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
    createdAt: '2023-09-10T10:00:00Z',
    updatedAt: '2023-09-10T10:00:00Z',
  });

  const [formState, setFormState] = useState({
    from: { ...contract.from },
    to: { ...contract.to },
    details: { ...contract.details },
  });

  const handleSendForReview = () => {
    if (useAlternativeDesign) {
      setIsReviewModalOpen(true);
    } else {
      setIsReviewPanelOpen(true);
    }
  };

  const handleReviewComplete = (data: any) => {
    const updatedPayment = { ...contract.payment! };
    updatedPayment.selectedPaymentType = data.paymentType;
    updatedPayment.selectedPaymentFrequency = data.paymentType === 'partial' ? data.selectedInterval : undefined;

    setContract({
      ...contract,
      status: 'pending_review',
      progress: 40,
      payment: updatedPayment
    });
    
    const updatedSteps = contractSteps.map(step => {
      if (step.id === 1) return { ...step, status: 'completed' as const };
      if (step.id === 2) return { ...step, status: 'current' as const };
      return step;
    });
    setContractSteps(updatedSteps);
    
    setIsReviewPanelOpen(false);
    setIsReviewModalOpen(false);
    
    toast({
      title: "Contract Sent for Review",
      description: `Payment of $${data.totalAmount.toFixed(2)} has been processed successfully.`,
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

  const toggleDesign = () => {
    setUseAlternativeDesign(prev => !prev);
  };

  const getPaymentIntervalDetails = (frequency?: string) => {
    if (!frequency || !contract.payment) return null;
    
    const paymentInterval = contract.payment.PaymentPlans[0].PaymentIntervals.find(
      interval => interval.PaymentFrequency === frequency
    );
    
    return paymentInterval;
  };

  const selectedPaymentInterval = getPaymentIntervalDetails(contract.payment?.selectedPaymentFrequency);

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
            <a href="/offers" className="flex items-center px-3 py-1.5 text-sm hover:text-blue-600 transition-colors">
              Offers
            </a>
            <a href="/home" className="flex items-center px-3 py-1.5 text-sm hover:text-blue-600 transition-colors">
              Home
            </a>
            <a href="/dashboard" className="flex items-center px-3 py-1.5 text-sm hover:text-blue-600 transition-colors">
              Dashboard
            </a>
            <div className="ml-4 relative flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                ST
              </div>
              <span className="text-sm font-medium">Sai Teja</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 md:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">Contract</h1>
            <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">
              {contract.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsFromUser(!isFromUser)}
              variant="outline"
              className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
            >
              Switch to {isFromUser ? '"To" User View' : '"From" User View'}
            </Button>
            
            <Button 
              onClick={toggleDesign}
              variant="outline"
              className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
            >
              Switch to {useAlternativeDesign ? 'Slide-in Panel' : 'Modal Dialog'}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <ContractStepper steps={contractSteps} />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start mb-8">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-blue-800 font-medium">Confirm the details, add your signature and send for review.</p>
            <p className="text-sm text-blue-600">
              Please review all contract details carefully before sending it for review.
            </p>
          </div>
        </div>

        {contract.payment?.selectedPaymentType && (
          <PaymentPlanDisplay 
            paymentType={contract.payment.selectedPaymentType}
            paymentFrequency={contract.payment.selectedPaymentFrequency}
            interval={selectedPaymentInterval}
            isFromUser={isFromUser}
            onRequestPayment={handleRequestPayment}
            onApprovePayment={handleApprovePayment}
            onCancelPayment={handleCancelPayment}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <AccordionItem value="from">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4 text-blue-500" />
                    Contract From
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-medium text-gray-700">From Details</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleEditSection('from')}
                      className="h-8 gap-1 text-blue-600 hover:bg-blue-50"
                    >
                      {editingSections.from ? (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save</span>
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {editingSections.from ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fromName">Name</Label>
                        <Input 
                          id="fromName" 
                          value={formState.from.name} 
                          onChange={(e) => handleFormChange('from', 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fromEmail">Email</Label>
                        <Input 
                          id="fromEmail" 
                          type="email" 
                          value={formState.from.email} 
                          onChange={(e) => handleFormChange('from', 'email', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingSections({...editingSections, from: false})}
                          className="gap-1"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => toggleEditSection('from')}
                          className="gap-1"
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <dl className="divide-y divide-gray-100">
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{contract.from.name}</dd>
                      </div>
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{contract.from.email}</dd>
                      </div>
                    </dl>
                  )}
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="to">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4 text-blue-500" />
                    Contract To
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-medium text-gray-700">To Details</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleEditSection('to')}
                      className="h-8 gap-1 text-blue-600 hover:bg-blue-50"
                    >
                      {editingSections.to ? (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save</span>
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {editingSections.to ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="toName">Name</Label>
                        <Input 
                          id="toName" 
                          value={formState.to.name} 
                          onChange={(e) => handleFormChange('to', 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="toEmail">Email</Label>
                        <Input 
                          id="toEmail" 
                          type="email" 
                          value={formState.to.email} 
                          onChange={(e) => handleFormChange('to', 'email', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingSections({...editingSections, to: false})}
                          className="gap-1"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => toggleEditSection('to')}
                          className="gap-1"
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <dl className="divide-y divide-gray-100">
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{contract.to.name}</dd>
                      </div>
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{contract.to.email}</dd>
                      </div>
                    </dl>
                  )}
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="place">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    Place of Service
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-medium text-gray-700">Address Details</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleEditSection('place')}
                      className="h-8 gap-1 text-blue-600 hover:bg-blue-50"
                    >
                      {editingSections.place ? (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save</span>
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {editingSections.place ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="placeOfService">Address</Label>
                        <Textarea 
                          id="placeOfService" 
                          value={formState.details.placeOfService} 
                          onChange={(e) => handleFormChange('details', 'placeOfService', e.target.value)}
                          className="resize-none"
                          rows={4}
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingSections({...editingSections, place: false})}
                          className="gap-1"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => toggleEditSection('place')}
                          className="gap-1"
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <dl className="divide-y divide-gray-100">
                      <div className="px-4 py-3 sm:px-0">
                        <dt className="text-sm font-medium text-gray-500 mb-2">Place of Service</dt>
                        <dd className="text-sm text-gray-900">{contract.details.placeOfService}</dd>
                      </div>
                    </dl>
                  )}
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="time">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Time Frame
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-medium text-gray-700">Time Details</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleEditSection('time')}
                      className="h-8 gap-1 text-blue-600 hover:bg-blue-50"
                    >
                      {editingSections.time ? (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save</span>
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {editingSections.time ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date & Time</Label>
                        <Input 
                          id="startDate" 
                          value={formState.details.startDate} 
                          onChange={(e) => handleFormChange('details', 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date & Time</Label>
                        <Input 
                          id="endDate" 
                          value={formState.details.endDate} 
                          onChange={(e) => handleFormChange('details', 'endDate', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingSections({...editingSections, time: false})}
                          className="gap-1"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => toggleEditSection('time')}
                          className="gap-1"
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <dl className="divide-y divide-gray-100">
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{contract.details.startDate}</dd>
                      </div>
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-500">End Date</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{contract.details.endDate}</dd>
                      </div>
                    </dl>
                  )}
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="rate">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="h-4 w-4 text-blue-500" />
                    Rate
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-medium text-gray-700">Payment Details</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleEditSection('rate')}
                      className="h-8 gap-1 text-blue-600 hover:bg-blue-50"
                    >
                      {editingSections.rate ? (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Save</span>
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {editingSections.rate ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="rate">Rate</Label>
                        <Input 
                          id="rate" 
                          value={formState.details.rate} 
                          onChange={(e) => handleFormChange('details', 'rate', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setEditingSections({...editingSections, rate: false})}
                          className="gap-1"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          onClick={() => toggleEditSection('rate')}
                          className="gap-1"
                        >
                          <Save className="h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <dl className="divide-y divide-gray-100">
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium text-gray-500">Rate</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{contract.details.rate}</dd>
                      </div>
                    </dl>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="space-y-6">
            {/* Additional section for the right panel */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Contract Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full" 
                  onClick={handleSendForReview}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Send for Review
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleDownloadPdf}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDeleteContract}
                >
                  <X className="mr-2 h-4 w-4" />
                  Delete Contract
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      {isReviewPanelOpen && (
        <ReviewPanel 
          isOpen={isReviewPanelOpen}
          onClose={() => setIsReviewPanelOpen(false)}
          onComplete={handleReviewComplete}
          contractData={{
            fromName: contract.from.name,
            toName: contract.to.name,
            rate: contract.details.rate
          }}
        />
      )}
      
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onComplete={handleReviewComplete}
        contractData={{
          fromName: contract.from.name,
          toName: contract.to.name,
          rate: contract.details.rate
        }}
      />
    </div>
  );
};

export default Index;
