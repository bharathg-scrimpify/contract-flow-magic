
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Music, 
  Mic, 
  Users, 
  MapPin, 
  Calendar, 
  PlusCircle, 
  Search,
  Building,
  MessageSquare,
  FileText,
  Star
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// This is a placeholder component until we implement the actual data fetching
const Dashboard = () => {
  const { currentUser, userType } = useAuth();
  const navigate = useNavigate();
  
  const [activeNeeds, setActiveNeeds] = useState(0);
  const [activeOffers, setActiveOffers] = useState(0);
  const [activeBids, setActiveBids] = useState(0);
  const [contracts, setContracts] = useState(0);
  
  useEffect(() => {
    // This would be replaced with actual data fetching from Firebase
    // For now, we'll use placeholder data
    setActiveNeeds(3);
    setActiveOffers(2);
    setActiveBids(5);
    setContracts(1);
  }, []);
  
  const handleCreateNeed = () => {
    navigate('/needs/create');
  };
  
  const handleCreateOffer = () => {
    navigate('/offers/create');
  };
  
  const handleBrowseNeeds = () => {
    navigate('/browse/needs');
  };
  
  const handleBrowseOffers = () => {
    navigate('/browse/offers');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-violet-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header and Welcome */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-purple-800">Welcome, {currentUser?.displayName}</h1>
              <p className="text-gray-600">
                {userType === 'company' ? 'Company Dashboard' : 'Artist Dashboard'} | {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => navigate('/profile')}
              >
                View Profile
              </Button>
              <Button 
                className="bg-purple-600 hover:bg-purple-800 flex items-center gap-2"
                onClick={userType === 'company' ? handleCreateNeed : handleCreateOffer}
              >
                <PlusCircle size={16} />
                {userType === 'company' ? 'Create Need' : 'Create Offer'}
              </Button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
                  <Search size={18} /> Active Needs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-800">{activeNeeds}</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" onClick={handleBrowseNeeds} className="text-blue-700">
                  View All Needs
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-purple-700 flex items-center gap-2">
                  <Mic size={18} /> Active Offers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-purple-800">{activeOffers}</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" onClick={handleBrowseOffers} className="text-purple-700">
                  View All Offers
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-amber-700 flex items-center gap-2">
                  <MessageSquare size={18} /> Active Bids
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-amber-800">{activeBids}</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" onClick={() => navigate('/bids')} className="text-amber-700">
                  View All Bids
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                  <FileText size={18} /> Contracts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-800">{contracts}</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" onClick={() => navigate('/contracts')} className="text-green-700">
                  View All Contracts
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Recent Activity and Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="text-xl text-purple-800">Recent Activity</CardTitle>
                <CardDescription>Your latest interactions and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Placeholder for recent activity items */}
                <div className="p-4 border rounded-lg flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">New bid received on your DJ offer</p>
                    <p className="text-sm text-gray-600">From Skyline Productions • 2 hours ago</p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">Contract created for sound engineering services</p>
                    <p className="text-sm text-gray-600">With Beat Factory Studios • 1 day ago</p>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Star className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">You received a 5-star review</p>
                    <p className="text-sm text-gray-600">From City Concert Hall • 2 days ago</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Activity</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-purple-800">Quick Actions</CardTitle>
                <CardDescription>Common tasks to get you started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={handleCreateNeed}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create a New Need
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={handleCreateOffer}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create a New Offer
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={() => navigate('/browse')}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Browse Marketplace
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left"
                  onClick={() => navigate('/messages')}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Check Messages
                </Button>
              </CardContent>
            </Card>
          </div>
          
          {/* Upcoming Events/Calendar Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-purple-800">Upcoming Events</CardTitle>
              <CardDescription>Your scheduled gigs and appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="bg-purple-100 text-purple-700 rounded-lg h-14 w-14 flex flex-col items-center justify-center mr-4">
                    <span className="text-sm font-bold">MAY</span>
                    <span className="text-lg font-bold">15</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Summer Music Festival</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Central Park Amphitheater</span>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Confirmed
                  </div>
                </div>
                
                <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="bg-purple-100 text-purple-700 rounded-lg h-14 w-14 flex flex-col items-center justify-center mr-4">
                    <span className="text-sm font-bold">MAY</span>
                    <span className="text-lg font-bold">22</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">Jazz Night</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Blue Note Club</span>
                    </div>
                  </div>
                  <div className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Pending
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/calendar')}>
                <Calendar className="mr-2 h-4 w-4" />
                View Full Calendar
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
