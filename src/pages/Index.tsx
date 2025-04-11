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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white border-b border-blue-100 sticky top-0 z-30 shadow-sm">
        <div className="container flex justify-between items-center h-16 px-4 md:px-6">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium shadow-md">
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
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Contract</h1>
            <Badge variant="outline" className="text-blue-800 bg-blue-50 border-blue-200 animate-pulse-slow">
              {contract.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsFromUser(!isFromUser)}
              variant="outline"
              className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100 transition-all hover:scale-105"
            >
              Switch to {isFromUser ? '"To" User View' : '"From" User View'}
            </Button>
            
            <Button 
              onClick={toggleDesign}
              variant="outline"
              className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 transition-all hover:scale-105"
            >
              Switch to {useAlternativeDesign ? 'Slide-in Panel' : 'Modal Dialog'}
            </Button>
          </div>
        </div>

        <div className="glass-panel rounded-xl shadow-elevation-2 p-8 mb-8 animate-fade-in">
          <ContractStepper steps={contractSteps} />
        </div>

        <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex items-start mb-8 animate-fade-in shadow-elevation-1">
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
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="mb-4 grid grid-cols-4 gap-2 bg-white/80 backdrop-blur-sm shadow-elevation-1 rounded-xl p-1 border border-blue-100">
                <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all">
                  <FileText className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="parties" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all">
                  <User className="w-4 h-4 mr-2" />
                  Parties
                </TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all">
                  <MapPin className="w-4 h-4 mr-2" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="other" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Other
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card className="glass-panel border-blue-100 overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-bl-full -z-10"></div>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
                      Contract Summary
                    </CardTitle>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-blue-50 transition-all hover:shadow-sm">
                        <dt className="text-gray-500 flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" />
                          Contract Type
                        </dt>
                        <dd className="font-medium">{contract.type}</dd>
                      </div>
                      <div className="p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-blue-50 transition-all hover:shadow-sm">
                        <dt className="text-gray-500 flex items-center gap-1">
                          <Star className="h-3.5 w-3.5" />
                          Facilitated By
                        </dt>
                        <dd className="font-medium">{contract.facilitatedBy}</dd>
                      </div>
                      <div className="p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-blue-50 transition-all hover:shadow-sm">
                        <dt className="text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Created
                        </dt>
                        <dd className="font-medium">
                          {new Date(contract.createdAt).toLocaleDateString()}
                        </dd>
                      </div>
                      <div className="p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-blue-50 transition-all hover:shadow-sm">
                        <dt className="text-gray-500 flex items-center gap-1">
                          <Zap className="h-3.5 w-3.5" />
                          Status
                        </dt>
                        <dd>
                          <Badge variant="outline" className="font-normal bg-white/50">
                            {contract.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="glass-panel border-blue-100 overflow-hidden">
                    <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-green-200/20 to-blue-300/20 rounded-br-full -z-10"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium flex items-center">
                        <Heart className="h-5 w-5 text-pink-500 mr-2" />
                        Contract Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{contract.progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-blue-100 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" 
                            style={{ width: `${contract.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-panel border-blue-100 overflow-hidden">
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-indigo-200/20 to-blue-300/20 rounded-tl-full -z-10"></div>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium flex items-center">
                        <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                        Contract Value
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">{contract.details.rate}</div>
                      <p className="text-sm text-gray-500 mt-1">
                        From {contract.details.startDate} to {contract.details.endDate}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="parties" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden shadow-elevation-1 border border-blue-100 transition-all hover:shadow-elevation-2">
                    <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4 text-white">
                      <h3 className="font-medium flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Contract From
                      </h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleEditSection('from')}
                        className="h-8 gap-1 text-white hover:bg-white/20"
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
                    <div className="p-6">
                      {editingSections.from ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="fromName">Name</Label>
                            <Input 
                              id="fromName" 
                              value={formState.from.name} 
                              onChange={(e) => handleFormChange('from', 'name', e.target.value)}
                              className="border-blue-200 focus:border-blue-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fromEmail">Email</Label>
                            <Input 
                              id="fromEmail" 
                              type="email" 
                              value={formState.from.email} 
                              onChange={(e) => handleFormChange('from', 'email', e.target.value)}
                              className="border-blue-200 focus:border-blue-400"
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
                        <dl className="grid gap-4">
                          <div className="p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-blue-50">
                            <dt className="text-gray-500 text-sm">Name</dt>
                            <dd className="font-medium mt-1">{contract.from.name}</dd>
                          </div>
                          <div className="p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-blue-50">
                            <dt className="text-gray-500 text-sm">Email</dt>
                            <dd className="mt-1">{contract.from.email}</dd>
                          </div>
                        </dl>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl overflow-hidden shadow-elevation-1 border border-indigo-100 transition-all hover:shadow-elevation-2">
                    <div className="flex justify-between items-center bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 text-white">
                      <h3 className="font-medium flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Contract To
                      </h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleEditSection('to')}
                        className="h-8 gap-1 text-white hover:bg-white/20"
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
                    <div className="p-6">
                      {editingSections.to ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="toName">Name</Label>
                            <Input 
                              id="toName" 
                              value={formState.to.name} 
                              onChange={(e) => handleFormChange('to', 'name', e.target.value)}
                              className="border-indigo-200 focus:border-indigo-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="toEmail">Email</Label>
                            <Input 
                              id="toEmail" 
                              type="email" 
                              value={formState.to.email} 
                              onChange={(e) => handleFormChange('to', 'email', e.target.value)}
                              className="border-indigo-200 focus:border-indigo-400"
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
                              className="gap-1 bg-gradient-to-r from-indigo-500 to-purple-500"
                            >
                              <Save className="h-4 w-4" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <dl className="grid gap-4">
                          <div className="p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-indigo-50">
                            <dt className="text-gray-500 text-sm">Name</dt>
                            <dd className="font-medium mt-1">{contract.to.name}</dd>
                          </div>
                          <div className="p-3 rounded-lg bg-white/70 backdrop-blur-sm border border-indigo-50">
                            <dt className="text-gray-500 text-sm">Email</dt>
                            <dd className="mt-1">{contract.to.email}</dd>
                          </div>
                        </dl>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-6">
                <div className="bg-
