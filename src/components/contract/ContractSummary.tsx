
import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, Mail, MapPin, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ContractSummaryProps {
  contract: {
    subject: string;
    type: string;
    facilitatedBy: string;
    from: {
      name: string;
      email: string;
    };
    to: {
      name: string;
      email: string;
    };
    details: {
      placeOfService: string;
      startDate: string;
      endDate: string;
      rate: string;
      mealsIncluded: boolean;
    };
    progress: number;
  };
  onSendForReview: () => void;
  onDelete: () => void;
  onDownloadPdf: () => void;
  className?: string;
}

const ContractSummary = ({ 
  contract, 
  onSendForReview, 
  onDelete, 
  onDownloadPdf,
  className 
}: ContractSummaryProps) => {
  return (
    <div className={cn("rounded-lg shadow-soft bg-white border border-gray-100", className)}>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="relative w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-brand-blue rounded-full transition-all duration-700 ease-in-out" 
              style={{ width: `${contract.progress}%` }}
            />
          </div>
          <div className="text-right text-sm text-gray-500">{contract.progress}% Complete</div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Contract Agreement</h2>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Subject: {contract.subject}</p>
            <p className="text-xs text-gray-400">
              Facilitated by {contract.facilitatedBy} | Type: {contract.type}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">From</p>
              <p className="text-sm">{contract.from.name}</p>
              <p className="text-xs text-gray-500">{contract.from.email}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">To</p>
              <p className="text-sm">{contract.to.name}</p>
              <p className="text-xs text-gray-500">{contract.to.email}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Contract Details</h3>
          
          <div className="space-y-2">
            <div className="flex items-start text-sm">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Place of Service</p>
                <p className="text-gray-600">{contract.details.placeOfService}</p>
              </div>
            </div>
            
            <div className="flex items-start text-sm">
              <Clock className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Duration</p>
                <p className="text-gray-600">{contract.details.startDate} - {contract.details.endDate}</p>
              </div>
            </div>
            
            <div className="flex items-start text-sm">
              <DollarSign className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Rate</p>
                <p className="text-gray-600">{contract.details.rate}</p>
              </div>
            </div>
            
            <div className="flex items-start text-sm">
              <Mail className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium">Additional Information</p>
                <p className="text-gray-600">
                  Meals Included: {contract.details.mealsIncluded ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <p className="text-xs text-center text-gray-500 mb-4">
            This contract is binding between {contract.from.name} and {contract.to.name},
            facilitated by {contract.facilitatedBy}.
          </p>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
              onClick={onDownloadPdf}
            >
              Download Draft PDF
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="border-red-100 text-red-600 hover:bg-red-50"
                onClick={onDelete}
              >
                Delete Contract
              </Button>
              
              <Button 
                className="bg-brand-blue hover:bg-brand-blue-dark text-white font-medium"
                onClick={onSendForReview}
              >
                Send For Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractSummary;
