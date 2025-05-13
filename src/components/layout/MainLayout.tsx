
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Music,
  Home,
  Search,
  FileText,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  CalendarCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Music className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold text-purple-800">ArtConnect</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/dashboard">
              <Button 
                variant={isActive('/dashboard') ? "default" : "ghost"} 
                className={isActive('/dashboard') ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : ""}
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/browse">
              <Button 
                variant={isActive('/browse') ? "default" : "ghost"}
                className={isActive('/browse') ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : ""}
              >
                <Search className="mr-2 h-4 w-4" />
                Browse
              </Button>
            </Link>
            <Link to="/contracts">
              <Button 
                variant={isActive('/contracts') ? "default" : "ghost"}
                className={isActive('/contracts') ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : ""}
              >
                <FileText className="mr-2 h-4 w-4" />
                Contracts
              </Button>
            </Link>
            <Link to="/attendance">
              <Button 
                variant={isActive('/attendance') ? "default" : "ghost"}
                className={isActive('/attendance') ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : ""}
              >
                <CalendarCheck className="mr-2 h-4 w-4" />
                Attendance
              </Button>
            </Link>
            <Link to="/messages">
              <Button 
                variant={isActive('/messages') ? "default" : "ghost"}
                className={isActive('/messages') ? "bg-purple-100 text-purple-800 hover:bg-purple-200" : ""}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </Button>
            </Link>
          </nav>
          
          {/* User Menu */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="relative h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    {currentUser?.photoURL ? (
                      <img 
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || ''}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                  <span className="hidden md:inline font-medium">
                    {currentUser?.displayName?.split(' ')[0] || 'Account'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-16">
          <nav className="flex flex-col p-4">
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                variant="ghost" 
                className="w-full justify-start mb-2"
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/browse" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                variant="ghost" 
                className="w-full justify-start mb-2"
              >
                <Search className="mr-2 h-4 w-4" />
                Browse
              </Button>
            </Link>
            <Link to="/contracts" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                variant="ghost" 
                className="w-full justify-start mb-2"
              >
                <FileText className="mr-2 h-4 w-4" />
                Contracts
              </Button>
            </Link>
            <Link to="/attendance" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                variant="ghost" 
                className="w-full justify-start mb-2"
              >
                <CalendarCheck className="mr-2 h-4 w-4" />
                Attendance
              </Button>
            </Link>
            <Link to="/messages" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                variant="ghost" 
                className="w-full justify-start mb-2"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages
              </Button>
            </Link>
            <div className="border-t my-2"></div>
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
              <Button 
                variant="ghost" 
                className="w-full justify-start mb-2"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
