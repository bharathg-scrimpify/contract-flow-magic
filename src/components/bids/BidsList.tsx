
import React, { useState } from 'react';
import { Bid } from '@/types/platform';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ChevronDown, Search, Filter } from 'lucide-react';
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

const ITEMS_PER_PAGE = 5;

const BidsList: React.FC<BidsListProps> = ({ bids }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
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

  // Filter templates based on search query and filters
  const filteredNeedIds = Object.keys(groupedBids).filter(needId => {
    const needInfo = mockNeeds[needId];
    const templateBids = groupedBids[needId];
    
    if (!needInfo) return false;
    
    // Filter by search query
    if (searchQuery && !needInfo.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by category
    if (categoryFilter && needInfo.category !== categoryFilter) {
      return false;
    }
    
    // Filter by status
    if (statusFilter) {
      return templateBids.some(bid => bid.status === statusFilter);
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
  const categories = [...new Set(Object.values(mockNeeds).map(need => need.category))];

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
                  {['pending', 'accepted', 'rejected', 'contract_created'].map((status) => (
                    <Badge 
                      key={status}
                      variant={statusFilter === status ? "default" : "outline"}
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
                {['pending', 'accepted', 'rejected', 'contract_created'].map((status) => (
                  <Badge 
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
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
                      <Badge variant="success" className="text-xs">
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
                              <Badge variant={
                                bid.status === 'pending' ? 'warning' :
                                bid.status === 'accepted' ? 'success' :
                                bid.status === 'rejected' ? 'danger' :
                                bid.status === 'contract_created' ? 'purple' : 'default'
                              }>
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
