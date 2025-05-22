
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { initializeTestAccountSystem, showTestAccountInfo } from "@/utils/authUtils";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PoliticalClientSignUp from "./pages/PoliticalClientSignUp";
import Account from "./pages/Account";
import Dashboard from "./pages/Dashboard";
import CampaignDetail from "./pages/CampaignDetail";
import CreateCampaign from "./pages/CreateCampaign";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCampaignApproval from "./pages/AdminCampaignApproval";
import AdminManageAwards from "./pages/AdminManageAwards";
import PoliticalClientDashboard from "./pages/political-client/PoliticalClientDashboard";
import PoliticalClientProfile from "./pages/political-client/PoliticalClientProfile";
import CreateEditInitiative from "./pages/political-client/CreateEditInitiative";
import ManageInitiativeAssets from "./pages/political-client/ManageInitiativeAssets";
import ClientPaymentsPage from "./pages/political-client/ClientPaymentsPage";
import ClientGrantAwardPage from "./pages/political-client/ClientGrantAwardPage";
import NotFound from "./pages/NotFound";
import Splash from "./pages/Splash";

// Create a new React Query client with custom options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000, // 30 seconds
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    // Initialize test account system when app loads
    initializeTestAccountSystem();
    
    // Show test account info in development
    if (import.meta.env.DEV) {
      // Small delay to ensure everything is loaded
      setTimeout(() => {
        showTestAccountInfo();
      }, 1000);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/splash" element={<Splash />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/political-signup" element={<PoliticalClientSignUp />} />
              <Route path="/account" element={<Account />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/campaigns/:id" element={<CampaignDetail />} />
              <Route path="/create-campaign" element={<CreateCampaign />} />
              
              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/campaign-approval" element={<AdminCampaignApproval />} />
              <Route path="/admin/manage-awards" element={<AdminManageAwards />} />
              
              {/* Political Client Routes */}
              <Route path="/political-client/dashboard" element={<PoliticalClientDashboard />} />
              <Route path="/political-client/profile" element={<PoliticalClientProfile />} />
              <Route path="/political-client/initiative/create" element={<CreateEditInitiative />} />
              <Route path="/political-client/initiative/edit/:id" element={<CreateEditInitiative />} />
              <Route path="/political-client/initiative/assets/:id" element={<ManageInitiativeAssets />} />
              <Route path="/political-client/payments" element={<ClientPaymentsPage />} />
              <Route path="/political-client/awards" element={<ClientGrantAwardPage />} />
              
              {/* Catch-all for unmatched routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
