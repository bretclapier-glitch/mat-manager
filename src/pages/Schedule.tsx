import { useState } from "react";
import AddEventDialog from "@/components/schedule/AddEventDialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  MapPin,
  Users,
  FileText,
  Download,
  Edit,
  Trophy,
  Calendar as CalendarIcon,
} from "lucide-react";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const currentMonth = "February 2024";

interface EventData {
  id: number;
  title: string;
  time: string;
  location: string;
  day: number;
  type: string;
  description?: string;
  coachNotes?: string;
  attendees?: number;
  attachments?: { name: string; type: string }[];
}

const events: EventData[] = [
  { id: 1, title: "Youth Practice", time: "4:00 PM - 5:30 PM", location: "Main Gym", day: 5, type: "practice", description: "Regular youth practice session focusing on fundamentals and technique.", coachNotes: "Work on single-leg takedowns and bottom position escapes.", attendees: 24, attachments: [] },
  { id: 2, title: "High School Practice", time: "6:00 PM - 8:00 PM", location: "Main Gym", day: 5, type: "practice", description: "Varsity and JV combined practice with live wrestling.", coachNotes: "Film review first 30 mins, then live rounds.", attendees: 18, attachments: [] },
  { id: 3, title: "Parents Meeting", time: "6:00 PM", location: "Meeting Room", day: 6, type: "meeting", description: "Monthly parents meeting to discuss upcoming season schedule and fundraising.", attendees: 45, attachments: [{ name: "Season Schedule.pdf", type: "pdf" }, { name: "Fundraiser Info.pdf", type: "pdf" }] },
  { id: 4, title: "Varsity Dual Meet", time: "9:00 AM - 3:00 PM", location: "Eagles High School, 1234 Eagle Dr, Austin TX", day: 10, type: "competition", description: "Dual meet against the Eagles. Weigh-ins at 8:00 AM.", coachNotes: "Bring singlets and headgear. Bus leaves at 7:00 AM from Main Gym.", attendees: 14, attachments: [{ name: "Tournament Bracket.pdf", type: "pdf" }, { name: "Venue Map.png", type: "image" }] },
  { id: 5, title: "Youth Practice", time: "4:00 PM - 5:30 PM", location: "Main Gym", day: 12, type: "practice", description: "Regular youth practice session.", coachNotes: "Focus on neutral position and stance.", attendees: 24, attachments: [] },
];

const upcomingEvents = [
  { id: 1, title: "Youth Practice", date: "Today", time: "4:00 PM - 5:30 PM", location: "Main Gym", attendees: 24, type: "practice" },
  { id: 2, title: "High School Practice", date: "Today", time: "6:00 PM - 8:00 PM", location: "Main Gym", attendees: 18, type: "practice" },
  { id: 3, title: "Parents Meeting", date: "Tomorrow", time: "6:00 PM", location: "Meeting Room", attendees: 45, type: "meeting" },
  { id: 4, title: "Varsity Dual Meet vs Eagles", date: "Saturday", time: "9:00 AM - 3:00 PM", location: "Eagles High School", attendees: 14, type: "competition" },
];

const generateCalendarDays = () => {
  const days: { day: number | null; events: EventData[] }[] = [];
  const startDay = 4;
  const totalDays = 29;
  for (let i = 0; i < startDay; i++) days.push({ day: null, events: [] });
  for (let i = 1; i <= totalDays; i++) days.push({ day: i, events: events.filter(e => e.day === i) });
  return days;
};

const typeColor = (type: string) =>
  type === "practice" ? "bg-gold/20 text-gold" :
  type === "competition" ? "bg-wrestling-red/20 text-wrestling-red" :
  "bg-blue-500/20 text-blue-600";

const typeIcon = (type: string) =>
  type === "competition" ? <Trophy className="h-5 w-5" /> : <CalendarIcon className="h-5 w-5" />;

