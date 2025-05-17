
import React from 'react';
import { Bid } from '@/types/platform';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

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

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Template</TableHead>
            <TableHead>Offer From</TableHead>
            <TableHead>Bid Amount</TableHead>
            <TableHead>Match %</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bids.map((bid) => {
            const offerUser = mockUsers[bid.offerOwnerId];
            const needInfo = mockNeeds[bid.needId];
            
            if (!offerUser || !needInfo) return null;
            
            return (
              <TableRow key={bid.id}>
                <TableCell className="font-medium">
                  <div>
                    <p className="font-semibold">{needInfo.title}</p>
                    <p className="text-xs text-gray-500">{needInfo.category.replace('_', ' ')}</p>
                  </div>
                </TableCell>
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
  );
};

export default BidsList;
