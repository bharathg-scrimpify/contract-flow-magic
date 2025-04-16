
import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, User, DollarSign, MapPin, Calendar, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export interface ContractSummaryProps {
  contract: {
    id: string;
    status: string;
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
    };
    createdAt: string;
    progress: number;
  };
  onEdit?: (field: string, value: string) => void;
  className?: string;
}

const ContractSummary = ({ contract, onEdit, className }: ContractSummaryProps) => {
  const [editingField, setEditingField] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState('');

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleSave = () => {
    if (editingField && onEdit) {
      onEdit(editingField, editValue);
    }
    setEditingField(null);
  };

  return (
    <div className={cn("rounded-lg bg-white border border-gray-200", className)}>
      <div className="p-6 space-y-6">
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

        {/* Contract Value */}
        <div className="bg-blue-50 rounded-lg p-4 flex items-start space-x-3">
          <DollarSign className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-blue-800">Contract Value</p>
            {editingField === 'rate' ? (
              <div className="flex items-center mt-1 gap-2">
                <Input 
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="max-w-[200px]"
                />
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-blue-700">{contract.details.rate}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={() => handleEdit('rate', contract.details.rate)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Essential Details */}
        <div className="space-y-4">
          {/* Parties */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">From</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={() => handleEdit('fromName', contract.from.name)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              {editingField === 'fromName' ? (
                <div className="flex items-center gap-2">
                  <Input 
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="text-sm font-medium truncate">{contract.from.name}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{contract.from.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">To</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={() => handleEdit('toName', contract.to.name)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              {editingField === 'toName' ? (
                <div className="flex items-center gap-2">
                  <Input 
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                  />
                  <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="text-sm font-medium truncate">{contract.to.name}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{contract.to.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Place of Service</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={() => handleEdit('placeOfService', contract.details.placeOfService)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            {editingField === 'placeOfService' ? (
              <div className="flex items-center gap-2">
                <Textarea 
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <p className="text-sm text-gray-600 truncate">{contract.details.placeOfService}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{contract.details.placeOfService}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          {/* Time */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Duration</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={() => handleEdit('duration', `${contract.details.startDate} - ${contract.details.endDate}`)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            {editingField === 'duration' ? (
              <div className="flex items-center gap-2">
                <Input 
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                {contract.details.startDate} - {contract.details.endDate}
              </p>
            )}
          </div>

          {/* Created On */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Created On</span>
            </div>
            <p className="text-sm text-gray-600">{new Date(contract.createdAt).toLocaleDateString()}</p>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <div>
              <Badge variant="outline" className="text-blue-800 bg-blue-50 border-blue-200">
                {contract.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractSummary;