export default function Schedule() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const calendarDays = generateCalendarDays();

  const openEvent = (eventId: number) => {
    const ev = events.find(e => e.id === eventId);
    if (ev) setSelectedEvent(ev);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display">SCHEDULE</h1>
            <p className="text-muted-foreground">Manage practices, events, and competitions</p>
          </div>
          <Button variant="hero" onClick={() => setAddEventOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />Add Event
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
                <CardTitle className="text-xl font-display">{currentMonth.toUpperCase()}</CardTitle>
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
                    {weekDays.map(day => (
                      <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">{day}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((cell, index) => (
                      <div key={index} className={`min-h-24 p-1 border rounded-lg ${cell.day ? "bg-card hover:bg-secondary/50" : "bg-transparent border-transparent"} ${cell.day === 5 ? "ring-2 ring-gold" : ""}`}>
                        {cell.day && (
                          <>
                            <span className={`text-sm font-medium ${cell.day === 5 ? "text-gold" : ""}`}>{cell.day}</span>
                            <div className="space-y-1 mt-1">
                              {cell.events.slice(0, 2).map(event => (
                                <button
                                  key={event.id}
                                  onClick={() => openEvent(event.id)}
                                  className={`block w-full text-left text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 ${typeColor(event.type)}`}
                                >
                                  {event.title}
                                </button>
                              ))}
                              {cell.events.length > 2 && (
                                <div className="text-xs text-muted-foreground px-1">+{cell.events.length - 2} more</div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map(event => (
                    <button
                      key={event.id}
                      onClick={() => openEvent(event.id)}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors w-full text-left cursor-pointer"
                    >
                      <div className={`w-1 h-12 rounded-full ${
                        event.type === "practice" ? "bg-gold" : event.type === "competition" ? "bg-wrestling-red" : "bg-blue-500"
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">Feb {event.day}</span>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-xl font-display">UPCOMING</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => openEvent(event.id)}
                  className="block w-full text-left p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColor(event.type)}`}>{event.type}</span>
                    <span className="text-sm text-muted-foreground">{event.date}</span>
                  </div>
                  <h4 className="font-semibold mb-2">{event.title}</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Clock className="h-3 w-3" />{event.time}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-3 w-3" />{event.location}</div>
                    <div className="flex items-center gap-2"><Users className="h-3 w-3" />{event.attendees} expected</div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <AddEventDialog open={addEventOpen} onOpenChange={setAddEventOpen} />

        {/* Event Detail Dialog */}
        <Dialog open={!!selectedEvent} onOpenChange={(open) => { if (!open) setSelectedEvent(null); }}>
          <DialogContent className="max-w-lg">
            {selectedEvent && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedEvent.type === "competition" ? "bg-wrestling-red/20 text-wrestling-red" :
                      selectedEvent.type === "practice" ? "bg-gold/20 text-gold" :
                      "bg-blue-500/20 text-blue-600"
                    }`}>
                      {typeIcon(selectedEvent.type)}
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-display">{selectedEvent.title.toUpperCase()}</DialogTitle>
                      <Badge variant="outline" className={`mt-1 capitalize ${typeColor(selectedEvent.type)}`}>{selectedEvent.type}</Badge>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-gold" /><span>February {selectedEvent.day}, 2024</span></div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-gold" /><span>{selectedEvent.time}</span></div>
                    <div className="flex items-center gap-2 col-span-2"><MapPin className="h-4 w-4 text-gold" /><span>{selectedEvent.location}</span></div>
                    {selectedEvent.attendees && (
                      <div className="flex items-center gap-2"><Users className="h-4 w-4 text-gold" /><span>{selectedEvent.attendees} expected</span></div>
                    )}
                  </div>

                  {selectedEvent.description && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Description</h4>
                      <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                    </div>
                  )}

                  {selectedEvent.coachNotes && (
                    <div className="p-3 rounded-lg bg-gold/10 border border-gold/20">
                      <h4 className="text-sm font-semibold mb-1 flex items-center gap-2"><Edit className="h-3 w-3 text-gold" />Coach Notes</h4>
                      <p className="text-sm text-muted-foreground">{selectedEvent.coachNotes}</p>
                    </div>
                  )}

                  {selectedEvent.attachments && selectedEvent.attachments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><FileText className="h-3 w-3" />Attachments</h4>
                      <div className="space-y-2">
                        {selectedEvent.attachments.map((att, i) => (
                          <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
                            <div className="flex items-center gap-2 text-sm">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>{att.name}</span>
                            </div>
                            <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button variant="hero" className="flex-1"><Edit className="h-4 w-4 mr-2" />Edit Event</Button>
                    <Button variant="outline" onClick={() => setSelectedEvent(null)}>Close</Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
