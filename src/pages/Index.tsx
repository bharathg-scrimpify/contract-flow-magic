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
  MessageSquare
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

  const isFromUser = true;

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
            <Badge variant="outline" className="text-blue-800 bg-blue-50 border-blue-200">
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

        <div className="bg-white rounded-lg shadow-soft border border-gray-100 p-8 mb-8">
          <ContractStepper steps={contractSteps} />
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start mb-8 animate-fade-in">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="text-blue-800 font-medium">Confirm the details, add your signature and send for review.</p>
            <p className="text-sm text-blue-600">
              Please review all contract details carefully before sending it for review.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="mb-4 grid grid-cols-4 gap-2 bg-gray-100 p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white">
                  <FileText className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="payments" className="data-[state=active]:bg-white">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Payments
                </TabsTrigger>
                <TabsTrigger value="chat" className="data-[state=active]:bg-white">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="attachments" className="data-[state=active]:bg-white">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Files
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Contract Overview</CardTitle>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ContractSummary 
                      contract={contract}
                      onEdit={(field, value) => {
                        const updatedContract = { ...contract };
                        switch (field) {
                          case 'fromName':
                            updatedContract.from.name = value;
                            break;
                          case 'toName':
                            updatedContract.to.name = value;
                            break;
                          case 'placeOfService':
                            updatedContract.details.placeOfService = value;
                            break;
                          case 'rate':
                            updatedContract.details.rate = value;
                            break;
                          case 'duration':
                            const [start, end] = value.split(' - ');
                            updatedContract.details.startDate = start;
                            updatedContract.details.endDate = end;
                            break;
                        }
                        setContract(updatedContract);
                        toast({
                          title: "Updated Successfully",
                          description: `${field} has been updated.`,
                        });
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="payments" className="space-y-6">
                <PaymentPlanDisplay 
                  paymentType={contract.payment?.selectedPaymentType}
                  paymentFrequency={contract.payment?.selectedPaymentFrequency}
                  interval={selectedPaymentInterval}
                  isFromUser={isFromUser}
                  onRequestPayment={handleRequestPayment}
                  onApprovePayment={handleApprovePayment}
                  onCancelPayment={handleCancelPayment}
                />
              </TabsContent>
              
              <TabsContent value="chat" className="space-y-6">
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
              
              <TabsContent value="attachments" className="space-y-6">
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
            </Tabs>
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ContractSummary 
                contract={{
                  subject: contract.subject,
                  type: contract.type,
                  facilitatedBy: contract.facilitatedBy,
                  from: contract.from,
                  to: contract.to,
                  details: contract.details,
                  progress: contract.progress,
                }}
                onSendForReview={handleSendForReview}
                onDelete={handleDeleteContract}
                onDownloadPdf={handleDownloadPdf}
              />
            </div>
          </div>
        </div>
      </main>
      
      <ReviewPanel 
        isOpen={!useAlternativeDesign && isReviewPanelOpen}
        onClose={() => setIsReviewPanelOpen(false)}
        onComplete={handleReviewComplete}
        contractData={{
          fromName: contract.from.name,
          toName: contract.to.name,
          rate: contract.details.rate,
        }}
      />
      
      <ReviewModal
        isOpen={useAlternativeDesign && isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onComplete={handleReviewComplete}
        contractData={{
          fromName: contract.from.name,
          toName: contract.to.name,
          rate: contract.details.rate,
        }}
      />
    </div>
  );
};

export default Index;
