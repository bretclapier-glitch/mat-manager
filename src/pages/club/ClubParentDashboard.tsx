import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ParentDashboardLayout from "@/components/layout/ParentDashboardLayout";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import {
  Trophy,
  Calendar,
  Bell,
  CreditCard,
  User,
  Plus,
  CheckCircle,
  Clock,
  MapPin,
  ChevronRight,
  ShoppingBag,
  MessageSquare,
  AlertCircle,
  Loader2,
} from "lucide-react";

type Wrestler = {
  id: string;
  full_name: string;
  date_of_birth: string | null;
  program: string;
  status: string;
  weight_class: string | null;
};

type Event = {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location: string | null;
  event_type: string;
};

type Payment = {
  id: string;
  description: string;
  amount: number;
  status: string;
  created_at: string;
};

type Announcement = {
  id: string;
  title: string;
  message: string;
  priority: string;
  created_at: string;
};

export default function ClubParentDashboard() {
  const { clubSlug } = useParams();
  const { profile, user } = useAuth();
  const basePath = `/wrestling/club/${clubSlug}`;

  const [clubId, setClubId] = useState<string | null>(null);
  const [wrestlers, setWrestlers] = useState<Wrestler[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Load club by slug first, then load all data
  useEffect(() => {
  if (clubSlug && user !== undefined) loadClubAndData(clubSlug);
}, [clubSlug, user]);

  async function loadClubAndData(slug: string) {
    setLoading(true);
    try {
      // Find club by slug first, then try by id
      let club = null;
      const { data: clubBySlug } = await supabase
        .from('clubs')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (clubBySlug) {
        club = clubBySlug;
      } else {
        const { data: clubById } = await supabase
          .from('clubs')
          .select('id')
          .eq('id', slug)
          .maybeSingle();
        club = clubById;
      }

      if (!club) {
        setLoading(false);
        return;
      }

      setClubId(club.id);

      // Update profile club_id if not set
      if (user && profile && !profile.club_id) {
        await supabase
          .from('profiles')
          .update({ club_id: club.id })
          .eq('id', user.id);
      }

      // Load all data in parallel
      const [
        { data: wrestlerData },
        { data: eventData },
        { data: paymentData },
        { data: announcementData },
      ] = await Promise.all([
        // Load wrestlers for this parent at this club
        user
          ? supabase.from('wrestlers').select('*').eq('parent_id', user.id).eq('club_id', club.id)
          : { data: [] },
        supabase.from('events').select('*').eq('club_id', club.id).gte('start_time', new Date().toISOString()).order('start_time').limit(5),
        user
          ? supabase.from('payments').select('*').eq('parent_id', user.id).eq('club_id', club.id).order('created_at', { ascending: false }).limit(5)
          : { data: [] },
        supabase.from('announcements').select('*').eq('club_id', club.id).order('created_at', { ascending: false }).limit(5),
      ]);

      setWrestlers((wrestlerData ?? []) as Wrestler[]);
      setEvents((eventData ?? []) as Event[]);
      setPayments((paymentData ?? []) as Payment[]);
      setAnnouncements((announcementData ?? []) as Announcement[]);
    } catch (err) {
      console.error('Parent dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }

  function getAge(dob: string | null) {
    if (!dob) return null;
    return Math.floor((Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
  }

  function formatEventDate(iso: string) {
    const date = new Date(iso);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function formatEventTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  const highPriorityAlert = announcements.find(a => a.priority === 'high');
  const hasPendingPayment = payments.some(p => p.status === 'pending');
  const firstName = profile?.full_name?.split(" ")[0]?.toUpperCase() ?? "PARENT";

  return (
    <ParentDashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-display mb-2">WELCOME BACK, {firstName}</h1>
          <p className="text-muted-foreground">Manage your wrestlers, view schedules, and stay up to date.</p>
        </div>

        {highPriorityAlert && (
          <Card className="mb-6 border-wrestling-red bg-wrestling-red/5">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-wrestling-red shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-wrestling-red">{highPriorityAlert.title}</p>
                <p className="text-sm text-muted-foreground">{highPriorityAlert.message}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">

              {/* Wrestlers */}
              <Card className="shadow-card">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-xl font-display">MY WRESTLERS</CardTitle>
                  <Link to={`${basePath}/programs`}>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />Add Wrestler
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {wrestlers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Trophy className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p>No wrestlers registered yet</p>
                      <Link to={`${basePath}/programs`}>
                        <Button variant="outline" size="sm" className="mt-3">Browse Programs</Button>
                      </Link>
                    </div>
                  ) : (
                    wrestlers.map((w) => (
                      <div key={w.id} className="block p-4 rounded-lg bg-secondary/50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-navy text-white">
                                {w.full_name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{w.full_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {w.program}{getAge(w.date_of_birth) ? ` • Age ${getAge(w.date_of_birth)}` : ''}
                                {w.weight_class ? ` • ${w.weight_class}` : ''}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-wrestling-green/10 text-wrestling-green border-wrestling-green/20">
                            {w.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card className="shadow-card">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-xl font-display">UPCOMING SCHEDULE</CardTitle>
                  <Link to={`${basePath}/parent/calendar`}>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />Calendar
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {events.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p>No upcoming events scheduled</p>
                    </div>
                  ) : (
                    events.map((event) => (
                      <div key={event.id} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          event.event_type === "tournament" ? "bg-gold/20 text-gold" : "bg-navy/10 text-navy"
                        }`}>
                          {event.event_type === "tournament"
                            ? <Trophy className="h-6 w-6" />
                            : <Calendar className="h-6 w-6" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span>{formatEventDate(event.start_time)}</span>
                            <span>{formatEventTime(event.start_time)} – {formatEventTime(event.end_time)}</span>
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />{event.location}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader><CardTitle className="text-xl font-display">QUICK ACTIONS</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-3 gap-3">
                  <Link to={`${basePath}/parent/messages`}>
                    <Button variant="outline" className="flex-col h-auto py-4 w-full">
                      <MessageSquare className="h-5 w-5 mb-2" /><span className="text-xs">Messages</span>
                    </Button>
                  </Link>
                  <Link to={`${basePath}/store`}>
                    <Button variant="outline" className="flex-col h-auto py-4 w-full">
                      <ShoppingBag className="h-5 w-5 mb-2" /><span className="text-xs">Shop</span>
                    </Button>
                  </Link>
                  <Link to={`${basePath}/parent/profile`}>
                    <Button variant="outline" className="flex-col h-auto py-4 w-full">
                      <User className="h-5 w-5 mb-2" /><span className="text-xs">Profile</span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-xl font-display">PAYMENTS</CardTitle>
                  <Link to={`${basePath}/parent/payments`}>
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {payments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No payments yet</p>
                  ) : (
                    payments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-3">
                          {p.status === "paid"
                            ? <CheckCircle className="h-5 w-5 text-wrestling-green" />
                            : <Clock className="h-5 w-5 text-gold" />}
                          <div>
                            <p className="text-sm font-medium">{p.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(p.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${p.amount}</p>
                          <Badge
                            variant={p.status === "paid" ? "secondary" : "outline"}
                            className={`text-xs ${p.status === "pending" ? "border-gold text-gold" : ""}`}
                          >
                            {p.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                  {hasPendingPayment && (
                    <Button variant="hero" className="w-full mt-2">
                      <CreditCard className="h-4 w-4 mr-2" />Pay Outstanding Balance
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader><CardTitle className="text-xl font-display">ANNOUNCEMENTS</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {announcements.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No announcements</p>
                  ) : (
                    announcements.map((a) => (
                      <div key={a.id} className={`p-3 rounded-lg ${
                        a.priority === "high"
                          ? "bg-wrestling-red/10 border border-wrestling-red/20"
                          : "bg-secondary/50"
                      }`}>
                        <div className="flex items-start gap-2">
                          <Bell className={`h-4 w-4 mt-0.5 ${a.priority === "high" ? "text-wrestling-red" : "text-gold"}`} />
                          <div>
                            <p className="text-sm font-medium">{a.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{a.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(a.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </ParentDashboardLayout>
  );
}
