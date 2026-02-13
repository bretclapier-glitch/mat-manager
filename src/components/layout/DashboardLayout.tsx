import { ReactNode, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link, useLocation } from "react-router-dom";
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
  X,
  LogOut,
  Bell,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-sidebar transform transition-transform duration-200
        lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <Link to="/wrestling/dashboard" className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-gold" />
              <span className="text-xl font-display text-white">HOMETEAM WRESTLING</span>
            </Link>
          </div>

          {/* Navigation */}
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

          {/* Club info */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="px-4 py-3 rounded-lg bg-sidebar-accent">
              <p className="text-sm font-medium text-sidebar-accent-foreground">Thunder Wrestling</p>
              <p className="text-xs text-sidebar-foreground/60">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card border-b">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button
              className="lg:hidden p-2 hover:bg-secondary rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
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
                      { title: "New Registration", desc: "Marcus Johnson registered for Youth Wrestling", time: "5 min ago", unread: true },
                      { title: "Payment Received", desc: "$200.00 from Sarah Williams", time: "1 hour ago", unread: true },
                      { title: "Practice Cancelled", desc: "Feb 8 practice cancelled due to maintenance", time: "3 hours ago", unread: false },
                      { title: "Message from Parent", desc: "David Johnson sent you a message", time: "Yesterday", unread: false },
                      { title: "Tournament Reminder", desc: "Austin Youth Tournament is in 5 days", time: "Yesterday", unread: false },
                    ].map((n, i) => (
                      <Link
                        key={i}
                        to={i === 0 ? "/wrestling/dashboard/registration" : i === 1 ? "/wrestling/dashboard/payments" : i === 3 ? "/wrestling/dashboard/messages" : "/wrestling/dashboard/schedule"}
                        className={`block p-3 border-b last:border-0 hover:bg-secondary/50 transition-colors ${n.unread ? "bg-gold/5" : ""}`}
                      >
                        <div className="flex items-start gap-2">
                          {n.unread && <span className="mt-1.5 w-2 h-2 rounded-full bg-gold shrink-0" />}
                          <div className={n.unread ? "" : "ml-4"}>
                            <p className={`text-sm ${n.unread ? "font-semibold" : "font-medium"}`}>{n.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                            <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="p-2 border-t">
                    <Link to="/wrestling/dashboard/messages" className="block text-center text-sm text-gold hover:underline py-1">View all notifications</Link>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Profile dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 hover:bg-secondary rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                      <span className="text-sm font-bold text-navy">JD</span>
                    </div>
                    <span className="hidden md:block font-medium">John Doe</span>
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
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
