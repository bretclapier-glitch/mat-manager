import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ParentDashboardLayout from "@/components/layout/ParentDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Calendar, Clock, MapPin, Trophy,
  ChevronLeft, ChevronRight, Users, Loader2,
  List, LayoutGrid,
} from "lucide-react";
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
  program_id: string | null;
};

type Wrestler = {
  id: string;
  full_name: string;
  program: string;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function typeColor(type: string) {
  if (type === "tournament") return "bg-gold/20 text-gold";
  if (type === "meeting") return "bg-blue-500/20 text-blue-600";
  return "bg-navy/10 text-navy";
}

export default function ClubParentCalendar() {
  const { clubSlug } = useParams();
  const { user } = useAuth();

  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [wrestlers, setWrestlers] = useState<Wrestler[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (clubSlug) loadData(clubSlug);
  }, [clubSlug, user, currentDate]);

  async function loadData(slug: string) {
    setLoading(true);
    try {
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

      const allEventsData = (eventsData ?? []) as Event[];
      const wrestlerList = (wrestlerData ?? []) as Wrestler[];

      setAllEvents(allEventsData);
      setWrestlers(wrestlerList);

      // Filter My Calendar to only show events for enrolled programs
      if (wrestlerList.length > 0) {
        const programNames = wrestlerList.map(w => w.program);
        const { data: programData } = await supabase
          .from('programs')
          .select('id, name')
          .eq('club_id', club.id)
          .in('name', programNames);

        const programIds = new Set((programData ?? []).map(p => p.id));

        // Show: non-practice events (tournaments/meetings) + practice events for enrolled programs
        const filtered = allEventsData.filter(e =>
          e.event_type !== 'practice' || (e.program_id && programIds.has(e.program_id))
        );
        setMyEvents(filtered);
      } else {
        setMyEvents([]);
      }
    } catch (err) {
      console.error('Calendar load error:', err);
    } finally {
      setLoading(false);
    }
  }

  function prevMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
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

  const monthLabel = currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' }).toUpperCase();

  // Calendar grid data
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

  function buildCalendarCells(events: Event[]) {
    const cells: { day: number | null; events: Event[] }[] = [];
    for (let i = 0; i < firstDay; i++) cells.push({ day: null, events: [] });
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEvents = events.filter(e => new Date(e.start_time).getDate() === d);
      cells.push({ day: d, events: dayEvents });
    }
    return cells;
  }

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
            <div
              key={event.id}
              className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
              onClick={() => setSelectedEvent(event)}
            >
              <div className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center text-center ${typeColor(event.event_type)}`}>
                {event.event_type === "tournament" ? <Trophy className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                <span className="text-xs font-bold mt-0.5">{new Date(event.start_time).getDate()}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{event.title}</h4>
                  <Badge variant="outline" className="text-xs capitalize">{event.event_type}</Badge>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTime(event.start_time)} – {formatTime(event.end_time)}</span>
                  {event.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>}
                </div>
              </div>
              <Badge variant="secondary" className="text-xs">{formatDate(event.start_time)}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  function CalendarGrid({ events }: { events: Event[] }) {
    const cells = buildCalendarCells(events);
    return (
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, i) => (
              <div
                key={i}
                className={`min-h-20 p-1 rounded-lg border transition-colors ${
                  cell.day ? "bg-card hover:bg-secondary/30" : "bg-transparent border-transparent"
                } ${isCurrentMonth && cell.day === today.getDate() ? "ring-2 ring-gold border-gold" : "border-border/50"}`}
              >
                {cell.day && (
                  <>
                    <span className={`text-sm font-medium block mb-1 ${isCurrentMonth && cell.day === today.getDate() ? "text-gold" : ""}`}>
                      {cell.day}
                    </span>
                    <div className="space-y-0.5">
                      {cell.events.slice(0, 3).map(event => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`w-full text-left text-xs px-1 py-0.5 rounded truncate ${typeColor(event.event_type)}`}
                        >
                          {event.title}
                        </button>
                      ))}
                      {cell.events.length > 3 && (
                        <span className="text-xs text-muted-foreground px-1">+{cell.events.length - 3}</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <span className="text-xs text-muted-foreground">Legend:</span>
            {[
              { label: "Practice", dot: "bg-navy" },
              { label: "Tournament", dot: "bg-gold" },
              { label: "Meeting", dot: "bg-blue-500" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${item.dot}`} />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ParentDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display">SCHEDULE</h1>
              <p className="text-muted-foreground">Upcoming practices, tournaments, and events.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="font-display text-sm min-w-36 text-center">{monthLabel}</span>
              <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
          {/* View toggle on its own row */}
          <div className="flex items-center border rounded-lg overflow-hidden w-fit">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 flex items-center gap-1.5 text-sm transition-colors ${
                viewMode === "list" ? "bg-gold text-navy font-medium" : "hover:bg-secondary"
              }`}
            >
              <List className="h-4 w-4" />List
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 flex items-center gap-1.5 text-sm transition-colors ${
                viewMode === "calendar" ? "bg-gold text-navy font-medium" : "hover:bg-secondary"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />Calendar
            </button>
          </div>
        </div>

        {/* Wrestler tags */}
        {wrestlers.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
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
              {viewMode === "list" ? <EventList events={myEvents} /> : <CalendarGrid events={myEvents} />}
            </TabsContent>
            <TabsContent value="club-calendar">
              {viewMode === "list" ? <EventList events={allEvents} /> : <CalendarGrid events={allEvents} />}
            </TabsContent>
          </Tabs>
        )}

        {/* Event detail modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelectedEvent(null)}>
            <Card className="max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${typeColor(selectedEvent.event_type)}`}>
                    {selectedEvent.event_type === "tournament" ? <Trophy className="h-6 w-6" /> : <Calendar className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="font-display text-lg">{selectedEvent.title.toUpperCase()}</h3>
                    <Badge variant="outline" className="text-xs capitalize mt-1">{selectedEvent.event_type}</Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4 text-gold" />
                    <span>{formatDate(selectedEvent.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-gold" />
                    <span>{formatTime(selectedEvent.start_time)} – {formatTime(selectedEvent.end_time)}</span>
                  </div>
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 text-gold" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                </div>
                <Button variant="outline" className="w-full" onClick={() => setSelectedEvent(null)}>Close</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ParentDashboardLayout>
  );
}
