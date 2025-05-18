
import React, { useState } from 'react';
import { Bid } from '@/types/platform';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, Search, Filter, FileText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useAuth } from '@/contexts/AuthContext';

interface BidsListProps {
  bids: Bid[];
}

const ITEMS_PER_PAGE = 5;

const BidsList: React.FC<BidsListProps> = ({ bids }) => {
  const { currentUser } = useAuth();
  const currentUserId = currentUser?.uid || '';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [templateTypeFilter, setTemplateTypeFilter] = useState<'all' | 'need' | 'offer'>('all');
  
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
    const needId = bid.needTemplate.id;
    if (!acc[needId]) {
      acc[needId] = [];
    }
    acc[needId].push(bid);
    return acc;
  }, {} as Record<string, Bid[]>);

  // Filter templates based on search query and filters
  const filteredNeedIds = Object.keys(groupedBids).filter(needId => {
    const templateBids = groupedBids[needId];
    if (templateBids.length === 0) return false;
    
    const firstBid = templateBids[0];
    const needTemplate = firstBid.needTemplate;
    
    // Filter by search query
    if (searchQuery && !needTemplate.templateName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (categoryFilter) {
      const hasCategory = needTemplate.categorySelection.some(
        cat => cat.name.toLowerCase() === categoryFilter.toLowerCase()
      );
      if (!hasCategory) return false;
    }
    
    // Filter by status
    if (statusFilter) {
      return templateBids.some(bid => bid.bidStatus.toLowerCase() === statusFilter.toLowerCase());
    }
    
    // Filter by template type (need/offer)
    if (templateTypeFilter !== 'all') {
      const isMyNeed = needTemplate.user.userId === currentUserId;
      if (templateTypeFilter === 'need' && !isMyNeed) return false;
      if (templateTypeFilter === 'offer' && isMyNeed) return false;
    }
    
    return true;
  });

  // Pagination
  const totalPages = Math.ceil(filteredNeedIds.length / ITEMS_PER_PAGE);
  const paginatedNeedIds = filteredNeedIds.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // Get unique categories for filter
  const categoriesSet = new Set<string>();
  bids.forEach(bid => {
    bid.needTemplate.categorySelection.forEach(cat => {
      categoriesSet.add(cat.name);
    });
  });
  const categories = Array.from(categoriesSet);

  if (filteredNeedIds.length === 0) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search templates..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen} className="w-full sm:w-auto">
            <div className="flex">
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-4 space-y-4 border rounded-md p-4 bg-white">
              <div>
                <h4 className="font-medium mb-2">Template Type</h4>
                <div className="flex flex-wrap gap-2">
                  {['all', 'need', 'offer'].map((type) => (
                    <Badge 
                      key={type}
                      variant={templateTypeFilter === type ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setTemplateTypeFilter(type as 'all' | 'need' | 'offer')}
                    >
                      {type === 'all' ? 'All Templates' : type === 'need' ? 'My Needs' : 'My Offers'}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Badge 
                      key={category}
                      variant={categoryFilter === category ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => setCategoryFilter(categoryFilter === category ? null : category)}
                    >
                      {category.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <div className="flex flex-wrap gap-2">
                  {['initial', 'accepted', 'rejected', 'contract_created'].map((status) => (
                    <Badge 
                      key={status}
                      variant={statusFilter === status ? getBidStatusVariant(status) : "outline"}
                      className="cursor-pointer"
                      onClick={() => setStatusFilter(statusFilter === status ? null : status)}
                    >
                      {getBidStatusText(status)}
                    </Badge>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <p className="text-center py-6 text-gray-500">No templates found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search templates..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen} className="w-full sm:w-auto">
          <div className="flex">
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-4 space-y-4 border rounded-md p-4 bg-white">
            <div>
              <h4 className="font-medium mb-2">Template Type</h4>
              <div className="flex flex-wrap gap-2">
                {['all', 'need', 'offer'].map((type) => (
                  <Badge 
                    key={type}
                    variant={templateTypeFilter === type ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setTemplateTypeFilter(type as 'all' | 'need' | 'offer')}
                  >
                    {type === 'all' ? 'All Templates' : type === 'need' ? 'My Needs' : 'My Offers'}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Category</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge 
                    key={category}
                    variant={categoryFilter === category ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setCategoryFilter(categoryFilter === category ? null : category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Status</h4>
              <div className="flex flex-wrap gap-2">
                {['initial', 'accepted', 'rejected', 'contract_created'].map((status) => (
                  <Badge 
                    key={status}
                    variant={statusFilter === status ? getBidStatusVariant(status) : "outline"}
                    className="cursor-pointer"
                    onClick={() => setStatusFilter(statusFilter === status ? null : status)}
                  >
                    {getBidStatusText(status)}
                  </Badge>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Accordion type="multiple" defaultValue={paginatedNeedIds}>
        {paginatedNeedIds.map(needId => {
          const templateBids = groupedBids[needId];
          if (templateBids.length === 0) return null;
          
          const firstBid = templateBids[0];
          const needTemplate = firstBid.needTemplate;
          
          const hasAcceptedBids = templateBids.some(bid => 
            bid.bidStatus.toLowerCase() === 'accepted' || 
            bid.bidStatus.toLowerCase() === 'contract_created'
          );
          
          const isMyNeed = needTemplate.user.userId === currentUserId;
          
          return (
            <AccordionItem key={needId} value={needId} className="border rounded-md overflow-hidden mb-4 bg-white shadow-sm hover:shadow-md transition-all">
              <AccordionTrigger className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-left">
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold text-gray-900">{needTemplate.templateName}</h3>
                    <Badge 
                      variant={isMyNeed ? "info" : "success"} 
                      className="ml-2"
                    >
                      {isMyNeed ? 'My Need' : 'My Offer'}
                    </Badge>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    {needTemplate.categorySelection.map((cat, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {cat.name}
                      </Badge>
                    ))}
                    {hasAcceptedBids && (
                      <Badge variant="accepted" className="text-xs">
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
                        const offerUser = bid.offerTemplate.user;
                        const profileImage = offerUser.profilePic 
                          ? `https://storage.googleapis.com/easygigsfrontend/${offerUser.profilePic.fileKey}`
                          : 'https://i.pravatar.cc/150?img=1';
                        
                        return (
                          <HoverCard key={bid.id}>
                            <HoverCardTrigger asChild>
                              <TableRow className="hover:bg-gray-50/70 transition-colors cursor-pointer">
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                                      <img src={profileImage} alt={offerUser.fullName} className="h-full w-full object-cover" />
                                    </div>
                                    <span>{offerUser.fullName}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {bid.bidRate.rate.value} {bid.bidRate.rate.currencyCode} per {
                                    bid.bidRate.durationType === 1 ? 'day' : 
                                    bid.bidRate.durationType === 2 ? 'hour' : 'event'
                                  }
                                </TableCell>
                                <TableCell>
                                  <span className={`font-medium ${(bid.matchConfidence || 80) > 80 ? 'text-green-600' : 'text-amber-600'}`}>
                                    {bid.matchConfidence || 80}%
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={getBidStatusVariant(bid.bidStatus)}>
                                    {getBidStatusText(bid.bidStatus)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <span className="whitespace-nowrap">
                                    {formatDistanceToNow(new Date(bid.createdDate), { addSuffix: true })}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline">View</Button>
                                    {bid.bidStatus.toLowerCase() === 'accepted' && bid.canCreateContract && (
                                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">Create Contract</Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80 p-0 backdrop-blur-sm">
                              <div className="p-4 border-b">
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                                      <img src={profileImage} alt={offerUser.fullName} className="h-full w-full object-cover" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-gray-900">{offerUser.fullName}</h4>
                                      <p className="text-xs text-gray-500">
                                        {formatDistanceToNow(new Date(bid.createdDate), { addSuffix: true })}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    <Badge variant={getBidStatusVariant(bid.bidStatus)}>
                                      {getBidStatusText(bid.bidStatus)}
                                    </Badge>
                                    <Badge variant={isMyNeed ? "info" : "success"} className="text-xs">
                                      {isMyNeed ? 'My Need' : 'My Offer'}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="mb-3">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-500">Match Confidence</span>
                                    <span className="text-sm font-semibold text-gray-900">{bid.matchConfidence || 80}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className={`h-1.5 rounded-full ${
                                        (bid.matchConfidence || 80) > 85 ? 'bg-emerald-500' : 
                                        (bid.matchConfidence || 80) > 70 ? 'bg-amber-500' : 'bg-rose-500'
                                      }`}
                                      style={{ width: `${bid.matchConfidence || 80}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="p-4">
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Notes</h5>
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                  {bid.notes || "No notes provided."}
                                </p>
                                
                                <div className="mt-4 flex justify-between items-center">
                                  <div>
                                    <span className="text-xs text-gray-500 block">Bid Amount</span>
                                    <p className="font-bold text-purple-700">
                                      {bid.bidRate.rate.value} {bid.bidRate.rate.currencyCode}
                                      <span className="text-xs font-normal text-gray-500 ml-1">
                                        per {bid.bidRate.durationType === 1 ? 'day' : bid.bidRate.durationType === 2 ? 'hour' : 'event'}
                                      </span>
                                    </p>
                                  </div>
                                  
                                  {bid.bidStatus.toLowerCase() === 'initial' && isMyNeed && (
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline" className="text-xs py-1 h-8">Reject</Button>
                                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs py-1 h-8">Accept</Button>
                                    </div>
                                  )}
                                </div>
                                
                                {bid.counterBidRate && (
                                  <div className="mt-3 p-2 bg-blue-50 rounded-md border border-blue-100">
                                    <span className="text-xs text-blue-600 font-medium">Counter Bid</span>
                                    <p className="font-semibold text-blue-700">
                                      {bid.counterBidRate.rate.value} {bid.counterBidRate.rate.currencyCode}
                                      <span className="text-xs font-normal text-blue-500 ml-1">
                                        per {bid.counterBidRate.durationType === 1 ? 'day' : bid.counterBidRate.durationType === 2 ? 'hour' : 'event'}
                                      </span>
                                    </p>
                                  </div>
                                )}
                              </div>
                            </HoverCardContent>
                          </HoverCard>
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

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default BidsList;
