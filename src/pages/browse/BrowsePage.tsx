
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Listing, NeedListing, OfferListing, CategoryType } from '@/types/platform';
import {
  Search,
  MapPin,
  Calendar,
  Filter,
  Music,
  Mic,
  PlusCircle,
  Headphones,
  Speaker,
  Users,
  Building,
  Globe
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ListingCard from '@/components/listings/ListingCard';
import ListingMap from '@/components/listings/ListingMap';

const BrowsePage = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type: string }>();
  const [activeTab, setActiveTab] = useState<'needs' | 'offers'>(type === 'offers' ? 'offers' : 'needs');
  const [view, setView] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dummy data for listings
  const [listings, setListings] = useState<Listing[]>([
    {
      id: '1',
      type: 'need',
      title: 'Looking for a Jazz Saxophonist',
      description: 'Need an experienced saxophonist for a corporate event. Must have at least 5 years of professional experience.',
      category: 'musician',
      location: {
        address: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        latitude: 40.7128,
        longitude: -74.006
      },
      timeSlots: [
        {
          startDateTime: '2025-06-15T18:00:00Z',
          endDateTime: '2025-06-15T22:00:00Z',
          isFlexible: false
        }
      ],
      rate: {
        min: 300,
        max: 500,
        currency: 'USD',
        unit: 'event'
      },
      tags: ['jazz', 'saxophone', 'corporate'],
      createdAt: '2025-05-01T10:00:00Z',
      updatedAt: '2025-05-01T10:00:00Z',
      createdBy: 'user123',
      userType: 'company',
      userName: 'ABC Corporation',
      status: 'active',
      contractOffered: true,
      contractDetails: {
        termsAccepted: true,
        cancelPolicy: 'Standard 48-hour notice required'
      }
    },
    {
      id: '2',
      type: 'need',
      title: 'Sound Engineer for Concert Series',
      description: 'Looking for a sound engineer for our summer concert series. Experience with outdoor events preferred.',
      category: 'sound_engineer',
      location: {
        address: '456 Park Ave',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
        latitude: 41.8781,
        longitude: -87.6298
      },
      timeSlots: [
        {
          startDateTime: '2025-07-10T16:00:00Z',
          endDateTime: '2025-07-10T23:00:00Z',
          isFlexible: true
        },
        {
          startDateTime: '2025-07-17T16:00:00Z',
          endDateTime: '2025-07-17T23:00:00Z',
          isFlexible: true
        }
      ],
      rate: {
        min: 200,
        max: 300,
        currency: 'USD',
        unit: 'day'
      },
      tags: ['sound engineer', 'concert', 'summer'],
      createdAt: '2025-05-03T14:30:00Z',
      updatedAt: '2025-05-03T14:30:00Z',
      createdBy: 'user456',
      userType: 'company',
      userName: 'City Parks Department',
      status: 'active',
      contractOffered: true,
      contractDetails: {
        termsAccepted: true,
        cancelPolicy: 'One week notice required'
      }
    },
    {
      id: '3',
      type: 'offer',
      title: 'Professional Guitarist Available',
      description: 'Experienced guitarist with 10+ years in rock, jazz, and blues. Available for studio sessions and live performances.',
      category: 'musician',
      location: {
        address: '789 Broadway',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA',
        latitude: 34.0522,
        longitude: -118.2437
      },
      timeSlots: [
        {
          startDateTime: '2025-05-01T00:00:00Z',
          endDateTime: '2025-08-31T23:59:59Z',
          isFlexible: true
        }
      ],
      rate: {
        min: 150,
        max: 300,
        currency: 'USD',
        unit: 'day'
      },
      tags: ['guitarist', 'rock', 'jazz', 'blues'],
      createdAt: '2025-04-28T09:15:00Z',
      updatedAt: '2025-04-28T09:15:00Z',
      createdBy: 'user789',
      userType: 'individual',
      userName: 'Michael Johnson',
      status: 'active',
      portfolio: ['https://example.com/portfolio1.jpg', 'https://example.com/portfolio2.jpg'],
      experience: '10+ years playing with various bands and recording studios',
      specialSkills: ['Improvisation', 'Sight reading', 'Music composition']
    },
    {
      id: '4',
      type: 'offer',
      title: 'Lighting Technician for Events',
      description: 'Professional lighting technician with experience in concerts, theater, and corporate events.',
      category: 'lighting_technician',
      location: {
        address: '123 Oak St',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        country: 'USA',
        latitude: 30.2672,
        longitude: -97.7431
      },
      timeSlots: [
        {
          startDateTime: '2025-06-01T00:00:00Z',
          endDateTime: '2025-09-30T23:59:59Z',
          isFlexible: true
        }
      ],
      rate: {
        min: 200,
        max: 400,
        currency: 'USD',
        unit: 'day'
      },
      tags: ['lighting', 'technician', 'events'],
      createdAt: '2025-05-02T11:45:00Z',
      updatedAt: '2025-05-02T11:45:00Z',
      createdBy: 'user101',
      userType: 'individual',
      userName: 'Sarah Williams',
      status: 'active',
      portfolio: ['https://example.com/lighting1.jpg', 'https://example.com/lighting2.jpg'],
      experience: '7 years working on lighting for various events',
      specialSkills: ['DMX programming', 'Light design', 'Environmental lighting']
    }
  ]);
  
  const filteredListings = listings.filter(listing => 
    (activeTab === 'needs' ? listing.type === 'need' : listing.type === 'offer') &&
    (searchTerm === '' ||
     listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     listing.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as 'needs' | 'offers');
    navigate(`/browse/${value}`);
  };
  
  const handleViewListing = (id: string) => {
    const listing = listings.find(item => item.id === id);
    if (listing) {
      navigate(`/${listing.type === 'need' ? 'needs' : 'offers'}/${id}`);
    }
  };
  
  const categoryIcons: Record<CategoryType, React.ReactNode> = {
    musician: <Music className="h-4 w-4" />,
    vocalist: <Mic className="h-4 w-4" />,
    dj: <Headphones className="h-4 w-4" />,
    sound_engineer: <Speaker className="h-4 w-4" />,
    lighting_technician: <Speaker className="h-4 w-4" />,
    dancer: <Users className="h-4 w-4" />,
    performer: <Users className="h-4 w-4" />,
    equipment: <Speaker className="h-4 w-4" />,
    venue: <Building className="h-4 w-4" />,
    other: <Globe className="h-4 w-4" />
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-purple-800">Browse Marketplace</h1>
              <p className="text-gray-600">Find needs and offers that match your interests</p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className={`flex gap-2 ${view === 'list' ? 'bg-purple-100 text-purple-800' : ''}`}
                onClick={() => setView('list')}
              >
                <Filter className="h-4 w-4" />
                List View
              </Button>
              <Button 
                variant="outline" 
                className={`flex gap-2 ${view === 'map' ? 'bg-purple-100 text-purple-800' : ''}`}
                onClick={() => setView('map')}
              >
                <MapPin className="h-4 w-4" />
                Map View
              </Button>
              <Button 
                onClick={() => navigate(activeTab === 'needs' ? '/needs/create' : '/offers/create')}
                className="bg-purple-600 hover:bg-purple-800"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create {activeTab === 'needs' ? 'Need' : 'Offer'}
              </Button>
            </div>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by keywords, skills, or location..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs 
              defaultValue={activeTab} 
              onValueChange={handleTabChange}
              className="w-full md:w-auto"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="needs">Needs</TabsTrigger>
                <TabsTrigger value="offers">Offers</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {(["musician", "vocalist", "dj", "sound_engineer", "lighting_technician", "dancer", "performer", "equipment", "venue"] as CategoryType[]).map((category) => (
              <Button 
                key={category} 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1.5"
              >
                {categoryIcons[category]}
                {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Button>
            ))}
          </div>
          
          {/* Content */}
          <div>
            {view === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.length > 0 ? (
                  filteredListings.map((listing) => (
                    <Card 
                      key={listing.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleViewListing(listing.id)}
                    >
                      <ListingCard listing={listing} />
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full py-10 text-center">
                    <Search className="mx-auto h-12 w-12 text-gray-300" />
                    <h3 className="mt-4 text-lg font-medium text-gray-700">No {activeTab} found</h3>
                    <p className="mt-2 text-gray-500">Try adjusting your search or filters</p>
                    <Button 
                      className="mt-4 bg-purple-600 hover:bg-purple-800"
                      onClick={() => navigate(activeTab === 'needs' ? '/needs/create' : '/offers/create')}
                    >
                      Create a New {activeTab === 'needs' ? 'Need' : 'Offer'}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[600px] rounded-lg overflow-hidden border shadow-sm">
                <ListingMap listings={filteredListings} onMarkerClick={handleViewListing} />
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BrowsePage;
