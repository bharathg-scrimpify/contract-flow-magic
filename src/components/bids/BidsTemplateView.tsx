
import React from 'react';
import { Bid } from '@/types/platform';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BidCard from '@/components/bids/BidCard';
import { useAuth } from '@/contexts/AuthContext';

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
  const { currentUser } = useAuth();
  const currentUserId = currentUser?.uid || '';
  
  return (
    <div className="space-y-6">
      {needIds.length === 0 ? (
        <p className="text-center py-6 text-gray-500 animate-fade-in">No templates found</p>
      ) : (
        <Accordion type="multiple" defaultValue={needIds}>
          {needIds.map((needId, index) => {
            const needBids = bids.filter(bid => bid.needId === needId);
            const needInfo = mockNeeds[needId]; // In real app, you'd fetch this from API
            
            if (!needInfo) return null;
            
            // Check if this is user's need or offer
            const firstBid = needBids[0];
            const isMyNeed = firstBid && firstBid.needOwnerId === currentUserId;
            
            return (
              <AccordionItem 
                key={needId} 
                value={needId} 
                className="border bg-purple-50/30 rounded-lg mb-4 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both',
                }}
                data-aos="fade-up"
              >
                <AccordionTrigger className="px-6 py-4 hover:bg-purple-50/50 transition-colors duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-900">{needInfo.title}</h3>
                      <Badge 
                        variant={isMyNeed ? "info" : "success"}
                        className="ml-2 transition-all duration-300 hover:scale-105"
                      >
                        {isMyNeed ? 'My Need' : 'My Offer'}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <Badge variant="purple" className="text-xs transition-all duration-300 hover:scale-105">
                        {needInfo.category.replace('_', ' ')}
                      </Badge>
                      {needBids.some(bid => bid.status === 'accepted') && (
                        <Badge variant="accepted" className="text-xs transition-all duration-300 hover:scale-105">
                          Has accepted bids
                        </Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {needBids.map((bid, bidIndex) => (
                      <div 
                        key={bid.id} 
                        className="animate-fade-in" 
                        style={{ 
                          animationDelay: `${bidIndex * 75}ms`,
                          animationFillMode: 'both',
                        }}
                      >
                        <BidCard key={bid.id} bid={bid} isMyNeed={isMyNeed} />
                      </div>
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
