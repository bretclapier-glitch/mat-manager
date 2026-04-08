import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import {
  Users,
  DollarSign,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Loader2,
} from "lucide-react";

type DashboardStats = {
  totalMembers: number;
  monthlyRevenue: number;
  activeRegistrations: number;
  unreadMessages: number;
};

type UpcomingEvent = {
  id: string;
  title: string;
  start_time: string;
  event_type: string;
  location: string | null;
};

type RecentRegistration = {
  id: string;
  program: string;
  status: string;
  wrestlers: { full_name: string } | null;
};

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    monthlyRevenue: 0,
    activeRegistrations: 0,
    unreadMessages: 0,
  });
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [registrations, setRegistrations] = useState<RecentRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.club_id) loadDashboardData(profile.club_id);
  }, [profile]);

  async function loadDashboardData(clubId: string) {
    setLoading(true);
    try {
      const [
        { count: memberCount },
        { data: paymentsData },
        { count: regCount },
        { count: msgCount },
        { data: eventsData },
        { data: regsData },
      ] = await Promise.all([
        supabase.from('wrestlers').select('*', { count: 'exact', head: true }).eq('club_id', clubId).eq('status', 'active'),
        supabase.from('payments').select('amount').eq('club_id', clubId).eq('status', 'paid').gte('paid_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
        supabase.from('registrations').select('*', { count: 'exact', head: true }).eq('club_id', clubId).eq('status', 'pending'),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('club_id', clubId),
        supabase.from('events').select('id, title, start_time, event_type, location').eq('club_id', clubId).gte('start_time', new Date().toISOString()).order('start_time').limit(4),
        supabase.from('registrations').select('id, program, status, wrestlers(full_name)').eq('club_id', clubId).order('created_at', { ascending: false }).limit(3),
      ]);

      const revenue = paymentsData?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;

      setStats({
        totalMembers: memberCount ?? 0,
        monthlyRevenue: revenue,
        activeRegistrations: regCount ?? 0,
        unreadMessages: msgCount ?? 0,
      });
      setEvents((eventsData ?? []) as UpcomingEvent[]);
      setRegistrations((regsData ?? []) as RecentRegistration[]);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }

  const statCards = [
    { title: "Total Members", value: stats.totalMembers.toString(), change: "", trend: "neutral", icon: Users, path: "/wrestling/dashboard/members" },
    { title: "Monthly Revenue", value: `$${stats.monthlyRevenue.toLocaleString()}`, change: "", trend: "neutral", icon: DollarSign, path: "/wrestling/dashboard/payments" },
    { title: "Pending Registrations", value: stats.activeRegistrations.toString(), change: "", trend: "neutral", icon: Calendar, path: "/wrestling/dashboard/registration" },
    { title: "Messages", value: stats.unreadMessages.toString(), change: "", trend: "neutral", icon: MessageSquare, path: "/wrestling/dashboard/messages" },
  ];

  function formatEventTime(isoString: string) {
    const date = new Date(isoString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    if (isToday) return `Today, ${timeStr}`;
    if (isTomorrow) return `Tomorrow, ${timeStr}`;
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display">DASHBOARD</h1>
          <p className="text-muted-foreground">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}! Here's what's happening with your club.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat) => (
                <Link key={stat.title} to={stat.path}>
                  <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                          <stat.icon className="h-6 w-6 text-gold" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-display">UPCOMING EVENTS</CardTitle>
                  <Link to="/wrestling/dashboard/schedule">
                    <Button variant="ghost" size="sm">
                      View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {events.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p>No upcoming events</p>
                      <Link to="/wrestling/dashboard/schedule">
                        <Button variant="outline" size="sm" className="mt-3">Create Event</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {events.map((event) => (
                        <Link
                          key={event.id}
                          to="/wrestling/dashboard/schedule"
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              event.event_type === "practice" ? "bg-gold" :
                              event.event_type === "tournament" ? "bg-wrestling-red" :
                              event.event_type === "meeting" ? "bg-blue-500" :
                              "bg-muted-foreground"
                            }`} />
                            <div>
                              <p className="font-medium">{event.title}</p>
                              <p className="text-sm text-muted-foreground">{formatEventTime(event.start_time)}</p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-display">RECENT REGISTRATIONS</CardTitle>
                  <Link to="/wrestling/dashboard/registration">
                    <Button variant="ghost" size="sm">
                      View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {registrations.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p>No registrations yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {registrations.map((reg) => (
                        <Link
                          key={reg.id}
                          to="/wrestling/dashboard/registration"
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center">
                              <span className="text-sm font-bold text-white">
                                {reg.wrestlers?.full_name?.split(" ").map((n: string) => n[0]).join("") ?? "?"}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{reg.wrestlers?.full_name ?? "Unknown"}</p>
                              <p className="text-sm text-muted-foreground">{reg.program}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            reg.status === "complete"
                              ? "bg-wrestling-green/10 text-wrestling-green"
                              : "bg-gold/10 text-gold"
                          }`}>
                            {reg.status}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-card bg-gradient-to-r from-navy to-navy-light text-white">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl font-display mb-2">QUICK ACTIONS</h3>
                    <p className="text-white/70">Common tasks to manage your club</p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link to="/wrestling/dashboard/members">
                      <Button variant="hero" size="lg">Add Member</Button>
                    </Link>
                    <Link to="/wrestling/dashboard/schedule">
                      <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                        Create Event
                      </Button>
                    </Link>
                    <Link to="/wrestling/dashboard/messages">
                      <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                        Send Message
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
