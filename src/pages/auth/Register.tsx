
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import { Music, User, Building2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [userType, setUserType] = useState<'individual' | 'company'>('individual');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !name || (userType === 'company' && !companyName)) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 8) {
      toast({
        title: "Error",
        description: "Password should be at least 8 characters",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(email, password, name, userType, userType === 'company' ? companyName : undefined);
      toast({
        title: "Account created",
        description: "Your account has been successfully created",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Failed to create account",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-violet-100 p-4">
      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-3xl font-bold text-purple-600">
            <Music className="h-10 w-10" />
            <span>ArtConnect</span>
          </div>
        </div>
        
        <Card className="border-purple-100 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-purple-800">Create Account</CardTitle>
            <CardDescription>
              Join the network and connect with artists, venues, and industry professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Tabs defaultValue="individual" className="w-full" onValueChange={(value) => setUserType(value as 'individual' | 'company')}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="individual" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Individual
                  </TabsTrigger>
                  <TabsTrigger value="company" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Company
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="individual">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="company">
                  <div className="space-y-2">
                    <Label htmlFor="name">Contact Person</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Acme Productions"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required={userType === 'company'}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-800"
                disabled={isLoading}
              >
                {isLoading ? (
                  <><span className="animate-spin mr-2">⊚</span>Creating Account...</>
                ) : (
                  <>Create Account</>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4 pb-6 border-t border-purple-100">
            <div className="text-sm text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-purple-600 hover:text-purple-800">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
