
import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, Mail, MapPin, DollarSign, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
      <div className="p-6 space-y-5">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-sm font-medium text-gray-500">Contract Progress</h4>
            <span className="text-sm font-medium text-blue-600">{contract.progress}%</span>
          </div>
          <div className="relative w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-700 ease-in-out" 
              style={{ width: `${contract.progress}%` }}
            />
          </div>
        </div>
        
        {/* Contract Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Contract Agreement</h2>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-700">Subject: <span className="font-medium">{contract.subject}</span></p>
            <p className="text-xs text-gray-500">
              Facilitated by {contract.facilitatedBy} | Type: {contract.type}
            </p>
          </div>
          
          {/* Value Section */}
          <div className="bg-blue-50 rounded-lg p-4 flex items-start space-x-3">
            <DollarSign className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-800">Contract Value</p>
              <p className="text-sm text-blue-700">{contract.details.rate}</p>
              <p className="text-xs text-blue-600 mt-1">
                {contract.details.startDate} - {contract.details.endDate}
              </p>
            </div>
          </div>
          
          {/* Parties */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">From</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm font-medium truncate">{contract.from.name}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{contract.from.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-xs text-gray-500 truncate">{contract.from.email}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">To</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm font-medium truncate">{contract.to.name}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{contract.to.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-xs text-gray-500 truncate">{contract.to.email}</p>
            </div>
          </div>
        </div>
        
        {/* Key Contract Details */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">Essential Details</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start text-sm">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700">Location</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-gray-600 truncate max-w-[220px]">{contract.details.placeOfService}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[300px]">{contract.details.placeOfService}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            <div className="flex items-start text-sm">
              <Clock className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700">Duration</p>
                <p className="text-gray-600">{contract.details.startDate.split(',')[0]} - {contract.details.endDate.split(',')[0]}</p>
              </div>
            </div>
            
            <div className="flex items-start text-sm">
              <CheckCircle2 className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700">Additional Info</p>
                <p className="text-gray-600">
                  Meals Included: {contract.details.mealsIncluded ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <p className="text-xs text-center text-gray-500 mb-4">
            This contract is binding between {contract.from.name} and {contract.to.name}.
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
