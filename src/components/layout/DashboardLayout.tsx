import { ReactNode, useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  FileText, 
  ShoppingBag,
  Globe,
  Settings,
  Menu,
  LogOut,
  Bell,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/wrestling/dashboard" },
  { icon: Users, label: "Members", path: "/wrestling/dashboard/members" },
  { icon: Calendar, label: "Schedule", path: "/wrestling/dashboard/schedule" },
  { icon: MessageSquare, label: "Messages", path: "/wrestling/dashboard/messages" },
  { icon: CreditCard, label: "Payments", path: "/wrestling/dashboard/payments" },
  { icon: FileText, label: "Registration", path: "/wrestling/dashboard/registration" },
  { icon: ShoppingBag, label: "Merch Store", path: "/wrestling/dashboard/store" },
  { icon: Globe, label: "Website", path: "/wrestling/dashboard/website" },
  { icon: Settings, label: "Settings", path: "/wrestling/dashboard/settings" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clubName, setClubName] = useState('My Club');

  useEffect(() => {
    // Wait for auth to load before checking role
    if (loading) return;

    // Not logged in — redirect to login
    if (!profile) {
      navigate('/wrestling/login');
      return;
    }

    // Parent trying to access admin — redirect to their club dashboard
    if (profile.role === 'parent') {
      if (profile.club_id) {
        // Look up club slug and redirect
        supabase
          .from('clubs')
          .select('slug')
          .eq('id', profile.club_id)
          .single()
          .then(({ data }) => {
            const slug = data?.slug ?? profile.club_id;
            navigate(`/wrestling/club/${slug}/parent`, { replace: true });
          });
      } else {
        navigate('/wrestling/login', { replace: true });
      }
    }
  }, [profile, loading]);

  useEffect(() => {
    if (profile?.club_id) {
      supabase
        .from('clubs')
        .select('name')
        .eq('id', profile.club_id)
        .single()
        .then(({ data }) => {
          if (data?.name) setClubName(data.name);
        });
    }
  }, [profile]);

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : '?';

  async function handleSignOut() {
    await signOut();
    navigate('/wrestling/login');
  }

  // Show loading while auth is resolving or while redirecting a parent
  if (loading || !profile || profile.role === 'parent') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-sidebar transform transition-transform duration-200
        lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-sidebar-border">
            <Link to="/wrestling/dashboard" className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-gold" />
              <span className="text-xl font-display text-white">MAT MANAGER</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <div className="px-4 py-3 rounded-lg bg-sidebar-accent">
              <p className="text-sm font-medium text-sidebar-accent-foreground">{clubName}</p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">{profile.role}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-card border-b">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button
              className="lg:hidden p-2 hover:bg-secondary rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="relative p-2 hover:bg-secondary rounded-lg">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="p-4 border-b">
                    <h4 className="font-display text-sm">NOTIFICATIONS</h4>
                  </div>
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No new notifications
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 hover:bg-secondary rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                      <span className="text-sm font-bold text-navy">{initials}</span>
                    </div>
                    <span className="hidden md:block font-medium">
                      {profile.full_name ?? 'Loading...'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <Link to="/wrestling/dashboard/settings">
                    <DropdownMenuItem>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
