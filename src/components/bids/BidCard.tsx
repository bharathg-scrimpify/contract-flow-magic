
import React from 'react';
import { Bid } from '@/types/platform';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface BidCardProps {
  bid: Bid;
  isMyNeed?: boolean;
}

const BidCard: React.FC<BidCardProps> = ({ bid, isMyNeed = true }) => {
  const { currentUser } = useAuth();
  const currentUserId = currentUser?.uid || '';
  
  const getBidStatusBorder = (status: string) => {
    switch(status.toLowerCase()) {
      case 'initial':
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
    switch(status.toLowerCase()) {
      case 'initial':
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
    switch(status.toLowerCase()) {
      case 'initial':
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

  // Get the correct user based on whether this is a need or offer from the current user's perspective
  const offerUser = bid.offerTemplate.user;
  const needUser = bid.needTemplate.user;
  
  const isCurrentUserNeedOwner = needUser.userId === currentUserId;
  const actualIsMyNeed = isCurrentUserNeedOwner;
  
  // If isMyNeed prop is provided, use it, otherwise determine from user IDs
  const effectiveIsMyNeed = isMyNeed !== undefined ? isMyNeed : actualIsMyNeed;
  
  // Get the profile image URL
  const profileImage = offerUser.profilePic 
    ? `https://storage.googleapis.com/easygigsfrontend/${offerUser.profilePic.fileKey}`
    : 'https://i.pravatar.cc/150?img=1';

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 border-l-4 ${getBidStatusBorder(bid.bidStatus)}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100 ring-2 ring-offset-2 ring-opacity-50 ring-purple-200 transition-all duration-300 hover:ring-purple-400">
              <img src={profileImage} alt={offerUser.fullName} className="h-full w-full object-cover" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{offerUser.fullName}</h4>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(bid.createdDate), { addSuffix: true })}
              </p>
            </div>
          </div>
          <Badge variant={getBidStatusVariant(bid.bidStatus)} className="transition-all duration-200 hover:scale-105">
            {getBidStatusText(bid.bidStatus)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-500">Match Confidence</span>
            <span className="text-sm font-semibold text-gray-900">{bid.matchConfidence || 80}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${
                (bid.matchConfidence || 80) > 85 ? 'bg-emerald-500' : 
                (bid.matchConfidence || 80) > 70 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: '0%' }}
              onAnimationEnd={(e) => {
                (e.target as HTMLDivElement).style.width = `${bid.matchConfidence || 80}%`;
              }}
            ></div>
          </div>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg mb-3 transition-all duration-300 hover:bg-gray-100">
          <p className="text-sm text-gray-700">{bid.notes || 'No notes provided.'}</p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-500">Bid Amount</span>
            <p className="font-bold text-lg text-purple-700">
              {bid.bidRate.rate.value} {bid.bidRate.rate.currencyCode}
              <span className="text-xs font-normal text-gray-500 ml-1">per {bid.bidRate.durationType === 1 ? 'day' : bid.bidRate.durationType === 2 ? 'hour' : 'event'}</span>
            </p>
          </div>
          <Badge variant={effectiveIsMyNeed ? "info" : "success"} className="ml-2 transition-all duration-200 hover:scale-105">
            {effectiveIsMyNeed ? 'My Need' : 'My Offer'}
          </Badge>
        </div>
        
        {bid.counterBidRate && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
            <span className="text-xs text-blue-600 font-medium">Counter Bid</span>
            <p className="font-semibold text-blue-700">
              {bid.counterBidRate.rate.value} {bid.counterBidRate.rate.currencyCode}
              <span className="text-xs font-normal text-blue-500 ml-1">per {bid.counterBidRate.durationType === 1 ? 'day' : bid.counterBidRate.durationType === 2 ? 'hour' : 'event'}</span>
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        {bid.bidStatus.toLowerCase() === 'initial' && (
          <>
            <Button variant="outline" size="sm" className="flex-1 transition-all duration-200 hover:bg-gray-100">Reject</Button>
            <Button className="flex-1 bg-purple-600 hover:bg-purple-700 transition-all duration-200 hover:scale-105">Accept</Button>
          </>
        )}
        {bid.bidStatus.toLowerCase() === 'accepted' && bid.canCreateContract && (
          <Button className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-200 hover:scale-105">
            <FileText className="mr-2 h-4 w-4" />
            Create Contract
          </Button>
        )}
        {bid.bidStatus.toLowerCase() === 'rejected' && (
          <Button variant="outline" className="w-full transition-all duration-200 hover:bg-gray-100">View Details</Button>
        )}
        {bid.bidStatus.toLowerCase() === 'contract_created' && (
          <Button variant="outline" className="w-full transition-all duration-200 hover:bg-gray-100">
            <FileText className="mr-2 h-4 w-4" />
            View Contract
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BidCard;
