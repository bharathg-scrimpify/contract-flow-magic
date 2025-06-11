import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Contract, ContractParty, ContractDetails, PaymentInterval, PaymentTranche } from '@/types/contract';
import { format } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  ChevronRight, 
  Save, 
  Trash, 
  Users, 
  FileText, 
  CalendarDays, 
  DollarSign, 
  History, 
  Paperclip,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  RefreshCw
} from 'lucide-react';
import PaymentPlanDisplay from '@/components/contract/PaymentPlanDisplay';

const getMockContract = (): Contract => ({
  id: 'c-12345',
  subject: 'Healthcare Support Contract',
  type: 'Premium',
  facilitatedBy: 'Eveniopro',
  status: 'active',
  progress: 65,
  from: {
    name: 'Sai Teja Kotagiri',
    email: 'samjose@gmail.com',
    organization: 'HealthCare Solutions Inc.',
    address: '123 Medical Plaza, Healthcare District, NY 10001'
  },
  to: {
    name: 'Mittu HIC',
    email: 'mittuhic@example.com',
    organization: 'Regional Medical Center',
    address: 'Building number 220, Hyderabad Telangana 50007'
  },
  details: {
    placeOfService: 'Building number 220, Hyderabad Telangana 50007',
    startDate: '2025-03-18T13:58:00Z',
    endDate: '2025-03-25T13:58:00Z',
    rate: 'USD 22/hour',
    mealsIncluded: true,
    additionalDetails: 'Emergency medical support required. 24/7 availability needed.'
  },
  payment: {
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
                },
                Status: "paid",
                PaymentDate: "2025-03-28T10:30:00Z"
              },
              {
                DueDate: "2025-05-01T00:00:00Z",
                Amount: {
                  CurrencyCode: "USD",
                  Value: 500.00
                },
                Status: "requested",
                RequestDate: "2025-04-25T09:15:00Z"
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
                },
                Status: "not_paid"
              },
              {
                DueDate: "2025-04-14T00:00:00Z",
                Amount: {
                  CurrencyCode: "USD",
                  Value: 250.00
                },
                Status: "not_paid"
              },
              {
                DueDate: "2025-04-21T00:00:00Z",
                Amount: {
                  CurrencyCode: "USD",
                  Value: 250.00
                },
                Status: "not_paid"
              },
              {
                DueDate: "2025-04-28T00:00:00Z",
                Amount: {
                  CurrencyCode: "USD",
                  Value: 250.00
                },
                Status: "not_paid"
              }
            ]
          }
        ]
      }
    ],
    selectedPaymentType: "partial",
    selectedPaymentFrequency: "Monthly"
  },
  history: [
    {
      id: 'h1',
      date: '2025-03-15T10:00:00Z',
      action: 'Contract Created',
      user: 'Sai Teja Kotagiri',
      notes: 'Initial contract creation'
    },
    {
      id: 'h2',
      date: '2025-03-16T14:30:00Z',
      action: 'Contract Reviewed',
      user: 'Mittu HIC',
      notes: 'Reviewed terms and conditions'
    },
    {
      id: 'h3',
      date: '2025-03-18T09:00:00Z',
      action: 'Contract Activated',
      user: 'System',
      notes: 'Contract automatically activated on start date'
    }
  ],
  createdAt: '2025-03-15T10:00:00Z',
  updatedAt: '2025-03-18T09:00:00Z',
});

