
import React, { useRef, useEffect, useState } from 'react';
import { Listing } from '@/types/platform';

interface ListingMapProps {
  listings: Listing[];
  onMarkerClick: (id: string) => void;
}

const ListingMap = ({ listings, onMarkerClick }: ListingMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  
  useEffect(() => {
    // This is where you would initialize your map
    // For now we'll just show a placeholder
    if (mapRef.current) {
      setTimeout(() => {
        setIsMapReady(true);
      }, 500);
    }
  }, []);
  
  return (
    <div ref={mapRef} className="w-full h-full bg-gray-100 relative flex items-center justify-center">
      {!isMapReady ? (
        <div className="text-gray-500">Loading map...</div>
      ) : (
        <div className="absolute inset-0">
          {/* This is where the actual map would render */}
          <div className="h-full w-full bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
            {/* Placeholder for map markers */}
            <div className="absolute top-4 left-4 right-4 bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Map Integration</h3>
              <p className="text-gray-600 mb-4">
                In a real implementation, this would show an interactive map with markers for each listing.
                For full implementation, you need to integrate with a mapping service like Google Maps or Mapbox.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {listings.map(listing => (
                  <div 
                    key={listing.id} 
                    className="p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                    onClick={() => onMarkerClick(listing.id)}
                  >
                    <div className="font-medium text-sm">{listing.title}</div>
                    <div className="text-xs text-gray-500">{listing.location.city}, {listing.location.state}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingMap;
