
import React from 'react';
import { Bid } from '@/types/platform';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Mock user data for now
const mockUsers = {
  'user2': { name: 'DJ Mike', image: 'https://i.pravatar.cc/150?img=1' },
  'user3': { name: 'DJ Sarah', image: 'https://i.pravatar.cc/150?img=2' },
  'user4': { name: 'Catering Plus', image: 'https://i.pravatar.cc/150?img=3' },
  'user5': { name: 'Elite Foods', image: 'https://i.pravatar.cc/150?img=4' },
  'user6': { name: 'LightUp Inc', image: 'https://i.pravatar.cc/150?img=5' },
  'user7': { name: 'Flower Power', image: 'https://i.pravatar.cc/150?img=6' },
};

// Mock need data for now
const mockNeeds = {
  'need1': { title: 'DJ Services for Wedding', category: 'dj' },
  'need2': { title: 'Catering for Corporate Event', category: 'catering' },
  'need3': { title: 'Event Lighting', category: 'lighting_technician' },
  'need4': { title: 'Flower Decoration', category: 'other' },
};

interface BidsListProps {
  bids: Bid[];
}

const BidsList: React.FC<BidsListProps> = ({ bids }) => {
  const getBidStatusClass = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'contract_created':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBidStatusText = (status: string) => {
    switch(status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'contract_created':
        return 'Contract Created';
      default:
        return status;
    }
  };

  // Group bids by template (needId)
  const groupedBids = bids.reduce((acc, bid) => {
    if (!acc[bid.needId]) {
      acc[bid.needId] = [];
    }
    acc[bid.needId].push(bid);
    return acc;
  }, {} as Record<string, Bid[]>);

  const needIds = Object.keys(groupedBids);

  if (needIds.length === 0) {
    return <p className="text-center py-6 text-gray-500">No bids found</p>;
  }

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={needIds}>
        {needIds.map(needId => {
          const templateBids = groupedBids[needId];
          const needInfo = mockNeeds[needId];
          
          if (!needInfo) return null;
          
          const hasAcceptedBids = templateBids.some(bid => bid.status === 'accepted' || bid.status === 'contract_created');
          
          return (
            <AccordionItem key={needId} value={needId} className="border rounded-md overflow-hidden mb-4 bg-white">
              <AccordionTrigger className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{needInfo.title}</h3>
                    <p className="text-sm text-gray-500">
                      {templateBids.length} {templateBids.length === 1 ? 'bid' : 'bids'} received
                    </p>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <Badge variant="secondary" className="text-xs">
                      {needInfo.category.replace('_', ' ')}
                    </Badge>
                    {hasAcceptedBids && (
                      <Badge variant="default" className="bg-green-500 text-xs">
                        Has accepted bids
                      </Badge>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Offer From</TableHead>
                        <TableHead>Bid Amount</TableHead>
                        <TableHead>Match %</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {templateBids.map((bid) => {
                        const offerUser = mockUsers[bid.offerOwnerId];
                        
                        if (!offerUser) return null;
                        
                        return (
                          <TableRow key={bid.id} className="hover:bg-gray-50 transition-colors">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                                  <img src={offerUser.image} alt={offerUser.name} className="h-full w-full object-cover" />
                                </div>
                                <span>{offerUser.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {bid.bidAmount.value} {bid.bidAmount.currency} per {bid.bidAmount.unit}
                            </TableCell>
                            <TableCell>
                              <span className={`font-medium ${bid.matchConfidence > 80 ? 'text-green-600' : 'text-amber-600'}`}>
                                {bid.matchConfidence}%
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge className={getBidStatusClass(bid.status)}>
                                {getBidStatusText(bid.status)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="whitespace-nowrap">
                                {formatDistanceToNow(new Date(bid.createdAt), { addSuffix: true })}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">View</Button>
                                {bid.status === 'accepted' && !bid.contractId && (
                                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Create Contract</Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default BidsList;
