
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  MapPin, 
  Building2, 
  FileText, 
  Image, 
  Camera, 
  Loader2,
  Globe,
  Music,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';
import { Listing, NeedListing, OfferListing, CategoryType } from '@/types/platform';

// Placeholder for when we implement actual data fetching
const dummyListings: Listing[] = [
  {
    id: '1',
    type: 'need',
    title: 'Need a Jazz Guitarist',
    description: 'Looking for an experienced jazz guitarist for a restaurant gig',
    category: 'musician',
    location: {
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    timeSlots: [
      {
        startDateTime: '2025-06-15T19:00:00Z',
        endDateTime: '2025-06-15T22:00:00Z',
        isFlexible: false,
      }
    ],
    rate: {
      min: 200,
      max: 300,
      currency: 'USD',
      unit: 'gig',
    },
    tags: ['jazz', 'guitarist', 'live music'],
    createdAt: '2025-05-01T10:00:00Z',
    updatedAt: '2025-05-01T10:00:00Z',
    createdBy: 'user123',
    userType: 'company',
    userName: 'Jazz Club NYC',
    status: 'active',
    contractOffered: true,
    contractDetails: {
      termsAccepted: true,
      cancelPolicy: 'Standard 48-hour notice required',
    }
  },
  {
    id: '2',
    type: 'offer',
    title: 'Professional Sound Engineer Available',
    description: 'Experienced sound engineer with 10+ years in live events and studio recording',
    category: 'sound_engineer',
    location: {
      address: '456 Broadway',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'USA',
    },
    timeSlots: [
      {
        startDateTime: '2025-05-20T09:00:00Z',
        endDateTime: '2025-05-20T17:00:00Z',
        isFlexible: true,
      }
    ],
    rate: {
      min: 50,
      max: 75,
      currency: 'USD',
      unit: 'hour',
    },
    tags: ['sound engineer', 'live events', 'studio recording'],
    createdAt: '2025-04-25T14:30:00Z',
    updatedAt: '2025-04-25T14:30:00Z',
    createdBy: 'user456',
    userType: 'individual',
    userName: 'Alex Thompson',
    status: 'active',
    portfolio: ['https://example.com/portfolio1.jpg', 'https://example.com/portfolio2.jpg'],
    experience: '10+ years working with major artists and venues',
    specialSkills: ['Live mixing', 'Studio recording', 'Acoustic optimization'],
  }
];

const Profile = () => {
  const { currentUser, userType, updateUserProfile } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [companyName, setCompanyName] = useState(currentUser?.companyName || '');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  
  useEffect(() => {
    // This would be replaced with actual data fetching
    setListings(dummyListings);
  }, []);
  
  const handleSaveProfile = async () => {
    setIsSaving(true);
    
    try {
      await updateUserProfile({
        displayName,
        bio,
        location: location,
        companyName: userType === 'company' ? companyName : undefined,
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const getCategoryLabel = (category: CategoryType): string => {
    const labels: Record<CategoryType, string> = {
      musician: 'Musician',
      vocalist: 'Vocalist',
      dj: 'DJ',
      sound_engineer: 'Sound Engineer',
      lighting_technician: 'Lighting Technician',
      dancer: 'Dancer',
      performer: 'Performer',
      equipment: 'Equipment',
      venue: 'Venue',
      other: 'Other'
    };
    
    return labels[category] || category;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-violet-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-48 rounded-xl bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"></div>
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-white p-1 shadow-lg">
                  {currentUser?.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || ''} 
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-purple-100">
                      <User className="h-16 w-16 text-purple-500" />
                    </div>
                  )}
                </div>
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-purple-600 hover:bg-purple-800"
                  disabled={true} // Would be enabled when we implement photo upload
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="ml-44 flex items-center justify-between p-4">
              <div>
                <h1 className="text-2xl font-bold">{currentUser?.displayName}</h1>
                <p className="text-gray-600">{userType === 'company' ? 'Company Account' : 'Individual Artist'}</p>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-16">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile Info</TabsTrigger>
                <TabsTrigger value="needs">My Needs</TabsTrigger>
                <TabsTrigger value="offers">My Offers</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your personal profile details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        {isEditing ? (
                          <Input 
                            id="name" 
                            value={displayName} 
                            onChange={(e) => setDisplayName(e.target.value)} 
                          />
                        ) : (
                          <div className="flex items-center space-x-2 border rounded-md p-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{currentUser?.displayName || 'Not specified'}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="flex items-center space-x-2 border rounded-md p-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{currentUser?.email || 'Not specified'}</span>
                        </div>
                      </div>
                      
                      {/* Company Name (if applicable) */}
                      {userType === 'company' && (
                        <div className="space-y-2">
                          <Label htmlFor="companyName">Company Name</Label>
                          {isEditing ? (
                            <Input 
                              id="companyName" 
                              value={companyName} 
                              onChange={(e) => setCompanyName(e.target.value)} 
                            />
                          ) : (
                            <div className="flex items-center space-x-2 border rounded-md p-2">
                              <Building2 className="h-4 w-4 text-gray-500" />
                              <span>{currentUser?.companyName || 'Not specified'}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Location */}
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        {isEditing ? (
                          <Input 
                            id="location" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)} 
                            placeholder="e.g., New York, NY"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 border rounded-md p-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{currentUser?.location || 'Not specified'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Bio */}
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      {isEditing ? (
                        <Textarea 
                          id="bio" 
                          value={bio} 
                          onChange={(e) => setBio(e.target.value)} 
                          placeholder="Tell others about yourself or your company..."
                          rows={4}
                        />
                      ) : (
                        <div className="border rounded-md p-3">
                          <p className="text-gray-700">{currentUser?.bio || 'No bio provided yet.'}</p>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    {/* Social Links */}
                    <div className="space-y-4">
                      <Label>Social Links</Label>
                      
                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="website" className="text-xs">Website</Label>
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4 text-gray-500" />
                              <Input 
                                id="website" 
                                value={website} 
                                onChange={(e) => setWebsite(e.target.value)} 
                                placeholder="https://yourdomain.com" 
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="instagram" className="text-xs">Instagram</Label>
                            <div className="flex items-center space-x-2">
                              <Instagram className="h-4 w-4 text-gray-500" />
                              <Input 
                                id="instagram" 
                                value={instagram} 
                                onChange={(e) => setInstagram(e.target.value)} 
                                placeholder="@username" 
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="facebook" className="text-xs">Facebook</Label>
                            <div className="flex items-center space-x-2">
                              <Facebook className="h-4 w-4 text-gray-500" />
                              <Input 
                                id="facebook" 
                                value={facebook} 
                                onChange={(e) => setFacebook(e.target.value)} 
                                placeholder="facebook.com/username" 
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {/* This would be populated with actual data in a real implementation */}
                          <Button variant="outline" size="sm" className="flex items-center gap-1" disabled>
                            <Globe className="h-4 w-4" />
                            Website
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-1" disabled>
                            <Instagram className="h-4 w-4" />
                            Instagram
                          </Button>
                          <Button variant="outline" size="sm" className="flex items-center gap-1" disabled>
                            <Facebook className="h-4 w-4" />
                            Facebook
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="needs">
                <Card>
                  <CardHeader>
                    <CardTitle>My Needs</CardTitle>
                    <CardDescription>Services and positions you're looking to fill</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {listings.filter(listing => listing.type === 'need').length > 0 ? (
                        listings
                          .filter(listing => listing.type === 'need')
                          .map(listing => (
                            <div key={listing.id} className="border rounded-lg p-4 hover:bg-gray-50">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium">{listing.title}</h3>
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>{listing.location.city}, {listing.location.state}</span>
                                  </div>
                                </div>
                                <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                                  ${listing.status === 'active' ? 'bg-green-100 text-green-700' : 
                                    listing.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                    'bg-gray-100 text-gray-700'}`}>
                                  {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                <div className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                  {getCategoryLabel(listing.category)}
                                </div>
                                <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                  {listing.rate.min}-{listing.rate.max} {listing.rate.currency}/{listing.rate.unit}
                                </div>
                              </div>
                              <div className="mt-3 text-sm">{listing.description.substring(0, 100)}...</div>
                              <div className="flex justify-end mt-2">
                                <Button variant="outline" size="sm">View Details</Button>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-10">
                          <FileText className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-lg font-medium text-gray-600">No Needs Created Yet</p>
                          <p className="text-gray-500 mt-1">Create a need to find the perfect match for your project</p>
                          <Button className="mt-4 bg-purple-600 hover:bg-purple-800">
                            Create New Need
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="offers">
                <Card>
                  <CardHeader>
                    <CardTitle>My Offers</CardTitle>
                    <CardDescription>Services you're offering to the community</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {listings.filter(listing => listing.type === 'offer').length > 0 ? (
                        listings
                          .filter(listing => listing.type === 'offer')
                          .map(listing => (
                            <div key={listing.id} className="border rounded-lg p-4 hover:bg-gray-50">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium">{listing.title}</h3>
                                  <div className="flex items-center text-sm text-gray-600 mt-1">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>{listing.location.city}, {listing.location.state}</span>
                                  </div>
                                </div>
                                <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium 
                                  ${listing.status === 'active' ? 'bg-green-100 text-green-700' : 
                                    listing.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                                    'bg-gray-100 text-gray-700'}`}>
                                  {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                <div className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                  {getCategoryLabel(listing.category)}
                                </div>
                                <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                  {listing.rate.min}-{listing.rate.max} {listing.rate.currency}/{listing.rate.unit}
                                </div>
                              </div>
                              <div className="mt-3 text-sm">{listing.description.substring(0, 100)}...</div>
                              {(listing as OfferListing).portfolio && (listing as OfferListing).portfolio!.length > 0 && (
                                <div className="flex gap-2 mt-3">
                                  {(listing as OfferListing).portfolio!.slice(0, 3).map((item, i) => (
                                    <div key={i} className="h-12 w-12 bg-gray-200 rounded-md overflow-hidden">
                                      <Image className="h-full w-full text-gray-400 p-2" />
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="flex justify-end mt-2">
                                <Button variant="outline" size="sm">View Details</Button>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-10">
                          <Music className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                          <p className="text-lg font-medium text-gray-600">No Offers Created Yet</p>
                          <p className="text-gray-500 mt-1">Create an offer to showcase your services</p>
                          <Button className="mt-4 bg-purple-600 hover:bg-purple-800">
                            Create New Offer
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
