import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

// Wrestling imports
import WrestlingLanding from "./pages/wrestling/Landing";
import WrestlingLogin from "./pages/wrestling/Login";
import WrestlingSignup from "./pages/wrestling/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Schedule from "./pages/Schedule";
import Messages from "./pages/Messages";
import Registration from "./pages/Registration";
import Store from "./pages/Store";
import Website from "./pages/Website";
import Payments from "./pages/Payments";
import Settings from "./pages/Settings";
import Members from "./pages/Members";
import ClubLayout from "./components/layout/ClubLayout";
import ClubHome from "./pages/club/ClubHome";
import ClubPrograms from "./pages/club/ClubPrograms";
import ClubRegister from "./pages/club/ClubRegister";
import ClubParentLogin from "./pages/club/ClubParentLogin";
import ClubParentDashboard from "./pages/club/ClubParentDashboard";
import ClubWrestlerProfile from "./pages/club/ClubWrestlerProfile";
import ClubEventDetail from "./pages/club/ClubEventDetail";
import ClubParentMessages from "./pages/club/ClubParentMessages";
import ClubParentPayments from "./pages/club/ClubParentPayments";
import ClubParentCalendar from "./pages/club/ClubParentCalendar";
import ClubParentProfile from "./pages/club/ClubParentProfile";
import ClubParentStore from "./pages/club/ClubParentStore";

// Baseball imports
import BaseballLanding from "./pages/baseball/Landing";
import BaseballLogin from "./pages/baseball/Login";
import BaseballSignup from "./pages/baseball/Signup";
import BaseballOnboarding from "./pages/baseball/Onboarding";
import BaseballDashboard from "./pages/baseball/Dashboard";
import BaseballPlayers from "./pages/baseball/Players";
import BaseballSchedule from "./pages/baseball/Schedule";
import BaseballMessages from "./pages/baseball/Messages";
import BaseballPayments from "./pages/baseball/Payments";
import BaseballSettings from "./pages/baseball/Settings";
import BaseballClubLayout from "./components/layout/BaseballClubLayout";
import BaseballClubHome from "./pages/baseball/club/ClubHome";
import BaseballClubPrograms from "./pages/baseball/club/ClubPrograms";
import BaseballClubRegister from "./pages/baseball/club/ClubRegister";
import BaseballClubParentLogin from "./pages/baseball/club/ClubParentLogin";
import BaseballClubParentDashboard from "./pages/baseball/club/ClubParentDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Sport picker / shared landing */}
          <Route path="/" element={<Navigate to="/wrestling" replace />} />
          <Route path="/home" element={<Landing />} />

          {/* ==================== WRESTLING ==================== */}
          <Route path="/wrestling" element={<WrestlingLanding />} />
          <Route path="/wrestling/login" element={<WrestlingLogin />} />
          <Route path="/wrestling/signup" element={<WrestlingSignup />} />
          <Route path="/wrestling/onboarding" element={<Onboarding />} />
          <Route path="/wrestling/dashboard" element={<Dashboard />} />
          <Route path="/wrestling/dashboard/schedule" element={<Schedule />} />
          <Route path="/wrestling/dashboard/messages" element={<Messages />} />
          <Route path="/wrestling/dashboard/registration" element={<Registration />} />
          <Route path="/wrestling/dashboard/store" element={<Store />} />
          <Route path="/wrestling/dashboard/website" element={<Website />} />
          <Route path="/wrestling/dashboard/payments" element={<Payments />} />
          <Route path="/wrestling/dashboard/settings" element={<Settings />} />
          <Route path="/wrestling/dashboard/members" element={<Members />} />

          {/* Wrestling club public */}
          <Route path="/wrestling/club/:clubSlug" element={<ClubLayout />}>
            <Route index element={<ClubHome />} />
            <Route path="programs" element={<ClubPrograms />} />
            <Route path="register/:programId" element={<ClubRegister />} />
            <Route path="login" element={<ClubParentLogin />} />
          </Route>

          {/* Wrestling parent portal */}
          <Route path="/wrestling/club/:clubSlug/parent" element={<ClubParentDashboard />} />
          <Route path="/wrestling/club/:clubSlug/parent/wrestler/:wrestlerId" element={<ClubWrestlerProfile />} />
          <Route path="/wrestling/club/:clubSlug/parent/event/:eventId" element={<ClubEventDetail />} />
          <Route path="/wrestling/club/:clubSlug/parent/messages" element={<ClubParentMessages />} />
          <Route path="/wrestling/club/:clubSlug/parent/payments" element={<ClubParentPayments />} />
          <Route path="/wrestling/club/:clubSlug/parent/calendar" element={<ClubParentCalendar />} />
          <Route path="/wrestling/club/:clubSlug/parent/profile" element={<ClubParentProfile />} />
          <Route path="/wrestling/club/:clubSlug/store" element={<ClubParentStore />} />

          {/* ==================== BASEBALL ==================== */}
          <Route path="/baseball" element={<BaseballLanding />} />
          <Route path="/baseball/login" element={<BaseballLogin />} />
          <Route path="/baseball/signup" element={<BaseballSignup />} />
          <Route path="/baseball/onboarding" element={<BaseballOnboarding />} />
          <Route path="/baseball/dashboard" element={<BaseballDashboard />} />
          <Route path="/baseball/dashboard/players" element={<BaseballPlayers />} />
          <Route path="/baseball/dashboard/schedule" element={<BaseballSchedule />} />
          <Route path="/baseball/dashboard/messages" element={<BaseballMessages />} />
          <Route path="/baseball/dashboard/payments" element={<BaseballPayments />} />
          <Route path="/baseball/dashboard/settings" element={<BaseballSettings />} />

          {/* Baseball club public */}
          <Route path="/baseball/club/:clubSlug" element={<BaseballClubLayout />}>
            <Route index element={<BaseballClubHome />} />
            <Route path="programs" element={<BaseballClubPrograms />} />
            <Route path="register/:programId" element={<BaseballClubRegister />} />
            <Route path="login" element={<BaseballClubParentLogin />} />
          </Route>

          {/* Baseball parent portal */}
          <Route path="/baseball/club/:clubSlug/parent" element={<BaseballClubParentDashboard />} />

          {/* Legacy redirects */}
          <Route path="/login" element={<Navigate to="/wrestling/login" replace />} />
          <Route path="/signup" element={<Navigate to="/wrestling/signup" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
