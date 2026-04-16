import { useState, useEffect } from "react";
import AddEventDialog from "@/components/schedule/AddEventDialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  MapPin,
  Trophy,
  Calendar as CalendarIcon,
  Loader2,
  Pencil,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type EventData = {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location: string | null;
  event_type: string;
  description: string | null;
  club_id: string;
};

const typeColor = (type: string) =>
  type === "practice" ? "bg-gold/20 text-gold" :
  type === "tournament" ? "bg-wrestling-red/20 text-wrestling-red" :
  type === "meeting" ? "bg-blue-500/20 text-blue-600" :
  "bg-secondary text-muted-foreground";

const typeIcon = (type: string) =>
  type === "tournament" ? <Trophy className="h-5 w-5" /> : <CalendarIcon className="h-5 w-5" />;

const EVENT_TYPES = ["practice", "tournament", "meeting", "event"];

export default function Schedule() {
  const { profile } = useAuth();
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState<{ day: number; events: EventData[] } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editType, setEditType] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (profile?.club_id) loadEvents(profile.club_id);
  }, [profile, currentDate]);

  async function loadEvents(clubId: string) {
    setLoading(true);
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59).toISOString();
    const { data, error } = await supabase
      .from('events').select('*').eq('club_id', clubId)
      .gte('start_time', startOfMonth).lte('start_time', endOfMonth)
      .order('start_time');
    if (!error) setEvents((data ?? []) as EventData[]);
    setLoading(false);
  }

  function openEventDetail(event: EventData) {
    setSelectedEvent(event);
    setEditMode(false);
    setSelectedDayEvents(null);
  }

  function openEditMode(event: EventData) {
    setSelectedEvent(event);
    setEditMode(true);
    const start = new Date(event.start_time);
    const end = new Date(event.end_time);
    setEditTitle(event.title);
    setEditType(event.event_type);
    setEditDate(start.toISOString().slice(0, 10));
    setEditStartTime(start.toTimeString().slice(0, 5));
    setEditEndTime(end.toTimeString().slice(0, 5));
    setEditLocation(event.location ?? "");
    setEditDescription(event.description ?? "");
  }

  async function saveEdit() {
    if (!selectedEvent || !editTitle.trim()) return;
    setSaving(true);
    try {
      const startDateTime = `${editDate}T${editStartTime}:00`;
      const endDateTime = `${editDate}T${editEndTime || editStartTime}:00`;
      const { error } = await supabase.from('events').update({
        title: editTitle,
        event_type: editType,
        start_time: startDateTime,
        end_time: endDateTime,
        location: editLocation || null,
        description: editDescription || null,
      }).eq('id', selectedEvent.id);
      if (error) throw error;
      toast.success("Event updated");
      setSelectedEvent(null);
      setEditMode(false);
      if (profile?.club_id) loadEvents(profile.club_id);
    } catch {
      toast.error("Failed to update event");
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(id: string) {
    if (!confirm("Delete this event?")) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) { toast.error("Failed to delete event"); return; }
    toast.success("Event deleted");
    setSelectedEvent(null);
    setSelectedDayEvents(null);
    if (profile?.club_id) loadEvents(profile.club_id);
  }

  function prevMonth() { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); }
  function nextMonth() { setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); }

  const monthLabel = currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' }).toUpperCase();

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  }

  // Build calendar grid
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const calendarCells: { day: number | null; events: EventData[] }[] = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push({ day: null, events: [] });
  for (let d = 1; d <= daysInMonth; d++) {
    const dayEvents = events.filter(e => new Date(e.start_time).getDate() === d);
    calendarCells.push({ day: d, events: dayEvents });
  }

  const today = new Date().getDate();
  const isCurrentMonth = currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
  const upcomingEvents = events.filter(e => new Date(e.start_time) >= new Date()).slice(0, 4);

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

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                  <CardTitle className="text-xl font-display">{monthLabel}</CardTitle>
                  <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
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
                      {calendarCells.map((cell, index) => (
                        <div
                          key={index}
                          onClick={() => cell.day && cell.events.length > 0 && setSelectedDayEvents({ day: cell.day, events: cell.events })}
                          className={`min-h-24 p-1 border rounded-lg transition-colors ${
                            cell.day ? "bg-card hover:bg-secondary/50" : "bg-transparent border-transparent"
                          } ${cell.day && cell.events.length > 0 ? "cursor-pointer" : ""} ${
                            isCurrentMonth && cell.day === today ? "ring-2 ring-gold" : ""
                          }`}
                        >
                          {cell.day && (
                            <>
                              <span className={`text-sm font-medium ${isCurrentMonth && cell.day === today ? "text-gold" : ""}`}>
                                {cell.day}
                              </span>
                              <div className="space-y-1 mt-1">
                                {cell.events.slice(0, 2).map(event => (
                                  <button
                                    key={event.id}
                                    onClick={(e) => { e.stopPropagation(); openEventDetail(event); }}
                                    className={`block w-full text-left text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 ${typeColor(event.event_type)}`}
                                  >
                                    {event.title}
                                  </button>
                                ))}
                                {cell.events.length > 2 && (
                                  <div className="text-xs text-gold font-medium px-1 cursor-pointer">
                                    +{cell.events.length - 2} more
                                  </div>
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
                    {events.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <CalendarIcon className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p>No events this month</p>
                        <Button variant="outline" size="sm" className="mt-3" onClick={() => setAddEventOpen(true)}>Add your first event</Button>
                      </div>
                    ) : (
                      events.map(event => (
                        <button
                          key={event.id}
                          onClick={() => openEventDetail(event)}
                          className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors w-full text-left cursor-pointer"
                        >
                          <div className={`w-1 h-12 rounded-full ${
                            event.event_type === "practice" ? "bg-gold" :
                            event.event_type === "tournament" ? "bg-wrestling-red" : "bg-blue-500"
                          }`} />
                          <div className="flex-1">
                            <p className="font-medium">{event.title}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTime(event.start_time)} – {formatTime(event.end_time)}</span>
                              {event.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">{new Date(event.start_time).getDate()}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-xl font-display">UPCOMING</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No upcoming events</p>
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <button key={event.id} onClick={() => openEventDetail(event)}
                      className="block w-full text-left p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColor(event.event_type)}`}>{event.event_type}</span>
                        <span className="text-sm text-muted-foreground">{formatDate(event.start_time)}</span>
                      </div>
                      <h4 className="font-semibold mb-2">{event.title}</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2"><Clock className="h-3 w-3" />{formatTime(event.start_time)} – {formatTime(event.end_time)}</div>
                        {event.location && <div className="flex items-center gap-2"><MapPin className="h-3 w-3" />{event.location}</div>}
                      </div>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <AddEventDialog
          open={addEventOpen}
          onOpenChange={(open) => {
            setAddEventOpen(open);
            if (!open && profile?.club_id) loadEvents(profile.club_id);
          }}
        />

        {/* Day Detail Dialog */}
        <Dialog open={!!selectedDayEvents} onOpenChange={(open) => { if (!open) setSelectedDayEvents(null); }}>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            {selectedDayEvents && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display text-xl">
                    {currentDate.toLocaleDateString([], { month: 'long' })} {selectedDayEvents.day}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3 mt-2">
                  {selectedDayEvents.events.map(event => (
                    <div key={event.id} className={`p-3 rounded-lg ${typeColor(event.event_type)}`}>
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{event.title}</h4>
                        <div className="flex gap-1">
                          <button onClick={() => { setSelectedDayEvents(null); openEditMode(event); }}
                            className="p-1 hover:bg-black/10 rounded">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => deleteEvent(event.id)}
                            className="p-1 hover:bg-black/10 rounded text-wrestling-red">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs mt-1 space-y-0.5 opacity-80">
                        <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatTime(event.start_time)} – {formatTime(event.end_time)}</div>
                        {event.location && <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</div>}
                        {event.description && <p className="mt-1">{event.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-2" onClick={() => setSelectedDayEvents(null)}>Close</Button>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Event Detail / Edit Dialog */}
        <Dialog open={!!selectedEvent} onOpenChange={(open) => { if (!open) { setSelectedEvent(null); setEditMode(false); } }}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            {selectedEvent && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeColor(selectedEvent.event_type)}`}>
                        {typeIcon(selectedEvent.event_type)}
                      </div>
                      <div>
                        <DialogTitle className="text-xl font-display">{selectedEvent.title.toUpperCase()}</DialogTitle>
                        <Badge variant="outline" className={`mt-1 capitalize ${typeColor(selectedEvent.event_type)}`}>
                          {selectedEvent.event_type}
                        </Badge>
                      </div>
                    </div>
                    {!editMode && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEditMode(selectedEvent)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-destructive hover:text-destructive"
                          onClick={() => deleteEvent(selectedEvent.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogHeader>

                {editMode ? (
                  <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={editType} onValueChange={setEditType}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {EVENT_TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input type="time" value={editStartTime} onChange={(e) => setEditStartTime(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>End Time</Label>
                      <Input type="time" value={editEndTime} onChange={(e) => setEditEndTime(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input value={editLocation} onChange={(e) => setEditLocation(e.target.value)} placeholder="Location" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3} />
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="flex-1" onClick={() => setEditMode(false)}>
                        <X className="h-4 w-4 mr-2" />Cancel
                      </Button>
                      <Button variant="hero" className="flex-1" onClick={saveEdit} disabled={saving}>
                        {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5 mt-2">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-gold" />
                        <span>{formatDate(selectedEvent.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gold" />
                        <span>{formatTime(selectedEvent.start_time)} – {formatTime(selectedEvent.end_time)}</span>
                      </div>
                      {selectedEvent.location && (
                        <div className="flex items-center gap-2 col-span-2">
                          <MapPin className="h-4 w-4 text-gold" />
                          <span>{selectedEvent.location}</span>
                        </div>
                      )}
                    </div>
                    {selectedEvent.description && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Description</h4>
                        <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                      </div>
                    )}
                    <Button variant="outline" className="w-full" onClick={() => setSelectedEvent(null)}>Close</Button>
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
