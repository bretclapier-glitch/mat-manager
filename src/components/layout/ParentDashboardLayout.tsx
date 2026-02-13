import { ReactNode, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useClubData } from "@/components/layout/ClubLayout";
import {
  Trophy,
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  CreditCard,
  FileText,
  ShoppingBag,
  User,
  Menu,
  X,
  LogOut,
  Bell,
  ChevronDown,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ParentDashboardLayoutProps {
  children: ReactNode;
}

const parentInfo = { name: "David Johnson", email: "david.johnson@email.com" };

export default function ParentDashboardLayout({ children }: ParentDashboardLayoutProps) {
  const { clubSlug } = useParams();
  const location = useLocation();
  const club = useClubData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const basePath = `/club/${clubSlug}`;

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: `${basePath}/parent` },
    { icon: Users, label: "My Wrestlers", path: `${basePath}/parent` },
    { icon: Calendar, label: "Schedule", path: `${basePath}/parent/calendar` },
    { icon: MessageSquare, label: "Messages", path: `${basePath}/parent/messages` },
    { icon: CreditCard, label: "Payments", path: `${basePath}/parent/payments` },
    { icon: ShoppingBag, label: "Shop", path: `${basePath}/store` },
    { icon: User, label: "Profile", path: `${basePath}/parent/profile` },
  ];

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-sidebar transform transition-transform duration-200
        lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-sidebar-border">
            <Link to={basePath} className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-gold" />
              <span className="text-lg font-display text-white">{club.name.toUpperCase()}</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
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
              <p className="text-sm font-medium text-sidebar-accent-foreground">{parentInfo.name}</p>
              <p className="text-xs text-sidebar-foreground/60">Parent Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-card border-b">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button className="lg:hidden p-2 hover:bg-secondary rounded-lg" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="relative p-2 hover:bg-secondary rounded-lg">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-wrestling-red rounded-full" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="p-4 border-b">
                    <h4 className="font-display text-sm">NOTIFICATIONS</h4>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {[
                      { title: "Practice Cancelled", desc: "Feb 8 practice cancelled due to maintenance", time: "3 hours ago", unread: true },
                      { title: "Tournament Reminder", desc: "Austin Youth Tournament is in 5 days", time: "Yesterday", unread: true },
                      { title: "Payment Due", desc: "Tournament fee of $35 is due", time: "2 days ago", unread: false },
                    ].map((n, i) => (
                      <div key={i} className={`p-3 border-b last:border-0 ${n.unread ? "bg-gold/5" : ""}`}>
                        <div className="flex items-start gap-2">
                          {n.unread && <span className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />}
                          <div className={n.unread ? "" : "ml-4"}>
                            <p className={`text-sm ${n.unread ? "font-semibold" : "font-medium"}`}>{n.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                            <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 hover:bg-secondary rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gold text-navy font-bold text-sm">DJ</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block font-medium">{parentInfo.name}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <Link to={`${basePath}/parent/profile`}>
                    <DropdownMenuItem><User className="h-4 w-4 mr-2" />Profile</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <Link to={`${basePath}/login`}>
                    <DropdownMenuItem className="text-destructive"><LogOut className="h-4 w-4 mr-2" />Sign out</DropdownMenuItem>
                  </Link>
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
