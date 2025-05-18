
import React from 'react';
import { Bid } from '@/types/platform';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { FileText } from 'lucide-react';

// Mock user data for now
const mockUsers = {
  'user2': { name: 'DJ Mike', image: 'https://i.pravatar.cc/150?img=1' },
  'user3': { name: 'DJ Sarah', image: 'https://i.pravatar.cc/150?img=2' },
  'user4': { name: 'Catering Plus', image: 'https://i.pravatar.cc/150?img=3' },
  'user5': { name: 'Elite Foods', image: 'https://i.pravatar.cc/150?img=4' },
  'user6': { name: 'LightUp Inc', image: 'https://i.pravatar.cc/150?img=5' },
  'user7': { name: 'Flower Power', image: 'https://i.pravatar.cc/150?img=6' },
};

interface BidCardProps {
  bid: Bid;
  isMyNeed?: boolean;
}

const BidCard: React.FC<BidCardProps> = ({ bid, isMyNeed = true }) => {
  const getBidStatusBorder = (status: string) => {
    switch(status) {
      case 'pending':
        return 'border-amber-200';
      case 'accepted':
        return 'border-emerald-200';
      case 'rejected':
        return 'border-rose-200';
      case 'contract_created':
        return 'border-violet-200';
      default:
        return 'border-gray-200';
    }
  };

  const getBidStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "danger" | "info" | "purple" | "pending" | "accepted" | "rejected" | "contracted" => {
    switch(status) {
      case 'pending':
        return 'pending';
      case 'accepted':
        return 'accepted';
      case 'rejected':
        return 'rejected';
      case 'contract_created':
        return 'contracted';
      default:
        return 'secondary';
    }
  };

  const getBidStatusText = (status: string) => {
    switch(status) {
      case 'pending':
        return 'Pending Approval';
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

  const offerUser = mockUsers[bid.offerOwnerId];
  
  if (!offerUser) return null;

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 border-l-4 ${getBidStatusBorder(bid.status)}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 ring-2 ring-offset-2 ring-opacity-50 ring-purple-200 transition-all duration-300 hover:ring-purple-400">
              <img src={offerUser.image} alt={offerUser.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{offerUser.name}</h4>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(bid.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Badge variant={getBidStatusVariant(bid.status)} className="transition-all duration-200 hover:scale-105">
            {getBidStatusText(bid.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-500">Match Confidence</span>
            <span className="text-sm font-semibold text-gray-900">{bid.matchConfidence}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${
                bid.matchConfidence > 85 ? 'bg-emerald-500' : 
                bid.matchConfidence > 70 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: '0%' }}
              onAnimationEnd={(e) => {
                (e.target as HTMLDivElement).style.width = `${bid.matchConfidence}%`;
              }}
            ></div>
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg mb-3 transition-all duration-300 hover:bg-gray-100">
          <p className="text-sm text-gray-700">{bid.message || 'No message provided.'}</p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-500">Bid Amount</span>
            <p className="font-bold text-lg text-purple-700">
              {bid.bidAmount.value} {bid.bidAmount.currency}
              <span className="text-xs font-normal text-gray-500 ml-1">per {bid.bidAmount.unit}</span>
            </p>
          </div>
          <Badge variant={isMyNeed ? "info" : "success"} className="ml-2 transition-all duration-200 hover:scale-105">
            {isMyNeed ? 'My Need' : 'My Offer'}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        {bid.status === 'pending' && (
          <>
            <Button variant="outline" size="sm" className="flex-1 transition-all duration-200 hover:bg-gray-100">Reject</Button>
            <Button className="flex-1 bg-purple-600 hover:bg-purple-700 transition-all duration-200 hover:scale-105">Accept</Button>
          </>
        )}
        {bid.status === 'accepted' && !bid.contractId && (
          <Button className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-200 hover:scale-105">
            <FileText className="mr-2 h-4 w-4" />
            Create Contract
          </Button>
        )}
        {bid.contractId && (
          <Button variant="outline" className="w-full transition-all duration-200 hover:bg-gray-100">
            <FileText className="mr-2 h-4 w-4" />
            View Contract
          </Button>
        )}
        {bid.status === 'rejected' && (
          <Button variant="outline" className="w-full transition-all duration-200 hover:bg-gray-100">View Details</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BidCard;
