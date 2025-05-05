
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Music, Mail } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setIsEmailSent(true);
      toast({
        title: "Email sent",
        description: "Check your inbox for password reset instructions",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-violet-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 text-3xl font-bold text-purple-600">
            <Music className="h-10 w-10" />
            <span>ArtConnect</span>
          </div>
        </div>
        
        <Card className="border-purple-100 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-purple-800">Forgot Password</CardTitle>
            <CardDescription>
              {!isEmailSent ? "Enter your email to receive a password reset link" : "Check your email for reset instructions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isEmailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-800"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><span className="animate-spin mr-2">⊚</span>Sending...</>
                  ) : (
                    <>Send Reset Link<Mail className="ml-2 h-4 w-4" /></>
                  )}
                </Button>
              </form>
            ) : (
              <div className="p-6 text-center">
                <Mail className="mx-auto h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-lg font-medium">Email Sent Successfully</h3>
                <p className="mt-2 text-gray-600">
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Check your inbox and follow the instructions to reset your password.
                </p>
                <Button 
                  className="mt-6 bg-purple-600 hover:bg-purple-800"
                  onClick={() => setIsEmailSent(false)}
                >
                  Send to another email
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-purple-100 pt-4">
            <div className="text-sm text-center text-gray-600">
              Remembered your password?{' '}
              <Link to="/login" className="font-medium text-purple-600 hover:text-purple-800">
                Return to login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
