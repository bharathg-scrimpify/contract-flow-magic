
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bid, CategoryType } from '@/types/platform';
import BidsTemplateView from '@/components/bids/BidsTemplateView';
import BidsList from '@/components/bids/BidsList';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

// Mock fetch function - replace with actual API call
const fetchBids = async (): Promise<Bid[]> => {
  // This would be replaced with an actual API call to fetch bids
  // For now, returning mock data
  return mockBids;
};

const BidsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'template' | 'list'>('template');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: bids, isLoading, error } = useQuery({
    queryKey: ['bids'],
    queryFn: fetchBids,
  });
  
  const filteredBids = bids?.filter(bid => {
    if (statusFilter === 'all') return true;
    return bid.status === statusFilter;
  }) || [];

  const needIds = [...new Set(filteredBids.map(bid => bid.needId))];
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bids</h1>
            <p className="text-gray-500">Manage matches between your needs and offers</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bids..."
                className="pl-10 h-10 w-full rounded-md border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'template' ? 'default' : 'outline'}
                onClick={() => setViewMode('template')}
                className={viewMode === 'template' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                Templates View
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-purple-600 hover:bg-purple-700' : ''}
              >
                List View
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <Tabs defaultValue="all" onValueChange={setStatusFilter}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Bids</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="contract_created">Contracted</TabsTrigger>
            </TabsList>
            
            <TabsContent value={statusFilter}>
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <p>Loading bids...</p>
                </div>
              ) : error ? (
                <div className="flex justify-center py-10">
                  <p className="text-red-500">Error loading bids</p>
                </div>
              ) : filteredBids.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium text-gray-700 mb-4">No bids found</h3>
                  <p className="text-gray-500 mb-6">There are currently no bids matching your criteria.</p>
                  <Button className="bg-purple-600 hover:bg-purple-700">Browse Listings</Button>
                </div>
              ) : viewMode === 'template' ? (
                <BidsTemplateView bids={filteredBids} needIds={needIds} />
              ) : (
                <BidsList bids={filteredBids} />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default BidsPage;

// Mock data for development purposes
const mockBids: Bid[] = [
  {
    id: 'bid1',
    needId: 'need1',
    offerId: 'offer1',
    needOwnerId: 'user1',
    offerOwnerId: 'user2',
    bidAmount: {
      value: 500,
      currency: 'USD',
      unit: 'event',
    },
    message: 'I can provide DJ services for your event.',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    matchConfidence: 90,
  },
  {
    id: 'bid2',
    needId: 'need1',
    offerId: 'offer2',
    needOwnerId: 'user1',
    offerOwnerId: 'user3',
    bidAmount: {
      value: 450,
      currency: 'USD',
      unit: 'event',
    },
    message: 'Professional DJ with 10+ years experience.',
    status: 'accepted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    matchConfidence: 85,
    contractId: 'contract1',
  },
  {
    id: 'bid3',
    needId: 'need2',
    offerId: 'offer3',
    needOwnerId: 'user1',
    offerOwnerId: 'user4',
    bidAmount: {
      value: 800,
      currency: 'USD',
      unit: 'event',
    },
    message: 'Can provide catering for 100 people.',
    status: 'rejected',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    matchConfidence: 70,
  },
  {
    id: 'bid4',
    needId: 'need2',
    offerId: 'offer4',
    needOwnerId: 'user1',
    offerOwnerId: 'user5',
    bidAmount: {
      value: 750,
      currency: 'USD',
      unit: 'event',
    },
    message: 'Gourmet catering service with full staff.',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    matchConfidence: 95,
  },
  {
    id: 'bid5',
    needId: 'need3',
    offerId: 'offer5',
    needOwnerId: 'user1',
    offerOwnerId: 'user6',
    bidAmount: {
      value: 300,
      currency: 'USD',
      unit: 'event',
    },
    message: 'Professional lighting setup for your event.',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    matchConfidence: 80,
  },
  {
    id: 'bid6',
    needId: 'need4',
    offerId: 'offer6',
    needOwnerId: 'user1',
    offerOwnerId: 'user7',
    bidAmount: {
      value: 600,
      currency: 'USD',
      unit: 'event',
    },
    message: 'Elegant flower arrangements for the entire venue.',
    status: 'contract_created',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    matchConfidence: 88,
    contractId: 'contract2',
  },
];
