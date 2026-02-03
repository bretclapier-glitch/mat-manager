import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Messages from "./pages/Messages";
import Registration from "./pages/Registration";
import Store from "./pages/Store";
import Website from "./pages/Website";
import Payments from "./pages/Payments";
import PublicPrograms from "./pages/PublicPrograms";
import PublicRegister from "./pages/PublicRegister";
import ParentDashboard from "./pages/ParentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />
          {/* Parent-facing routes */}
          <Route path="/programs" element={<PublicPrograms />} />
          <Route path="/register/:programId" element={<PublicRegister />} />
          <Route path="/parent" element={<ParentDashboard />} />
          {/* Admin dashboard routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/schedule" element={<Schedule />} />
          <Route path="/dashboard/messages" element={<Messages />} />
          <Route path="/dashboard/registration" element={<Registration />} />
          <Route path="/dashboard/store" element={<Store />} />
          <Route path="/dashboard/website" element={<Website />} />
          <Route path="/dashboard/payments" element={<Payments />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
