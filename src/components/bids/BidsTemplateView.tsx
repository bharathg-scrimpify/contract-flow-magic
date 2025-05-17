
import React from 'react';
import { Bid } from '@/types/platform';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import BidCard from '@/components/bids/BidCard';

// Mock need data for now
const mockNeeds = {
  'need1': { title: 'DJ Services for Wedding', category: 'dj' },
  'need2': { title: 'Catering for Corporate Event', category: 'catering' },
  'need3': { title: 'Event Lighting', category: 'lighting_technician' },
  'need4': { title: 'Flower Decoration', category: 'other' },
};

interface BidsTemplateViewProps {
  bids: Bid[];
  needIds: string[];
}

const BidsTemplateView: React.FC<BidsTemplateViewProps> = ({ bids, needIds }) => {
  return (
    <div className="space-y-6">
      {needIds.length === 0 ? (
        <p className="text-center py-6 text-gray-500">No templates found</p>
      ) : (
        <Accordion type="multiple" defaultValue={needIds}>
          {needIds.map(needId => {
            const needBids = bids.filter(bid => bid.needId === needId);
            const needInfo = mockNeeds[needId]; // In real app, you'd fetch this from API
            
            if (!needInfo) return null;
            
            return (
              <AccordionItem key={needId} value={needId} className="border bg-purple-50/30 rounded-lg mb-4 overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:bg-purple-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{needInfo.title}</h3>
                      <p className="text-sm text-gray-500">
                        {needBids.length} {needBids.length === 1 ? 'bid' : 'bids'} received
                      </p>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                        {needInfo.category.replace('_', ' ')}
                      </span>
                      {needBids.some(bid => bid.status === 'accepted') && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                          Has accepted bids
                        </span>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {needBids.map(bid => (
                      <BidCard key={bid.id} bid={bid} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
};

export default BidsTemplateView;
