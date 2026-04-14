import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ParentDashboardLayout from "@/components/layout/ParentDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Trophy, ChevronLeft, ChevronRight, Users, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

type Event = {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location: string | null;
  event_type: string;
  club_id: string;
};

type Wrestler = {
  id: string;
  full_name: string;
  program: string;
};

export default function ClubParentCalendar() {
  const { clubSlug } = useParams();
  const { user } = useAuth();
  const basePath = `/wrestling/club/${clubSlug}`;

  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [wrestlers, setWrestlers] = useState<Wrestler[]>([]);
  const [clubId, setClubId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (clubSlug) loadData(clubSlug);
  }, [clubSlug, user]);

  async function loadData(slug: string) {
    setLoading(true);
    try {
      // Find club by slug or id
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let club = null;
      if (uuidRegex.test(slug)) {
        const { data } = await supabase.from('clubs').select('id').eq('id', slug).maybeSingle();
        club = data;
      } else {
        const { data } = await supabase.from('clubs').select('id').eq('slug', slug).maybeSingle();
        club = data;
      }

      if (!club) { setLoading(false); return; }
      setClubId(club.id);

      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59).toISOString();

      const [{ data: eventsData }, { data: wrestlerData }] = await Promise.all([
        supabase.from('events').select('*').eq('club_id', club.id)
          .gte('start_time', startOfMonth)
          .lte('start_time', endOfMonth)
          .order('start_time'),
        user
          ? supabase.from('wrestlers').select('id, full_name, program').eq('parent_id', user.id).eq('club_id', club.id)
          : { data: [] },
      ]);

      setAllEvents((eventsData ?? []) as Event[]);
      setWrestlers((wrestlerData ?? []) as Wrestler[]);
    } catch (err) {
      console.error('Calendar load error:', err);
    } finally {
      setLoading(false);
    }
  }

  function prevMonth() {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(d);
    if (clubSlug) loadData(clubSlug);
  }

  function nextMonth() {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(d);
    if (clubSlug) loadData(clubSlug);
  }

  function formatDate(iso: string) {
    const date = new Date(iso);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  const monthLabel = currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' }).toUpperCase();

  // "My Calendar" shows all club events — in future can filter by wrestler program
  const myEvents = allEvents;

  function EventList({ events }: { events: Event[] }) {
    if (events.length === 0) {
      return (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center text-muted-foreground">
            <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No events this month</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="shadow-card">
        <CardContent className="p-0 divide-y">
          {events.map((event) => (
            <div key={event.id} className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors">
              <div className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center text-center ${
                event.event_type === "tournament" ? "bg-gold/20 text-gold" :
                event.event_type === "meeting" ? "bg-blue-500/20 text-blue-600" :
                "bg-navy/10 text-navy"
              }`}>
                {event.event_type === "tournament"
                  ? <Trophy className="h-5 w-5" />
                  : <Calendar className="h-5 w-5" />}
                <span className="text-xs font-bold mt-0.5">
                  {new Date(event.start_time).getDate()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{event.title}</h4>
                  <Badge variant="outline" className="text-xs capitalize">{event.event_type}</Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />{formatTime(event.start_time)} – {formatTime(event.end_time)}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />{event.location}
                    </span>
                  )}
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {formatDate(event.start_time)}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <ParentDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display">SCHEDULE</h1>
            <p className="text-muted-foreground">Upcoming practices, tournaments, and events.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-display text-lg">{monthLabel}</span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Wrestler tags */}
        {wrestlers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Showing events for:</span>
            {wrestlers.map(w => (
              <Badge key={w.id} variant="outline" className="bg-gold/10 text-gold border-gold/30">
                {w.full_name} — {w.program}
              </Badge>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : (
          <Tabs defaultValue="my-calendar">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="my-calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />My Calendar
              </TabsTrigger>
              <TabsTrigger value="club-calendar" className="flex items-center gap-2">
                <Users className="h-4 w-4" />All Club Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-calendar">
              <EventList events={myEvents} />
            </TabsContent>

            <TabsContent value="club-calendar">
              <EventList events={allEvents} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </ParentDashboardLayout>
  );
}
