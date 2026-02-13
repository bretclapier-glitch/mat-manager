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
import NotFound from "./pages/NotFound";

// Club website (parent-facing) routes
import ClubLayout from "./components/layout/ClubLayout";
import ClubHome from "./pages/club/ClubHome";
import ClubPrograms from "./pages/club/ClubPrograms";
import ClubRegister from "./pages/club/ClubRegister";
import ClubParentLogin from "./pages/club/ClubParentLogin";
import ClubParentDashboard from "./pages/club/ClubParentDashboard";
import ClubWrestlerProfile from "./pages/club/ClubWrestlerProfile";
import ClubEventDetail from "./pages/club/ClubEventDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* SaaS landing & club owner auth */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Club admin dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/schedule" element={<Schedule />} />
          <Route path="/dashboard/messages" element={<Messages />} />
          <Route path="/dashboard/registration" element={<Registration />} />
          <Route path="/dashboard/store" element={<Store />} />
          <Route path="/dashboard/website" element={<Website />} />
          <Route path="/dashboard/payments" element={<Payments />} />

          {/* Club public website (parent-facing) */}
          <Route path="/club/:clubSlug" element={<ClubLayout />}>
            <Route index element={<ClubHome />} />
            <Route path="programs" element={<ClubPrograms />} />
            <Route path="register/:programId" element={<ClubRegister />} />
            <Route path="login" element={<ClubParentLogin />} />
            <Route path="parent" element={<ClubParentDashboard />} />
            <Route path="parent/wrestler/:wrestlerId" element={<ClubWrestlerProfile />} />
            <Route path="parent/event/:eventId" element={<ClubEventDetail />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
