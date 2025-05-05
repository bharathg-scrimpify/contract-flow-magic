
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  User,
  Building2,
  Phone,
  Mail,
  FileText,
  MessageSquare,
  ArrowLeft,
  CheckCircle,
  Star,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Listing, NeedListing, OfferListing } from '@/types/platform';
import { toast } from '@/hooks/use-toast';

const ListingDetailPage = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidSubmitting, setBidSubmitting] = useState(false);
  
  useEffect(() => {
    // This would be replaced with actual data fetching from Firebase
    setTimeout(() => {
      const dummyListing = type === 'needs' ? 
        {
          id: '1',
          type: 'need',
          title: 'Looking for a Jazz Saxophonist',
          description: 'Need an experienced saxophonist for a corporate event. Must have at least 5 years of professional experience and be able to perform with a small ensemble. The event is a company anniversary celebration and will feature a cocktail hour followed by dinner. The saxophonist will be required to play smooth jazz during the cocktail hour and dinner. Please have a repertoire of popular jazz standards.',
          category: 'musician',
          subCategory: 'Saxophonist',
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
          },
          requirements: [
            '5+ years of professional experience',
            'Must have own equipment',
            'Must be punctual and professional',
            'Jazz standards repertoire required'
          ]
        } as NeedListing : 
        {
          id: '3',
          type: 'offer',
          title: 'Professional Guitarist Available',
          description: 'Experienced guitarist with 10+ years in rock, jazz, and blues. Available for studio sessions and live performances. I specialize in creating unique sounds and am comfortable with improvisation. I have performed with several bands and have extensive recording studio experience. I am also a composer and can help with original music creation for your projects.',
          category: 'musician',
          subCategory: 'Guitarist',
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
          specialSkills: ['Improvisation', 'Sight reading', 'Music composition', 'Guitar effects', 'Fingerstyle technique']
        } as OfferListing;
      
      setListing(dummyListing);
      setLoading(false);
    }, 1000);
  }, [type, id]);
  
  const handleCreateContract = () => {
    // In a real implementation, this would create a contract and navigate to it
    toast({
      title: "Creating Contract",
      description: "Redirecting you to the contract creation page...",
    });
    
    setTimeout(() => {
      navigate(`/contracts/create?${type === 'needs' ? 'offerId' : 'needId'}=${id}`);
    }, 1500);
  };
  
  const handleSubmitBid = () => {
    // In a real implementation, this would submit a bid
    setBidSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Bid Submitted",
        description: "Your bid has been successfully submitted.",
      });
      setBidSubmitting(false);
    }, 1500);
  };
  
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
    
    return `${formattedDate} at ${formattedTime}`;
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-10">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <p className="text-gray-600">Loading listing details...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!listing) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-10">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Listing Not Found</h2>
              <p className="text-gray-600 mt-2">The listing you're looking for doesn't exist or has been removed.</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/browse')}
              >
                Return to Browse
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  const isOwner = listing.createdBy === currentUser?.uid;
  const canCreateContract = listing.type === 'offer' && !isOwner;
  const canSubmitBid = !isOwner;
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          {/* Back Button */}
          <div>
            <Button 
              variant="ghost" 
              className="flex items-center gap-1 -ml-3"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to listings
            </Button>
          </div>
          
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                    {listing.type === 'need' ? 'NEED' : 'OFFER'}
                  </Badge>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                    {listing.status.toUpperCase()}
                  </Badge>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{listing.location.city}, {listing.location.state}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {new Date(listing.timeSlots[0]?.startDateTime).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Posted {new Date(listing.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-sm text-purple-600 mb-1">Budget / Rate</div>
                  <div className="text-2xl font-bold text-purple-800">
                    {listing.rate.min !== listing.rate.max ? 
                      `${listing.rate.min}-${listing.rate.max}` : 
                      `${listing.rate.min}`} {listing.rate.currency}
                  </div>
                  <div className="text-xs text-purple-600">per {listing.rate.unit}</div>
                </div>
                
                {canCreateContract && (
                  <Button 
                    onClick={handleCreateContract}
                    className="bg-purple-600 hover:bg-purple-800"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Create Contract
                  </Button>
                )}
                
                {canSubmitBid && (
                  <Button 
                    onClick={handleSubmitBid}
                    disabled={bidSubmitting}
                  >
                    {bidSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Submit Bid
                      </>
                    )}
                  </Button>
                )}
                
                {isOwner && (
                  <Button variant="outline">
                    Edit Listing
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-gray-700">{listing.description}</p>
                  
                  {listing.tags && listing.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {listing.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date and Time */}
                  <div>
                    <h3 className="font-semibold mb-2">Date and Time</h3>
                    {listing.timeSlots.map((slot, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md mb-2">
                        <div className="flex items-center text-gray-800">
                          <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                          <span>{formatDateTime(slot.startDateTime)}</span>
                        </div>
                        <div className="flex items-center text-gray-800 mt-1">
                          <Clock className="h-4 w-4 mr-2 text-purple-600" />
                          <span>to {formatDateTime(slot.endDateTime)}</span>
                        </div>
                        {slot.isFlexible && (
                          <Badge className="mt-2" variant="outline">
                            Flexible timing
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Requirements (for needs) */}
                  {listing.type === 'need' && (listing as NeedListing).requirements && (
                    <div>
                      <h3 className="font-semibold mb-2">Requirements</h3>
                      <ul className="list-disc ml-5 space-y-1">
                        {(listing as NeedListing).requirements!.map((req, index) => (
                          <li key={index} className="text-gray-700">{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Special Skills (for offers) */}
                  {listing.type === 'offer' && (listing as OfferListing).specialSkills && (
                    <div>
                      <h3 className="font-semibold mb-2">Special Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {(listing as OfferListing).specialSkills!.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Experience (for offers) */}
                  {listing.type === 'offer' && (listing as OfferListing).experience && (
                    <div>
                      <h3 className="font-semibold mb-2">Experience</h3>
                      <p className="text-gray-700">{(listing as OfferListing).experience}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Portfolio (for offers) */}
              {listing.type === 'offer' && (listing as OfferListing).portfolio && (listing as OfferListing).portfolio!.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {/* In a real implementation, these would be actual images */}
                      {Array(4).fill(0).map((_, index) => (
                        <div 
                          key={index} 
                          className="aspect-square bg-gray-100 rounded-md flex items-center justify-center"
                        >
                          <div className="text-gray-400">Portfolio Item</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {listing.userType === 'company' ? 'Company' : 'Provider'} Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      {listing.userType === 'company' ? (
                        <Building2 className="h-6 w-6 text-purple-600" />
                      ) : (
                        <User className="h-6 w-6 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{listing.userName}</div>
                      <div className="text-sm text-gray-500">
                        {listing.userType === 'company' ? 'Company' : 'Individual'}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="font-medium">4.8</span>
                    <span className="text-gray-500">(24 reviews)</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{listing.location.city}, {listing.location.state}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                    <span>Verified User</span>
                  </div>
                  
                  <Separator />
                  
                  <Button className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* This would be a real map in the actual implementation */}
                  <div className="h-48 bg-gray-100 rounded-md flex items-center justify-center mb-3">
                    <MapPin className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="text-gray-700 text-sm">
                    {listing.location.city}, {listing.location.state}, {listing.location.zipCode}
                  </div>
                </CardContent>
              </Card>
              
              {listing.type === 'need' && (listing as NeedListing).contractOffered && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-green-700 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Contract Available
                    </CardTitle>
                    <CardDescription>
                      This need comes with a contract opportunity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {(listing as NeedListing).contractDetails?.cancelPolicy && (
                      <div className="text-sm text-gray-700 mb-3">
                        <span className="font-medium">Cancellation Policy:</span>{' '}
                        {(listing as NeedListing).contractDetails?.cancelPolicy}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={handleSubmitBid}
                      disabled={bidSubmitting}
                    >
                      {bidSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Submit Bid
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ListingDetailPage;
