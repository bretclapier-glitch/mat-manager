import { useState } from "react";
import BaseballDashboardLayout from "@/components/layout/BaseballDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users, Calendar, Target } from "lucide-react";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface GameEvent { id: number; title: string; time: string; location: string; day: number; type: string; description?: string; opponent?: string; }

const events: GameEvent[] = [
  { id: 1, title: "10U Practice", time: "5:00 PM - 7:00 PM", location: "Diamond 1", day: 5, type: "practice", description: "Hitting drills and infield work." },
  { id: 2, title: "Thunder vs Eagles", time: "10:00 AM - 12:00 PM", location: "Eagles Field", day: 8, type: "game", opponent: "Eagles", description: "League game. Arrive 1 hour early for warmups." },
  { id: 3, title: "14U Tryouts", time: "9:00 AM - 12:00 PM", location: "Diamond 2", day: 9, type: "tryout", description: "Open tryouts for 14U travel team." },
  { id: 4, title: "12U Practice", time: "4:00 PM - 6:00 PM", location: "Diamond 1", day: 12, type: "practice" },
  { id: 5, title: "Thunder vs Lions", time: "2:00 PM - 4:00 PM", location: "Home Field", day: 15, type: "game", opponent: "Lions" },
];

const upcomingEvents = [
  { id: 1, title: "10U Practice", date: "Today", time: "5:00 PM", location: "Diamond 1", attendees: 14, type: "practice" },
  { id: 2, title: "Thunder vs Eagles", date: "Saturday", time: "10:00 AM", location: "Eagles Field", attendees: 15, type: "game" },
  { id: 3, title: "14U Tryouts", date: "Sunday", time: "9:00 AM", location: "Diamond 2", attendees: 22, type: "tryout" },
];

const generateCalendarDays = () => {
  const days: { day: number | null; events: GameEvent[] }[] = [];
  for (let i = 0; i < 4; i++) days.push({ day: null, events: [] });
  for (let i = 1; i <= 29; i++) days.push({ day: i, events: events.filter(e => e.day === i) });
  return days;
};

const typeColor = (type: string) => type === "practice" ? "bg-[hsl(150,45%,35%)]/20 text-[hsl(150,45%,35%)]" : type === "game" ? "bg-red-500/20 text-red-500" : "bg-blue-500/20 text-blue-600";

export default function BaseballSchedule() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedEvent, setSelectedEvent] = useState<GameEvent | null>(null);
  const calendarDays = generateCalendarDays();

  return (
    <BaseballDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display">SCHEDULE</h1>
            <p className="text-muted-foreground">Manage games, practices, and tryouts</p>
          </div>
          <Button className="bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white"><Plus className="h-4 w-4 mr-2" />Add Event</Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <CardTitle className="text-xl font-display">FEBRUARY 2024</CardTitle>
                <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
              </div>
              <div className="flex gap-2">
                <Button variant={view === "calendar" ? "default" : "outline"} size="sm" onClick={() => setView("calendar")}>Calendar</Button>
                <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>List</Button>
              </div>
            </CardHeader>
            <CardContent>
              {view === "calendar" ? (
                <div>
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map(d => <div key={d} className="text-center text-sm font-medium text-muted-foreground py-2">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((cell, i) => (
                      <div key={i} className={`min-h-24 p-1 border rounded-lg ${cell.day ? "bg-card hover:bg-secondary/50" : "bg-transparent border-transparent"} ${cell.day === 5 ? "ring-2 ring-[hsl(150,45%,35%)]" : ""}`}>
                        {cell.day && (
                          <>
                            <span className={`text-sm font-medium ${cell.day === 5 ? "text-[hsl(150,45%,35%)]" : ""}`}>{cell.day}</span>
                            <div className="space-y-1 mt-1">
                              {cell.events.slice(0, 2).map(ev => (
                                <button key={ev.id} onClick={() => setSelectedEvent(ev)} className={`block w-full text-left text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 ${typeColor(ev.type)}`}>{ev.title}</button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map(ev => (
                    <button key={ev.id} onClick={() => setSelectedEvent(ev)} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors w-full text-left">
                      <div className={`w-1 h-12 rounded-full ${ev.type === "practice" ? "bg-[hsl(150,45%,35%)]" : ev.type === "game" ? "bg-red-500" : "bg-blue-500"}`} />
                      <div className="flex-1">
                        <p className="font-medium">{ev.title}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ev.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.location}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-xl font-display">UPCOMING</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map(ev => (
                <button key={ev.id} onClick={() => setSelectedEvent(events.find(e => e.id === ev.id) || null)} className="block w-full text-left p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColor(ev.type)}`}>{ev.type}</span>
                    <span className="text-sm text-muted-foreground">{ev.date}</span>
                  </div>
                  <h4 className="font-semibold mb-2">{ev.title}</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Clock className="h-3 w-3" />{ev.time}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-3 w-3" />{ev.location}</div>
                    <div className="flex items-center gap-2"><Users className="h-3 w-3" />{ev.attendees} expected</div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <Dialog open={!!selectedEvent} onOpenChange={(open) => { if (!open) setSelectedEvent(null); }}>
          <DialogContent className="max-w-lg">
            {selectedEvent && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColor(selectedEvent.type)}`}>
                      {selectedEvent.type === "game" ? <Target className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-display">{selectedEvent.title.toUpperCase()}</DialogTitle>
                      <Badge variant="outline" className={`mt-1 capitalize ${typeColor(selectedEvent.type)}`}>{selectedEvent.type}</Badge>
                    </div>
                  </div>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[hsl(150,45%,35%)]" /><span>February {selectedEvent.day}, 2024</span></div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-[hsl(150,45%,35%)]" /><span>{selectedEvent.time}</span></div>
                    <div className="flex items-center gap-2 col-span-2"><MapPin className="h-4 w-4 text-[hsl(150,45%,35%)]" /><span>{selectedEvent.location}</span></div>
                  </div>
                  {selectedEvent.description && <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>}
                  <Button className="w-full bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white" onClick={() => setSelectedEvent(null)}>Close</Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </BaseballDashboardLayout>
  );
}
