
import React from 'react';
import { Listing, NeedListing, OfferListing, CategoryType } from '@/types/platform';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Calendar,
  Tag,
  DollarSign,
  Star,
  Clock,
  Music,
  Mic,
  Headphones,
  Speaker,
  Users,
  Building,
  Globe
} from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const getCategoryIcon = (category: CategoryType): React.ReactNode => {
    const icons: Record<CategoryType, React.ReactNode> = {
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
    
    return icons[category] || icons.other;
  };
  
  const getCategoryLabel = (category: CategoryType): string => {
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const formatTimeSlot = (timeSlot: { startDateTime: string; endDateTime: string }) => {
    const start = new Date(timeSlot.startDateTime);
    const end = new Date(timeSlot.endDateTime);
    
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };
    
    return `${formatDate(timeSlot.startDateTime)} • ${formatTime(start)} - ${formatTime(end)}`;
  };

  return (
    <>
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="absolute top-2 right-2 px-2 py-1 bg-white rounded-full text-xs font-medium">
          {listing.type === 'need' ? 'NEED' : 'OFFER'}
        </div>
      </div>
      <CardContent className="pt-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{listing.title}</h3>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{listing.location.city}, {listing.location.state}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="flex items-center px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
            {getCategoryIcon(listing.category)}
            <span className="ml-1">{getCategoryLabel(listing.category)}</span>
          </div>
          
          <div className="flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <DollarSign className="h-3 w-3 mr-0.5" />
            {listing.rate.min}-{listing.rate.max} {listing.rate.currency}/{listing.rate.unit}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">
            {listing.timeSlots[0] ? formatTimeSlot(listing.timeSlots[0]) : 'Flexible timing'}
          </span>
        </div>
        
        <p className="text-gray-700 text-sm line-clamp-3 mb-2">{listing.description}</p>
        
        {listing.type === 'offer' && (listing as OfferListing).specialSkills && (
          <div className="mt-2 flex flex-wrap gap-1">
            {(listing as OfferListing).specialSkills?.slice(0, 3).map((skill, index) => (
              <div key={index} className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-700 text-xs">
                {skill}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-3 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>Posted {new Date(listing.createdAt).toLocaleDateString()}</span>
        </div>
        <Button variant="ghost" size="sm">
          View Details
        </Button>
      </CardFooter>
    </>
  );
};

export default ListingCard;
