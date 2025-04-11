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
  History
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
              <TabsList className="mb-4 grid grid-cols-4 gap-2 bg-gray-100 p-1">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white">
                  <FileText className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="parties" className="data-[state=active]:bg-white">
                  <User className="w-4 h-4 mr-2" />
                  Parties
                </TabsTrigger>
                <TabsTrigger value="details" className="data-[state=active]:bg-white">
                  <MapPin className="w-4 h-4 mr-2" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="other" className="data-[state=active]:bg-white">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Other
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Contract Summary</CardTitle>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </CardHeader>
                  <CardContent className="pt-4">
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="text-gray-500">Contract Type</dt>
                        <dd className="font-medium">{contract.type}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Facilitated By</dt>
                        <dd className="font-medium">{contract.facilitatedBy}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Created</dt>
                        <dd className="font-medium">
                          {new Date(contract.createdAt).toLocaleDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Status</dt>
                        <dd>
                          <Badge variant="outline" className="font-normal">
                            {contract.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium">Contract Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{contract.progress}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-blue-500" 
                            style={{ width: `${contract.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-medium">Contract Value</CardTitle>
                      <DollarSign className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold">{contract.details.rate}</div>
                      <p className="text-sm text-gray-500 mt-1">
                        From {contract.details.startDate} to {contract.details.endDate}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="parties" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Contract From</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleEditSection('from')}
                      className="h-8 gap-1"
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
                  </CardHeader>
                  <CardContent className="pt-4">
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
                      </div>
                    ) : (
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-gray-500 text-sm">Name</dt>
                          <dd className="font-medium">{contract.from.name}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500 text-sm">Email</dt>
                          <dd>{contract.from.email}</dd>
                        </div>
                      </dl>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Contract To</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleEditSection('to')}
                      className="h-8 gap-1"
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
                  </CardHeader>
                  <CardContent className="pt-4">
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
                      </div>
                    ) : (
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-gray-500 text-sm">Name</dt>
                          <dd className="font-medium">{contract.to.name}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500 text-sm">Email</dt>
                          <dd>{contract.to.email}</dd>
                        </div>
                      </dl>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Place of Service</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleEditSection('place')}
                      className="h-8 gap-1"
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
                  </CardHeader>
                  <CardContent className="pt-4">
                    {editingSections.place ? (
                      <div className="space-y-2">
                        <Label htmlFor="place">Address</Label>
                        <Textarea 
                          id="place" 
                          value={formState.details.placeOfService} 
                          onChange={(e) => handleFormChange('details', 'placeOfService', e.target.value)}
                          rows={3}
                        />
                      </div>
                    ) : (
                      <p className="text-gray-800">{contract.details.placeOfService}</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Time</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleEditSection('time')}
                      className="h-8 gap-1"
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
                  </CardHeader>
                  <CardContent className="pt-4">
                    {editingSections.time ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input 
                            id="startDate" 
                            value={formState.details.startDate} 
                            onChange={(e) => handleFormChange('details', 'startDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="endDate">End Date</Label>
                          <Input 
                            id="endDate" 
                            value={formState.details.endDate} 
                            onChange={(e) => handleFormChange('details', 'endDate', e.target.value)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Start Date</p>
                          <p className="text-gray-800">{contract.details.startDate}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">End Date</p>
                          <p className="text-gray-800">{contract.details.endDate}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Rate</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleEditSection('rate')}
                      className="h-8 gap-1"
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
                  </CardHeader>
                  <CardContent className="pt-4">
                    {editingSections.rate ? (
                      <div className="space-y-2">
                        <Label htmlFor="rate">Hourly Rate</Label>
                        <Input 
                          id="rate" 
                          value={formState.details.rate} 
                          onChange={(e) => handleFormChange('details', 'rate', e.target.value)}
                        />
                      </div>
                    ) : (
                      <p className="text-gray-800">{contract.details.rate}</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="other" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Additional Details</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleEditSection('additionalDetails')}
                      className="h-8 gap-1"
                    >
                      {editingSections.additionalDetails ? (
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
                  </CardHeader>
                  <CardContent className="pt-4">
                    {editingSections.additionalDetails ? (
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="mealsIncluded" 
                          checked={formState.details.mealsIncluded}
                          onCheckedChange={(checked) => handleFormChange('details', 'mealsIncluded', checked)}
                        />
                        <Label htmlFor="mealsIncluded">Meals Included</Label>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <p className="text-gray-800">Meals Included: </p>
                        <span className="ml-2 text-gray-800">
                          {contract.details.mealsIncluded ? 'Yes' : 'No'}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">Attachments</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Paperclip className="h-4 w-4" />
                      <span>Add</span>
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-4 text-center">
                    <div className="py-8 border border-dashed rounded-lg">
                      <Paperclip className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No attachments added</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Upload File
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">History</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-center py-6">
                      <History className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No history available</p>
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
