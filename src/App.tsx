
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminContractEditor from "./pages/admin/ContractEditor";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile";
import BrowsePage from "./pages/browse/BrowsePage";
import ListingDetailPage from "./pages/listings/ListingDetailPage";
import AttendancePage from "./pages/attendance/AttendancePage";
import BidsPage from "./pages/bids/BidsPage";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Dashboard and Profile */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Browse and Listing Routes */}
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/browse/:type" element={<BrowsePage />} />
            <Route path="/needs/:id" element={<ListingDetailPage />} />
            <Route path="/offers/:id" element={<ListingDetailPage />} />
            
            {/* Contract Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/contracts/:id" element={<Index />} />
            <Route path="/admin/contracts/:id" element={<AdminContractEditor />} />
            
            {/* Attendance Routes */}
            <Route path="/attendance" element={<AttendancePage />} />
            
            {/* Bids Routes */}
            <Route path="/bids" element={<BidsPage />} />
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
