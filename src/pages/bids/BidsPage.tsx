
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bid } from '@/types/platform';
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
    return bid.bidStatus.toLowerCase() === statusFilter.toLowerCase();
  }) || [];

  // Group by needTemplate.id instead of needId
  const needIds = [...new Set(filteredBids.map(bid => bid.needTemplate.id))];
  
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
              <TabsTrigger value="initial">Initial</TabsTrigger>
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

// New mock data based on the provided structure
const mockBids: Bid[] = [
  {
    id: "67db3a50443b08a41fcc1148",
    bidIdentifier: "BID-2467AD238B",
    bidOfferStatus: "Initial",
    bidNeedStatus: "Initial",
    needTemplate: {
      id: "66ed5fe71f20eb9ca51f5e93",
      needIdentifier: "NID-A49B98BF7C",
      rates: [],
      templateName: "Rigging template",
      templateDescription: "<p>Rigging</p>\n",
      categorySelection: [
        {
          id: "294aed62-9e12-40ad-ba10-3b1aad70649e",
          name: "Production"
        },
        {
          id: "944a15c3-e800-4457-8831-1fad9d463607",
          name: "Equipment"
        }
      ],
      userId: "66e1221c6116cd3d11ef65a4",
      dateRange: {
        startDateTime: "2024-09-19T18:30:00Z",
        endDateTime: "2024-09-19T18:30:00Z",
        recurrenceRule: ""
      },
      locationRange: {
        range: 34,
        rangeUnit: "Miles"
      },
      address: {
        addressLine1: "123Apt",
        addressLine2: "",
        city: "Hyderabad",
        state: "Telangana",
        zip: "500074",
        country: null,
        longitude: null,
        latitude: null,
        googlePlaceId: "ChIJhSoP6rqYyzsRE5YHj2gKq5I"
      },
      isLive: false,
      isActive: true,
      isFeatured: false,
      createdBy: null,
      createdDate: "0001-01-01T00:00:00Z",
      modifiedBy: null,
      modifiedDate: "0001-01-01T00:00:00Z",
      user: {
        id: "66e1221c6116cd3d11ef65a4",
        userId: "M0LFFeKW9NZXufReBKtvczy16Sm2",
        firstName: "Manish",
        lastName: "DevTest",
        fullName: "Manish DevTest",
        email: "manish@gmail.com",
        phone: null,
        gender: "",
        birthDate: "",
        address: {
          addressLine1: null,
          addressLine2: null,
          city: null,
          state: null,
          zip: null,
          country: null,
          longitude: null,
          latitude: null,
          googlePlaceId: null
        },
        aboutMe: "",
        companyId: null,
        roleId: 1,
        invitedBy: null,
        isActive: true,
        createdBy: "",
        createdDate: "2024-09-11T04:52:44.07Z",
        updatedDate: "2025-05-09T13:47:13.719Z",
        updatedBy: "System",
        profilePic: null,
        coverPic: null,
        lastSignInTimestamp: null,
        profileScore: null,
        companyLegalName: null,
        companyBrandName: null,
        stripeDetails: {
          customerId: "cus_RqlrvnHHmfXpcb",
          connectAccountId: "acct_1RMrGdPKVaLkI3Je",
          subscriptionId: null,
          hasActiveSubscription: false
        }
      },
      canSendBid: false
    },
    offerTemplate: {
      id: "66edbead7220d314e8e3104d",
      offerIdentifier: "OID-28C59A796F",
      rates: [
        {
          durationType: 1,
          rate: {
            currencyCode: "USD",
            value: 66
          },
          isMealIncluded: false
        }
      ],
      templateName: "Backline templatefe two",
      templateDescription: "<p>Backline template</p>\n",
      categorySelection: [
        {
          id: "294aed62-9e12-40ad-ba10-3b1aad70649e",
          name: "Production"
        },
        {
          id: "944a15c3-e800-4457-8831-1fad9d463607",
          name: "Equipment"
        },
        {
          id: "340bbaaa-323d-42b9-a6ac-0bf48c88b50a",
          name: "Backline"
        }
      ],
      userId: "66cf4462474b676d4e3ce696",
      dateRange: {
        startDateTime: "2024-09-19T18:30:00Z",
        endDateTime: "2024-09-20T18:30:00Z",
        recurrenceRule: ""
      },
      locationRange: {
        range: 80,
        rangeUnit: "Miles"
      },
      address: {
        addressLine1: "apt building 123",
        addressLine2: "",
        city: "Telengana",
        state: "Telangana",
        zip: "500074",
        country: null,
        longitude: null,
        latitude: null,
        googlePlaceId: "ChIJgwlI-LqYyzsR630KAn9ts2w"
      },
      isLive: true,
      isActive: true,
      isFeatured: false,
      createdBy: null,
      createdDate: "0001-01-01T00:00:00Z",
      modifiedBy: null,
      modifiedDate: "0001-01-01T00:00:00Z",
      user: {
        id: "66cf4462474b676d4e3ce696",
        userId: "FHRkkrRcKsT2VrJnZ70sw5G9pfi2",
        firstName: "Sai Teja",
        lastName: "Kotagiri",
        fullName: "Sai Teja Kotagiri",
        email: "samjose@gmail.com",
        phone: "+19494992431",
        gender: "Male",
        birthDate: "1994-03-17",
        address: {
          addressLine1: "789 Park Avenue",
          addressLine2: "",
          city: "Huntington",
          state: "New York",
          zip: "11743",
          country: "United States",
          longitude: null,
          latitude: null,
          googlePlaceId: null
        },
        aboutMe: "Hello",
        companyId: null,
        roleId: 1,
        invitedBy: null,
        isActive: true,
        createdBy: "",
        createdDate: "2024-08-28T15:38:10.792Z",
        updatedDate: "2025-05-09T11:18:02.686Z",
        updatedBy: "System",
        profilePic: {
          entityType: null,
          entityId: null,
          id: "2f87ae9a-7d0f-4758-ade4-e5457c9cd585",
          fileName: "avatar.png",
          fileSize: 91069,
          fileKey: "ProfilePic/66cf4462474b676d4e3ce696/avatar.png",
          createdBy: "",
          createdDate: "2025-02-19T12:35:11.373Z",
          isActive: true
        },
        coverPic: {
          entityType: null,
          entityId: null,
          id: "93cab797-46f7-40fe-a3e7-782616147b22",
          fileName: "Abstract1.jpg",
          fileSize: 9437282,
          fileKey: "CoverPic/66cf4462474b676d4e3ce696/Abstract1.jpg",
          createdBy: "Sam Jose",
          createdDate: "2025-01-16T07:11:30.89Z",
          isActive: true
        },
        lastSignInTimestamp: null,
        profileScore: 65,
        companyLegalName: null,
        companyBrandName: null,
        stripeDetails: {
          customerId: "cus_SEI4CI3vHviAfw",
          connectAccountId: "acct_1RMowGPGetFVE3yK",
          subscriptionId: null,
          hasActiveSubscription: false
        }
      },
      canSendBid: false
    },
    startDate: "2025-03-19T21:42:40.754Z",
    endDate: "2025-03-26T21:42:40.754Z",
    bidRate: {
      durationType: 1,
      rate: {
        currencyCode: "USD",
        value: 66
      },
      isMealIncluded: false
    },
    counterBidRate: null,
    user: null,
    bidStatus: "Initial",
    isActive: true,
    notes: null,
    bidOrigin: "Automatic",
    createdBy: "System",
    createdDate: "2025-03-19T21:42:40.754Z",
    modifiedBy: "System",
    modifiedDate: "2025-03-19T21:42:40.754Z",
    canAcceptBid: false,
    canCreateContract: false,
    revision: 1,
    matchConfidence: 87 // Added for compatibility
  },
  // Adding another bid with different status for testing
  {
    id: "67db3a50443b08a41fcc1149",
    bidIdentifier: "BID-3467AD238C",
    bidOfferStatus: "Accepted",
    bidNeedStatus: "Accepted",
    needTemplate: {
      id: "66ed5fe71f20eb9ca51f5e93", // Same need as first bid
      needIdentifier: "NID-A49B98BF7C",
      rates: [],
      templateName: "Rigging template",
      templateDescription: "<p>Rigging</p>\n",
      categorySelection: [
        {
          id: "294aed62-9e12-40ad-ba10-3b1aad70649e",
          name: "Production"
        },
        {
          id: "944a15c3-e800-4457-8831-1fad9d463607",
          name: "Equipment"
        }
      ],
      userId: "66e1221c6116cd3d11ef65a4",
      dateRange: {
        startDateTime: "2024-09-19T18:30:00Z",
        endDateTime: "2024-09-19T18:30:00Z",
        recurrenceRule: ""
      },
      locationRange: {
        range: 34,
        rangeUnit: "Miles"
      },
      address: {
        addressLine1: "123Apt",
        addressLine2: "",
        city: "Hyderabad",
        state: "Telangana",
        zip: "500074",
        country: null,
        longitude: null,
        latitude: null,
        googlePlaceId: "ChIJhSoP6rqYyzsRE5YHj2gKq5I"
      },
      isLive: false,
      isActive: true,
      isFeatured: false,
      createdBy: null,
      createdDate: "0001-01-01T00:00:00Z",
      modifiedBy: null,
      modifiedDate: "0001-01-01T00:00:00Z",
      user: {
        id: "66e1221c6116cd3d11ef65a4",
        userId: "M0LFFeKW9NZXufReBKtvczy16Sm2",
        firstName: "Manish",
        lastName: "DevTest",
        fullName: "Manish DevTest",
        email: "manish@gmail.com",
        phone: null,
        gender: "",
        birthDate: "",
        address: {
          addressLine1: null,
          addressLine2: null,
          city: null,
          state: null,
          zip: null,
          country: null,
          longitude: null,
          latitude: null,
          googlePlaceId: null
        },
        aboutMe: "",
        companyId: null,
        roleId: 1,
        invitedBy: null,
        isActive: true,
        createdBy: "",
        createdDate: "2024-09-11T04:52:44.07Z",
        updatedDate: "2025-05-09T13:47:13.719Z",
        updatedBy: "System",
        profilePic: null,
        coverPic: null,
        lastSignInTimestamp: null,
        profileScore: null,
        companyLegalName: null,
        companyBrandName: null,
        stripeDetails: {
          customerId: "cus_RqlrvnHHmfXpcb",
          connectAccountId: "acct_1RMrGdPKVaLkI3Je",
          subscriptionId: null,
          hasActiveSubscription: false
        }
      },
      canSendBid: false
    },
    offerTemplate: {
      id: "66edbead7220d314e8e31050", // Different offer
      offerIdentifier: "OID-28C59A796G",
      rates: [
        {
          durationType: 1,
          rate: {
            currencyCode: "USD",
            value: 80
          },
          isMealIncluded: true
        }
      ],
      templateName: "Audio Production Services",
      templateDescription: "<p>Professional audio production</p>\n",
      categorySelection: [
        {
          id: "294aed62-9e12-40ad-ba10-3b1aad70649e",
          name: "Production"
        },
        {
          id: "944a15c3-e800-4457-8831-1fad9d463607",
          name: "Equipment"
        },
        {
          id: "340bbaaa-323d-42b9-a6ac-0bf48c88b50a",
          name: "Audio"
        }
      ],
      userId: "66cf4462474b676d4e3ce697", // Different user
      dateRange: {
        startDateTime: "2024-09-19T18:30:00Z",
        endDateTime: "2024-09-20T18:30:00Z",
        recurrenceRule: ""
      },
      locationRange: {
        range: 50,
        rangeUnit: "Miles"
      },
      address: {
        addressLine1: "456 Main St",
        addressLine2: "",
        city: "San Francisco",
        state: "California",
        zip: "94107",
        country: "USA",
        longitude: null,
        latitude: null,
        googlePlaceId: "ChIJIQBpAG2ahYAR_6128GcTUEo"
      },
      isLive: true,
      isActive: true,
      isFeatured: false,
      createdBy: null,
      createdDate: "0001-01-01T00:00:00Z",
      modifiedBy: null,
      modifiedDate: "0001-01-01T00:00:00Z",
      user: {
        id: "66cf4462474b676d4e3ce697",
        userId: "ABCkkrRcKsT2VrJnZ70sw5G9pfi3",
        firstName: "John",
        lastName: "Smith",
        fullName: "John Smith",
        email: "john.smith@example.com",
        phone: "+14155551234",
        gender: "Male",
        birthDate: "1985-06-15",
        address: {
          addressLine1: "456 Main St",
          addressLine2: "",
          city: "San Francisco",
          state: "California",
          zip: "94107",
          country: "USA",
          longitude: null,
          latitude: null,
          googlePlaceId: null
        },
        aboutMe: "Audio professional with 10+ years experience",
        companyId: null,
        roleId: 1,
        invitedBy: null,
        isActive: true,
        createdBy: "",
        createdDate: "2024-08-10T12:30:10.792Z",
        updatedDate: "2025-05-01T09:18:02.686Z",
        updatedBy: "System",
        profilePic: {
          entityType: null,
          entityId: null,
          id: "3f87ae9a-7d0f-4758-ade4-e5457c9cd586",
          fileName: "john.jpg",
          fileSize: 85069,
          fileKey: "ProfilePic/66cf4462474b676d4e3ce697/john.jpg",
          createdBy: "",
          createdDate: "2025-02-15T10:35:11.373Z",
          isActive: true
        },
        coverPic: null,
        lastSignInTimestamp: null,
        profileScore: 85,
        companyLegalName: null,
        companyBrandName: null,
        stripeDetails: {
          customerId: "cus_SEI4CI3vHviAfd",
          connectAccountId: "acct_1RMowGPGetFVE3yL",
          subscriptionId: null,
          hasActiveSubscription: false
        }
      },
      canSendBid: false
    },
    startDate: "2025-03-20T10:30:40.754Z",
    endDate: "2025-03-27T15:42:40.754Z",
    bidRate: {
      durationType: 1,
      rate: {
        currencyCode: "USD",
        value: 75
      },
      isMealIncluded: true
    },
    counterBidRate: {
      durationType: 1,
      rate: {
        currencyCode: "USD",
        value: 85
      },
      isMealIncluded: true
    },
    user: null,
    bidStatus: "Accepted",
    isActive: true,
    notes: "Looking forward to working together!",
    bidOrigin: "Manual",
    createdBy: "System",
    createdDate: "2025-03-15T14:22:40.754Z",
    modifiedBy: "System",
    modifiedDate: "2025-03-18T09:12:40.754Z",
    canAcceptBid: false,
    canCreateContract: true,
    revision: 2,
    matchConfidence: 92 // Added for compatibility
  },
  // Adding a third bid with different need template for testing
  {
    id: "67db3a50443b08a41fcc1150",
    bidIdentifier: "BID-5467AD238D",
    bidOfferStatus: "Initial",
    bidNeedStatus: "Initial",
    needTemplate: {
      id: "66ed5fe71f20eb9ca51f5e94", // Different need
      needIdentifier: "NID-B49B98BF7D",
      rates: [],
      templateName: "Lighting Services Needed",
      templateDescription: "<p>Need professional lighting for concert</p>\n",
      categorySelection: [
        {
          id: "294aed62-9e12-40ad-ba10-3b1aad70649e",
          name: "Production"
        },
        {
          id: "944a15c3-e800-4457-8831-1fad9d463608",
          name: "Lighting"
        }
      ],
      userId: "66e1221c6116cd3d11ef65a5", // Different user
      dateRange: {
        startDateTime: "2024-10-15T18:30:00Z",
        endDateTime: "2024-10-15T23:30:00Z",
        recurrenceRule: ""
      },
      locationRange: {
        range: 50,
        rangeUnit: "Miles"
      },
      address: {
        addressLine1: "789 Broadway",
        addressLine2: "",
        city: "New York",
        state: "NY",
        zip: "10003",
        country: "USA",
        longitude: null,
        latitude: null,
        googlePlaceId: "ChIJLWDIxcTX3okRSX8C8AxX3_c"
      },
      isLive: true,
      isActive: true,
      isFeatured: false,
      createdBy: null,
      createdDate: "0001-01-01T00:00:00Z",
      modifiedBy: null,
      modifiedDate: "0001-01-01T00:00:00Z",
      user: {
        id: "66e1221c6116cd3d11ef65a5",
        userId: "DEFFeKW9NZXufReBKtvczy16Sm3",
        firstName: "Sarah",
        lastName: "Johnson",
        fullName: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        phone: "+12125551234",
        gender: "Female",
        birthDate: "1990-03-25",
        address: {
          addressLine1: "789 Broadway",
          addressLine2: "Apt 5B",
          city: "New York",
          state: "NY",
          zip: "10003",
          country: "USA",
          longitude: null,
          latitude: null,
          googlePlaceId: null
        },
        aboutMe: "Event coordinator specializing in music concerts",
        companyId: null,
        roleId: 1,
        invitedBy: null,
        isActive: true,
        createdBy: "",
        createdDate: "2024-07-15T15:52:44.07Z",
        updatedDate: "2025-04-20T13:47:13.719Z",
        updatedBy: "System",
        profilePic: {
          entityType: null,
          entityId: null,
          id: "4f87ae9a-7d0f-4758-ade4-e5457c9cd587",
          fileName: "sarah.jpg",
          fileSize: 75069,
          fileKey: "ProfilePic/66e1221c6116cd3d11ef65a5/sarah.jpg",
          createdBy: "",
          createdDate: "2025-01-19T12:35:11.373Z",
          isActive: true
        },
        coverPic: null,
        lastSignInTimestamp: null,
        profileScore: 78,
        companyLegalName: null,
        companyBrandName: null,
        stripeDetails: {
          customerId: "cus_QqlrvnHHmfXpcb",
          connectAccountId: "acct_1RMrGdPKVaLkI3Jf",
          subscriptionId: null,
          hasActiveSubscription: false
        }
      },
      canSendBid: false
    },
    offerTemplate: {
      id: "66edbead7220d314e8e3104d", // Same as first bid
      offerIdentifier: "OID-28C59A796F",
      rates: [
        {
          durationType: 1,
          rate: {
            currencyCode: "USD",
            value: 66
          },
          isMealIncluded: false
        }
      ],
      templateName: "Backline templatefe two",
      templateDescription: "<p>Backline template</p>\n",
      categorySelection: [
        {
          id: "294aed62-9e12-40ad-ba10-3b1aad70649e",
          name: "Production"
        },
        {
          id: "944a15c3-e800-4457-8831-1fad9d463607",
          name: "Equipment"
        },
        {
          id: "340bbaaa-323d-42b9-a6ac-0bf48c88b50a",
          name: "Backline"
        }
      ],
      userId: "66cf4462474b676d4e3ce696",
      dateRange: {
        startDateTime: "2024-09-19T18:30:00Z",
        endDateTime: "2024-09-20T18:30:00Z",
        recurrenceRule: ""
      },
      locationRange: {
        range: 80,
        rangeUnit: "Miles"
      },
      address: {
        addressLine1: "apt building 123",
        addressLine2: "",
        city: "Telengana",
        state: "Telangana",
        zip: "500074",
        country: null,
        longitude: null,
        latitude: null,
        googlePlaceId: "ChIJgwlI-LqYyzsR630KAn9ts2w"
      },
      isLive: true,
      isActive: true,
      isFeatured: false,
      createdBy: null,
      createdDate: "0001-01-01T00:00:00Z",
      modifiedBy: null,
      modifiedDate: "0001-01-01T00:00:00Z",
      user: {
        id: "66cf4462474b676d4e3ce696",
        userId: "FHRkkrRcKsT2VrJnZ70sw5G9pfi2",
        firstName: "Sai Teja",
        lastName: "Kotagiri",
        fullName: "Sai Teja Kotagiri",
        email: "samjose@gmail.com",
        phone: "+19494992431",
        gender: "Male",
        birthDate: "1994-03-17",
        address: {
          addressLine1: "789 Park Avenue",
          addressLine2: "",
          city: "Huntington",
          state: "New York",
          zip: "11743",
          country: "United States",
          longitude: null,
          latitude: null,
          googlePlaceId: null
        },
        aboutMe: "Hello",
        companyId: null,
        roleId: 1,
        invitedBy: null,
        isActive: true,
        createdBy: "",
        createdDate: "2024-08-28T15:38:10.792Z",
        updatedDate: "2025-05-09T11:18:02.686Z",
        updatedBy: "System",
        profilePic: {
          entityType: null,
          entityId: null,
          id: "2f87ae9a-7d0f-4758-ade4-e5457c9cd585",
          fileName: "avatar.png",
          fileSize: 91069,
          fileKey: "ProfilePic/66cf4462474b676d4e3ce696/avatar.png",
          createdBy: "",
          createdDate: "2025-02-19T12:35:11.373Z",
          isActive: true
        },
        coverPic: {
          entityType: null,
          entityId: null,
          id: "93cab797-46f7-40fe-a3e7-782616147b22",
          fileName: "Abstract1.jpg",
          fileSize: 9437282,
          fileKey: "CoverPic/66cf4462474b676d4e3ce696/Abstract1.jpg",
          createdBy: "Sam Jose",
          createdDate: "2025-01-16T07:11:30.89Z",
          isActive: true
        },
        lastSignInTimestamp: null,
        profileScore: 65,
        companyLegalName: null,
        companyBrandName: null,
        stripeDetails: {
          customerId: "cus_SEI4CI3vHviAfw",
          connectAccountId: "acct_1RMowGPGetFVE3yK",
          subscriptionId: null,
          hasActiveSubscription: false
        }
      },
      canSendBid: false
    },
    startDate: "2025-04-19T21:42:40.754Z",
    endDate: "2025-04-26T21:42:40.754Z",
    bidRate: {
      durationType: 1,
      rate: {
        currencyCode: "USD",
        value: 90
      },
      isMealIncluded: true
    },
    counterBidRate: null,
    user: null,
    bidStatus: "Initial",
    isActive: true,
    notes: "We can provide full backline services for your event",
    bidOrigin: "Manual",
    createdBy: "System",
    createdDate: "2025-04-01T11:30:40.754Z",
    modifiedBy: "System",
    modifiedDate: "2025-04-01T11:30:40.754Z",
    canAcceptBid: true,
    canCreateContract: false,
    revision: 1,
    matchConfidence: 75 // Added for compatibility
  }
];
