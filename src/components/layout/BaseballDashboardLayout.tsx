import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Target,
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
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BaseballDashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/baseball/dashboard" },
  { icon: Users, label: "Players", path: "/baseball/dashboard/players" },
  { icon: Calendar, label: "Schedule", path: "/baseball/dashboard/schedule" },
  { icon: MessageSquare, label: "Messages", path: "/baseball/dashboard/messages" },
  { icon: CreditCard, label: "Payments", path: "/baseball/dashboard/payments" },
  { icon: FileText, label: "Registration", path: "/baseball/dashboard/registration" },
  { icon: ShoppingBag, label: "Team Store", path: "/baseball/dashboard/store" },
  { icon: Globe, label: "Website", path: "/baseball/dashboard/website" },
  { icon: Settings, label: "Settings", path: "/baseball/dashboard/settings" },
];

export default function BaseballDashboardLayout({ children }: BaseballDashboardLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-[hsl(150,30%,12%)] transform transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/10">
            <Link to="/baseball/dashboard" className="flex items-center gap-2">
              <Target className="h-8 w-8 text-[hsl(150,45%,45%)]" />
              <span className="text-xl font-display text-white">HOMETEAM BASEBALL</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive ? "bg-[hsl(150,45%,35%)] text-white" : "text-white/70 hover:bg-white/5 hover:text-white"}`}>
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="px-4 py-3 rounded-lg bg-white/5">
              <p className="text-sm font-medium text-white">Austin Thunder</p>
              <p className="text-xs text-white/50">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 bg-card border-b">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button className="lg:hidden p-2 hover:bg-secondary rounded-lg" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-4 ml-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="relative p-2 hover:bg-secondary rounded-lg">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="p-4 border-b"><h4 className="font-display text-sm">NOTIFICATIONS</h4></div>
                  <div className="p-3 text-sm text-muted-foreground text-center">No new notifications</div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 hover:bg-secondary rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[hsl(150,45%,35%)] flex items-center justify-center">
                      <span className="text-sm font-bold text-white">MC</span>
                    </div>
                    <span className="hidden md:block font-medium">Mike Coach</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <Link to="/baseball/dashboard/settings"><DropdownMenuItem><Settings className="h-4 w-4 mr-2" />Settings</DropdownMenuItem></Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive"><LogOut className="h-4 w-4 mr-2" />Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
