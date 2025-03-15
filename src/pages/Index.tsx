import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ContractStepper, { Step } from '@/components/contract/ContractStepper';
import ContractSummary from '@/components/contract/ContractSummary';
import ReviewPanel from '@/components/contract/ReviewPanel';
import ReviewModal from '@/components/contract/ReviewModal';
import { Info, Edit, CheckCircle2 } from 'lucide-react';
import { Contract } from '@/types/contract';

const Index = () => {
  const { toast } = useToast();
  const [isReviewPanelOpen, setIsReviewPanelOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [useAlternativeDesign, setUseAlternativeDesign] = useState(false);
  const [contractSteps, setContractSteps] = useState<Step[]>([
    { id: 1, name: 'Draft', status: 'current' },
    { id: 2, name: 'Pending Review', status: 'upcoming' },
    { id: 3, name: 'Active', status: 'upcoming' },
    { id: 4, name: 'In Progress', status: 'upcoming' },
    { id: 5, name: 'Pending Completion', status: 'upcoming' },
    { id: 6, name: 'Completed', status: 'upcoming' },
  ]);
  
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
    createdAt: '2023-09-10T10:00:00Z',
    updatedAt: '2023-09-10T10:00:00Z',
  });

  const handleSendForReview = () => {
    if (useAlternativeDesign) {
      setIsReviewModalOpen(true);
    } else {
      setIsReviewPanelOpen(true);
    }
  };

  const handleReviewComplete = (data: any) => {
    setContract({
      ...contract,
      status: 'pending_review',
      progress: 40,
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
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
              Draft
            </span>
          </div>
          
          <button 
            onClick={toggleDesign}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Switch to {useAlternativeDesign ? 'Slide-in Panel' : 'Modal Dialog'}
          </button>
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
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-soft border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Contract From</h2>
                <div className="flex items-center justify-center w-6 h-6 bg-green-50 rounded-full text-green-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-gray-800">{contract.from.name}</p>
                <p className="text-gray-600">{contract.from.email}</p>
                <p className="text-gray-600">{contract.details.placeOfService}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-soft border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Contract To</h2>
                <div className="flex items-center justify-center w-6 h-6 bg-green-50 rounded-full text-green-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-gray-800">{contract.to.name}</p>
                <p className="text-gray-600">{contract.to.email}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-soft border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Place</h2>
                <button className="text-blue-600 hover:text-blue-800 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <p className="text-gray-800">{contract.details.placeOfService}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-soft border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Time</h2>
                <button className="text-blue-600 hover:text-blue-800 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Start Date</p>
                    <p className="text-gray-800">{contract.details.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">End Date</p>
                    <p className="text-gray-800">{contract.details.endDate}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-soft border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Rate</h2>
                <div className="flex items-center justify-center w-6 h-6 bg-green-50 rounded-full text-green-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-gray-800">{contract.details.rate}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-soft border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Additional Details</h2>
                <button className="text-blue-600 hover:text-blue-800 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <p className="text-gray-800">Meals Included: </p>
                  <span className="ml-2 text-gray-800">
                    {contract.details.mealsIncluded ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-soft border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Attachments</h2>
                <button className="text-blue-600 hover:text-blue-800 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-gray-500 text-center py-4">
                No attachments added
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-soft border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">History</h2>
              </div>
              
              <div className="text-gray-500 text-center py-4">
                No history available
              </div>
            </div>
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
