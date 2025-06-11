
import React, { useState } from 'react';
import { Contract } from '@/types/contract';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Save, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';

interface JsonEditorProps {
  contract: Contract;
  onContractUpdate: (contract: Contract) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ contract, onContractUpdate }) => {
  const [jsonText, setJsonText] = useState(JSON.stringify(contract, null, 2));
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const validateJson = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      // Basic validation - check if it has required contract fields
      if (!parsed.id || !parsed.subject || !parsed.status || !parsed.from || !parsed.to) {
        throw new Error('Missing required contract fields (id, subject, status, from, to)');
      }
      setError('');
      setIsValid(true);
      return parsed;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Invalid JSON format';
      setError(errorMessage);
      setIsValid(false);
      return null;
    }
  };

  const handleJsonChange = (value: string) => {
    setJsonText(value);
    validateJson(value);
  };

  const handleSave = () => {
    const parsed = validateJson(jsonText);
    if (parsed) {
      onContractUpdate(parsed);
      toast({
        title: "Contract Updated",
        description: "Contract data has been updated from JSON editor.",
      });
    } else {
      toast({
        title: "Invalid JSON",
        description: error,
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    const originalJson = JSON.stringify(contract, null, 2);
    setJsonText(originalJson);
    setIsValid(true);
    setError('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Raw JSON Editor
                {isValid ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Valid
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Invalid
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Direct JSON editing for advanced contract management. Changes will update all contract fields.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave} 
                disabled={!isValid}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Apply Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">JSON Error:</span>
                </div>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            )}
            
            <Textarea
              value={jsonText}
              onChange={(e) => handleJsonChange(e.target.value)}
              className={`font-mono text-sm min-h-[500px] ${
                !isValid ? 'border-red-300 focus:border-red-500' : ''
              }`}
              placeholder="Contract JSON data..."
            />
            
            <div className="text-xs text-muted-foreground">
              <p>• Ensure all required fields are present: id, subject, status, from, to</p>
              <p>• Dates should be in ISO 8601 format (e.g., "2025-03-18T13:58:00Z")</p>
              <p>• Payment amounts should be numbers, not strings</p>
              <p>• Status must be one of: draft, pending_review, active, in_progress, pending_completion, completed, cancelled</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Field References */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Field Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Basic Fields</h4>
              <ul className="space-y-1 text-gray-600">
                <li><code>id</code> - Contract identifier</li>
                <li><code>subject</code> - Contract title</li>
                <li><code>type</code> - Contract type (Basic, Premium, etc.)</li>
                <li><code>status</code> - Current status</li>
                <li><code>progress</code> - Progress percentage (0-100)</li>
                <li><code>facilitatedBy</code> - Platform name</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Payment Fields</h4>
              <ul className="space-y-1 text-gray-600">
                <li><code>payment.NeedPayableAmount.Value</code> - Total amount</li>
                <li><code>payment.PlatformFee.FromNeed.Value</code> - Need fee</li>
                <li><code>payment.PlatformFee.FromOffer.Value</code> - Offer fee</li>
                <li><code>payment.selectedPaymentType</code> - "one-time" or "partial"</li>
                <li><code>payment.selectedPaymentFrequency</code> - Frequency</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Party Fields</h4>
              <ul className="space-y-1 text-gray-600">
                <li><code>from.name</code> - Service requester name</li>
                <li><code>from.email</code> - Requester email</li>
                <li><code>to.name</code> - Service provider name</li>
                <li><code>to.email</code> - Provider email</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Detail Fields</h4>
              <ul className="space-y-1 text-gray-600">
                <li><code>details.placeOfService</code> - Service location</li>
                <li><code>details.startDate</code> - Start date (ISO)</li>
                <li><code>details.endDate</code> - End date (ISO)</li>
                <li><code>details.rate</code> - Rate information</li>
                <li><code>details.mealsIncluded</code> - Boolean</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JsonEditor;