const AdminContractEditor = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [contract, setContract] = useState<Contract>(getMockContract());
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d, yyyy, h:mm a');
    } catch (e) {
      return dateStr;
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Changes Saved",
        description: `Contract #${contract.id} has been updated successfully.`,
      });
      setIsSaving(false);
      setContract(prev => ({
        ...prev,
        updatedAt: new Date().toISOString()
      }));
    }, 1000);
  };

  const handleStatusChange = (newStatus: Contract['status']) => {
    setContract(prev => ({
      ...prev,
      status: newStatus,
      updatedAt: new Date().toISOString()
    }));
    
    toast({
      title: "Status Updated",
      description: `Contract status changed to ${newStatus.replace('_', ' ').toUpperCase()}.`,
    });
  };

  const handleProgressChange = (progress: number) => {
    setContract(prev => ({
      ...prev,
      progress: Math.max(0, Math.min(100, progress)),
      updatedAt: new Date().toISOString()
    }));
  };

  const handlePaymentTrancheUpdate = (intervalFrequency: string, trancheIndex: number, updates: Partial<PaymentTranche>) => {
    if (!contract.payment) return;
    
    const updatedContract = { ...contract };
    const intervalIndex = updatedContract.payment.PaymentPlans[0].PaymentIntervals.findIndex(
      interval => interval.PaymentFrequency === intervalFrequency
    );
    
    if (intervalIndex === -1) return;
    
    updatedContract.payment.PaymentPlans[0].PaymentIntervals[intervalIndex].Tranches[trancheIndex] = {
      ...updatedContract.payment.PaymentPlans[0].PaymentIntervals[intervalIndex].Tranches[trancheIndex],
      ...updates
    };
    
    updatedContract.updatedAt = new Date().toISOString();
    setContract(updatedContract);
  };

  const addHistoryEntry = (action: string, notes?: string) => {
    const newEntry = {
      id: `h${Date.now()}`,
      date: new Date().toISOString(),
      action,
      user: 'Admin',
      notes
    };
    
    setContract(prev => ({
      ...prev,
      history: [newEntry, ...(prev.history || [])],
      updatedAt: new Date().toISOString()
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container flex justify-between items-center h-16 px-4 md:px-6">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Eveniopro Admin
            </Link>
          </div>
          
          <div className="flex gap-4 items-center">
            <Link to="/admin/dashboard" className="flex items-center px-3 py-1.5 text-sm">
              Dashboard
            </Link>
            <Link to="/admin/contracts" className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600">
              Contracts
            </Link>
            <Link to="/admin/users" className="flex items-center px-3 py-1.5 text-sm">
              Users
            </Link>
            <div className="ml-4 relative flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                AD
              </div>
              <span className="text-sm">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 md:px-6">
        {/* Breadcrumb and Actions */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Link to="/admin/contracts" className="text-sm text-gray-500 hover:text-gray-800">
                Contracts
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium">Contract #{id}</span>
            </div>
            <h1 className="text-2xl font-semibold mt-2">Admin Contract Editor</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Link to={`/contracts/${id}`} className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50">
              View Public Page
            </Link>
            <Button 
              onClick={handleSaveChanges} 
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Contract Control
                </CardTitle>
                <CardDescription>Admin editor view</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Contract ID</p>
                  <p className="font-medium">{contract.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(contract.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{formatDate(contract.updatedAt)}</p>
                </div>
                
                {/* Quick Status Change */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={contract.status}
                    onValueChange={(value) => handleStatusChange(value as Contract['status'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">DRAFT</SelectItem>
                      <SelectItem value="pending_review">PENDING REVIEW</SelectItem>
                      <SelectItem value="active">ACTIVE</SelectItem>
                      <SelectItem value="in_progress">IN PROGRESS</SelectItem>
                      <SelectItem value="pending_completion">PENDING COMPLETION</SelectItem>
                      <SelectItem value="completed">COMPLETED</SelectItem>
                      <SelectItem value="cancelled">CANCELLED</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Progress Control */}
                <div className="space-y-2">
                  <Label>Progress (%)</Label>
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    value={contract.progress}
                    onChange={(e) => handleProgressChange(parseInt(e.target.value))}
                  />
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${contract.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => addHistoryEntry('Admin Review', 'Contract reviewed by admin for customer support')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Reviewed
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => addHistoryEntry('Customer Issue Resolved', 'Issue resolved through admin intervention')}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Log Issue Resolution
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button variant="destructive" className="w-full">
                  <Trash className="w-4 h-4 mr-2" />
                  Delete Contract
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-6 mb-6">
                <TabsTrigger value="overview">
                  <FileText className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="parties">
                  <Users className="w-4 h-4 mr-2" />
                  Parties
                </TabsTrigger>
                <TabsTrigger value="details">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="payments">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Payments
                </TabsTrigger>
                <TabsTrigger value="history">
                  <History className="w-4 h-4 mr-2" />
                  History
                </TabsTrigger>
                <TabsTrigger value="attachments">
                  <Paperclip className="w-4 h-4 mr-2" />
                  Files
                </TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contract Overview</CardTitle>
                      <CardDescription>Basic contract information and quick edits</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="subject">Contract Subject</Label>
                          <Input 
                            id="subject" 
                            value={contract.subject} 
                            onChange={(e) => setContract({...contract, subject: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">Contract Type</Label>
                          <Select 
                            value={contract.type}
                            onValueChange={(value) => setContract({...contract, type: value})}
                          >
                            <SelectTrigger id="type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Basic">Basic</SelectItem>
                              <SelectItem value="Premium">Premium</SelectItem>
                              <SelectItem value="Enterprise">Enterprise</SelectItem>
                              <SelectItem value="Custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="facilitatedBy">Facilitated By</Label>
                        <Input 
                          id="facilitatedBy" 
                          value={contract.facilitatedBy} 
                          onChange={(e) => setContract({...contract, facilitatedBy: e.target.value})}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Total Value</p>
                            <p className="text-2xl font-bold">
                              {contract.payment?.NeedPayableAmount.CurrencyCode} {contract.payment?.NeedPayableAmount.Value.toFixed(2)}
                            </p>
                          </div>
                          <DollarSign className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
                              {contract.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <CheckCircle className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">Progress</p>
                            <p className="text-2xl font-bold">{contract.progress}%</p>
                          </div>
                          <Clock className="h-8 w-8 text-orange-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Parties Tab */}
              <TabsContent value="parties">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>From Party (Service Requester)</CardTitle>
                      <CardDescription>The party requesting the service</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fromName">Name</Label>
                        <Input 
                          id="fromName" 
                          value={contract.from.name} 
                          onChange={(e) => setContract({
                            ...contract, 
                            from: {...contract.from, name: e.target.value}
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fromEmail">Email</Label>
                        <Input 
                          id="fromEmail" 
                          type="email"
                          value={contract.from.email} 
                          onChange={(e) => setContract({
                            ...contract, 
                            from: {...contract.from, email: e.target.value}
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fromOrganization">Organization</Label>
                        <Input 
                          id="fromOrganization" 
                          value={contract.from.organization || ''} 
                          onChange={(e) => setContract({
                            ...contract, 
                            from: {...contract.from, organization: e.target.value}
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fromAddress">Address</Label>
                        <Textarea 
                          id="fromAddress" 
                          value={contract.from.address || ''} 
                          onChange={(e) => setContract({
                            ...contract, 
                            from: {...contract.from, address: e.target.value}
                          })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>To Party (Service Provider)</CardTitle>
                      <CardDescription>The party providing the service</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="toName">Name</Label>
                        <Input 
                          id="toName" 
                          value={contract.to.name} 
                          onChange={(e) => setContract({
                            ...contract, 
                            to: {...contract.to, name: e.target.value}
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="toEmail">Email</Label>
                        <Input 
                          id="toEmail" 
                          type="email"
                          value={contract.to.email} 
                          onChange={(e) => setContract({
                            ...contract, 
                            to: {...contract.to, email: e.target.value}
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="toOrganization">Organization</Label>
                        <Input 
                          id="toOrganization" 
                          value={contract.to.organization || ''} 
                          onChange={(e) => setContract({
                            ...contract, 
                            to: {...contract.to, organization: e.target.value}
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="toAddress">Address</Label>
                        <Textarea 
                          id="toAddress" 
                          value={contract.to.address || ''} 
                          onChange={(e) => setContract({
                            ...contract, 
                            to: {...contract.to, address: e.target.value}
                          })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Details Tab */}
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract Details</CardTitle>
                    <CardDescription>Service and timeline information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="placeOfService">Place of Service</Label>
                      <Textarea 
                        id="placeOfService" 
                        value={contract.details.placeOfService} 
                        onChange={(e) => setContract({
                          ...contract, 
                          details: {...contract.details, placeOfService: e.target.value}
                        })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input 
                          id="startDate" 
                          type="datetime-local"
                          value={new Date(contract.details.startDate).toISOString().slice(0, 16)}
                          onChange={(e) => setContract({
                            ...contract, 
                            details: {...contract.details, startDate: new Date(e.target.value).toISOString()}
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input 
                          id="endDate" 
                          type="datetime-local"
                          value={new Date(contract.details.endDate).toISOString().slice(0, 16)}
                          onChange={(e) => setContract({
                            ...contract, 
                            details: {...contract.details, endDate: new Date(e.target.value).toISOString()}
                          })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rate">Rate</Label>
                      <Input 
                        id="rate" 
                        value={contract.details.rate} 
                        onChange={(e) => setContract({
                          ...contract, 
                          details: {...contract.details, rate: e.target.value}
                        })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="mealsIncluded" 
                        checked={contract.details.mealsIncluded}
                        onCheckedChange={(checked) => setContract({
                          ...contract, 
                          details: {...contract.details, mealsIncluded: checked}
                        })}
                      />
                      <Label htmlFor="mealsIncluded">Meals Included</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="additionalDetails">Additional Details</Label>
                      <Textarea 
                        id="additionalDetails" 
                        value={contract.details.additionalDetails || ''} 
                        onChange={(e) => setContract({
                          ...contract, 
                          details: {...contract.details, additionalDetails: e.target.value}
                        })}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Payments Tab */}
              <TabsContent value="payments">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Configuration</CardTitle>
                      <CardDescription>Comprehensive payment management for customer support</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Payment Amounts */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Total Amount (Need Payable)</Label>
                          <div className="flex gap-2">
                            <Input 
                              value={contract.payment?.NeedPayableAmount.CurrencyCode} 
                              onChange={(e) => {
                                if (!contract.payment) return;
                                setContract({
                                  ...contract,
                                  payment: {
                                    ...contract.payment,
                                    NeedPayableAmount: {
                                      ...contract.payment.NeedPayableAmount,
                                      CurrencyCode: e.target.value
                                    }
                                  }
                                });
                              }}
                              className="w-20"
                              placeholder="USD"
                            />
                            <Input 
                              type="number"
                              step="0.01"
                              value={contract.payment?.NeedPayableAmount.Value} 
                              onChange={(e) => {
                                if (!contract.payment) return;
                                setContract({
                                  ...contract,
                                  payment: {
                                    ...contract.payment,
                                    NeedPayableAmount: {
                                      ...contract.payment.NeedPayableAmount,
                                      Value: parseFloat(e.target.value) || 0
                                    }
                                  }
                                });
                              }}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Platform Fee (From Need)</Label>
                          <Input 
                            type="number"
                            step="0.01"
                            value={contract.payment?.PlatformFee.FromNeed.Value} 
                            onChange={(e) => {
                              if (!contract.payment) return;
                              setContract({
                                ...contract,
                                payment: {
                                  ...contract.payment,
                                  PlatformFee: {
                                    ...contract.payment.PlatformFee,
                                    FromNeed: {
                                      ...contract.payment.PlatformFee.FromNeed,
                                      Value: parseFloat(e.target.value) || 0
                                    }
                                  }
                                }
                              });
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Platform Fee (From Offer)</Label>
                          <Input 
                            type="number"
                            step="0.01"
                            value={contract.payment?.PlatformFee.FromOffer.Value} 
                            onChange={(e) => {
                              if (!contract.payment) return;
                              setContract({
                                ...contract,
                                payment: {
                                  ...contract.payment,
                                  PlatformFee: {
                                    ...contract.payment.PlatformFee,
                                    FromOffer: {
                                      ...contract.payment.PlatformFee.FromOffer,
                                      Value: parseFloat(e.target.value) || 0
                                    }
                                  }
                                }
                              });
                            }}
                          />
                        </div>
                      </div>

                      {/* Payment Type and Frequency */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Payment Type</Label>
                          <Select 
                            value={contract.payment?.selectedPaymentType || 'one-time'} 
                            onValueChange={(value) => setContract({
                              ...contract, 
                              payment: {
                                ...contract.payment!,
                                selectedPaymentType: value as 'one-time' | 'partial'
                              }
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="one-time">One-time Payment</SelectItem>
                              <SelectItem value="partial">Partial Payment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {contract.payment?.selectedPaymentType === 'partial' && (
                          <div className="space-y-2">
                            <Label>Payment Frequency</Label>
                            <Select 
                              value={contract.payment.selectedPaymentFrequency || 'Monthly'} 
                              onValueChange={(value) => setContract({
                                ...contract,
                                payment: {
                                  ...contract.payment!,
                                  selectedPaymentFrequency: value as 'Monthly' | 'Weekly' | 'Daily'
                                }
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Monthly">Monthly</SelectItem>
                                <SelectItem value="Weekly">Weekly</SelectItem>
                                <SelectItem value="Daily">Daily</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Schedule Management */}
                  {contract.payment?.selectedPaymentType === 'partial' && contract.payment.selectedPaymentFrequency && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Schedule Management</CardTitle>
                        <CardDescription>Detailed payment tranche management for customer support</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <PaymentPlanDisplay
                          paymentType={contract.payment.selectedPaymentType}
                          paymentFrequency={contract.payment.selectedPaymentFrequency}
                          interval={contract.payment.PaymentPlans[0]?.PaymentIntervals.find(
                            interval => interval.PaymentFrequency === contract.payment?.selectedPaymentFrequency
                          )}
                          isFromUser={true}
                          onRequestPayment={(trancheIndex) => {
                            const selectedInterval = contract.payment?.selectedPaymentFrequency;
                            if (selectedInterval) {
                              handlePaymentTrancheUpdate(selectedInterval, trancheIndex, { 
                                Status: 'requested', 
                                RequestDate: new Date().toISOString() 
                              });
                              addHistoryEntry('Payment Requested', `Admin requested payment for tranche ${trancheIndex + 1}`);
                            }
                          }}
                          onApprovePayment={(trancheIndex) => {
                            const selectedInterval = contract.payment?.selectedPaymentFrequency;
                            if (selectedInterval) {
                              handlePaymentTrancheUpdate(selectedInterval, trancheIndex, { 
                                Status: 'paid', 
                                PaymentDate: new Date().toISOString() 
                              });
                              addHistoryEntry('Payment Approved', `Admin approved payment for tranche ${trancheIndex + 1}`);
                            }
                          }}
                          onCancelPayment={(trancheIndex) => {
                            const selectedInterval = contract.payment?.selectedPaymentFrequency;
                            if (selectedInterval) {
                              handlePaymentTrancheUpdate(selectedInterval, trancheIndex, { Status: 'cancelled' });
                              addHistoryEntry('Payment Cancelled', `Admin cancelled payment for tranche ${trancheIndex + 1}`);
                            }
                          }}
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract History</CardTitle>
                    <CardDescription>Audit trail and activity log</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contract.history?.map((entry) => (
                        <div key={entry.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{entry.action}</h4>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(entry.date)}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              By {entry.user}
                            </p>
                            {entry.notes && (
                              <p className="text-sm mt-1">{entry.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Attachments Tab */}
              <TabsContent value="attachments">
                <Card>
                  <CardHeader>
                    <CardTitle>Contract Attachments</CardTitle>
                    <CardDescription>Manage files and documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 border border-dashed rounded-lg bg-gray-50">
                      <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Drag and drop files here or click to browse</p>
                      <Button variant="outline" className="mt-4">Add Attachment</Button>
                    </div>
                    
                    {contract.attachments && contract.attachments.length > 0 ? (
                      <div className="mt-6 space-y-2">
                        {contract.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center text-blue-600 mr-3">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-medium">{attachment.name}</p>
                                <p className="text-xs text-gray-500">{(attachment.size / 1000).toFixed(2)} KB</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Trash className="w-4 h-4 text-gray-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminContractEditor;
