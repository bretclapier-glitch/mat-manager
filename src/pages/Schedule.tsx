import { useState } from "react";
import AddEventDialog from "@/components/schedule/AddEventDialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  MapPin,
  Users
} from "lucide-react";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const currentMonth = "February 2024";

const events = [
  { id: 1, title: "Youth Practice", time: "4:00 PM - 5:30 PM", location: "Main Gym", day: 5, type: "practice" },
  { id: 2, title: "High School Practice", time: "6:00 PM - 8:00 PM", location: "Main Gym", day: 5, type: "practice" },
  { id: 3, title: "Parents Meeting", time: "6:00 PM", location: "Meeting Room", day: 6, type: "meeting" },
  { id: 4, title: "Varsity Dual Meet", time: "9:00 AM - 3:00 PM", location: "Away", day: 10, type: "competition" },
  { id: 5, title: "Youth Practice", time: "4:00 PM - 5:30 PM", location: "Main Gym", day: 12, type: "practice" },
];

const upcomingEvents = [
  { 
    title: "Youth Practice",
    date: "Today",
    time: "4:00 PM - 5:30 PM",
    location: "Main Gym",
    attendees: 24,
    type: "practice"
  },
  { 
    title: "High School Practice",
    date: "Today",
    time: "6:00 PM - 8:00 PM",
    location: "Main Gym",
    attendees: 18,
    type: "practice"
  },
  { 
    title: "Parents Meeting",
    date: "Tomorrow",
    time: "6:00 PM",
    location: "Meeting Room",
    attendees: 45,
    type: "meeting"
  },
  { 
    title: "Varsity Dual Meet vs Eagles",
    date: "Saturday",
    time: "9:00 AM - 3:00 PM",
    location: "Eagles High School",
    attendees: 14,
    type: "competition"
  },
];

// Generate calendar days
const generateCalendarDays = () => {
  const days = [];
  // February 2024 starts on Thursday (4), has 29 days
  const startDay = 4;
  const totalDays = 29;
  
  // Empty cells before first day
  for (let i = 0; i < startDay; i++) {
    days.push({ day: null, events: [] });
  }
  
  // Days of month
  for (let i = 1; i <= totalDays; i++) {
    days.push({ 
      day: i, 
      events: events.filter(e => e.day === i)
    });
  }
  
  return days;
};

export default function Schedule() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [addEventOpen, setAddEventOpen] = useState(false);
  const calendarDays = generateCalendarDays();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display">SCHEDULE</h1>
            <p className="text-muted-foreground">Manage practices, events, and competitions</p>
          </div>
          <Button variant="hero" onClick={() => setAddEventOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-xl font-display">{currentMonth.toUpperCase()}</CardTitle>
                <Button variant="outline" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={view === "calendar" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setView("calendar")}
                >
                  Calendar
                </Button>
                <Button 
                  variant={view === "list" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setView("list")}
                >
                  List
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {view === "calendar" ? (
                <div>
                  {/* Week days header */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map(day => (
                      <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((cell, index) => (
                      <div 
                        key={index}
                        className={`
                          min-h-24 p-1 border rounded-lg
                          ${cell.day ? "bg-card hover:bg-secondary/50 cursor-pointer" : "bg-transparent border-transparent"}
                          ${cell.day === 5 ? "ring-2 ring-gold" : ""}
                        `}
                      >
                        {cell.day && (
                          <>
                            <span className={`text-sm font-medium ${cell.day === 5 ? "text-gold" : ""}`}>
                              {cell.day}
                            </span>
                            <div className="space-y-1 mt-1">
                              {cell.events.slice(0, 2).map(event => (
                                <div 
                                  key={event.id}
                                  className={`text-xs px-1 py-0.5 rounded truncate ${
                                    event.type === "practice" ? "bg-gold/20 text-gold" :
                                    event.type === "competition" ? "bg-wrestling-red/20 text-wrestling-red" :
                                    "bg-blue-500/20 text-blue-600"
                                  }`}
                                >
                                  {event.title}
                                </div>
                              ))}
                              {cell.events.length > 2 && (
                                <div className="text-xs text-muted-foreground px-1">
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
                  {events.map(event => (
                    <div 
                      key={event.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className={`w-1 h-12 rounded-full ${
                        event.type === "practice" ? "bg-gold" :
                        event.type === "competition" ? "bg-wrestling-red" :
                        "bg-blue-500"
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events Sidebar */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl font-display">UPCOMING</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      event.type === "practice" ? "bg-gold/20 text-gold" :
                      event.type === "competition" ? "bg-wrestling-red/20 text-wrestling-red" :
                      "bg-blue-500/20 text-blue-600"
                    }`}>
                      {event.type}
                    </span>
                    <span className="text-sm text-muted-foreground">{event.date}</span>
                  </div>
                  <h4 className="font-semibold mb-2">{event.title}</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      {event.attendees} expected
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <AddEventDialog open={addEventOpen} onOpenChange={setAddEventOpen} />
      </div>
    </DashboardLayout>
  );
}
