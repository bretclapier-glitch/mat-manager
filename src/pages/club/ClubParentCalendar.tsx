import { useParams } from "react-router-dom";
import ParentDashboardLayout from "@/components/layout/ParentDashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Clock, MapPin, Trophy, ChevronLeft, ChevronRight, Users } from "lucide-react";

const allClubEvents = [
  { id: 1, title: "Youth Practice", date: "Feb 5", time: "5:00 PM - 6:00 PM", location: "Main Gym", wrestler: "All Youth", type: "practice" },
  { id: 2, title: "Middle School Practice", date: "Feb 6", time: "4:00 PM - 5:30 PM", location: "Main Gym", wrestler: "All Middle School", type: "practice" },
  { id: 3, title: "Austin Youth Tournament", date: "Feb 10", time: "8:00 AM - 4:00 PM", location: "Austin Convention Center", wrestler: "All", type: "tournament" },
  { id: 4, title: "Youth Practice", date: "Feb 12", time: "5:00 PM - 6:00 PM", location: "Main Gym", wrestler: "All Youth", type: "practice" },
  { id: 5, title: "Middle School Practice", date: "Feb 13", time: "4:00 PM - 5:30 PM", location: "Main Gym", wrestler: "All Middle School", type: "practice" },
  { id: 6, title: "Parents Meeting", date: "Feb 15", time: "6:00 PM - 7:00 PM", location: "Meeting Room", wrestler: "—", type: "meeting" },
  { id: 7, title: "High School Open Mat", date: "Feb 17", time: "6:00 PM - 8:00 PM", location: "Main Gym", wrestler: "All High School", type: "practice" },
  { id: 8, title: "Beginners Clinic", date: "Feb 19", time: "5:00 PM - 6:00 PM", location: "Room B", wrestler: "Beginners", type: "practice" },
];

const myEvents = [
  { id: 1, title: "Youth Practice", date: "Feb 5", time: "5:00 PM - 6:00 PM", location: "Main Gym", wrestler: "Emma", type: "practice" },
  { id: 2, title: "Middle School Practice", date: "Feb 6", time: "4:00 PM - 5:30 PM", location: "Main Gym", wrestler: "Marcus", type: "practice" },
  { id: 3, title: "Austin Youth Tournament", date: "Feb 10", time: "8:00 AM - 4:00 PM", location: "Austin Convention Center", wrestler: "Both", type: "tournament" },
  { id: 4, title: "Youth Practice", date: "Feb 12", time: "5:00 PM - 6:00 PM", location: "Main Gym", wrestler: "Emma", type: "practice" },
  { id: 5, title: "Middle School Practice", date: "Feb 13", time: "4:00 PM - 5:30 PM", location: "Main Gym", wrestler: "Marcus", type: "practice" },
  { id: 6, title: "Parents Meeting", date: "Feb 15", time: "6:00 PM - 7:00 PM", location: "Meeting Room", wrestler: "—", type: "meeting" },
];

function EventList({ events, basePath }: { events: typeof allClubEvents; basePath: string }) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-0 divide-y">
        {events.map((event) => (
          <a key={event.id} href={`${basePath}/parent/event/${event.id}`} className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors">
            <div className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center text-center ${
              event.type === "tournament" ? "bg-gold/20 text-gold" : event.type === "meeting" ? "bg-blue-500/20 text-blue-600" : "bg-navy/10 text-navy"
            }`}>
              {event.type === "tournament" ? <Trophy className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
              <span className="text-xs font-bold mt-0.5">{event.date.split(" ")[1]}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{event.title}</h4>
                <Badge variant="outline" className="text-xs capitalize">{event.type}</Badge>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{event.time}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">{event.wrestler}</Badge>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}

export default function ClubParentCalendar() {
  const { clubSlug } = useParams();
  const basePath = `/wrestling/club/${clubSlug}`;

  return (
    <ParentDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display">SCHEDULE</h1>
            <p className="text-muted-foreground">Upcoming practices, tournaments, and events.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
            <span className="font-display text-lg">FEBRUARY 2024</span>
            <Button variant="outline" size="icon"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>

        <Tabs defaultValue="my-calendar">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="my-calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />My Calendar
            </TabsTrigger>
            <TabsTrigger value="club-calendar" className="flex items-center gap-2">
              <Users className="h-4 w-4" />Club Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-calendar">
            <EventList events={myEvents} basePath={basePath} />
          </TabsContent>

          <TabsContent value="club-calendar">
            <EventList events={allClubEvents} basePath={basePath} />
          </TabsContent>
        </Tabs>
      </div>
    </ParentDashboardLayout>
  );
}
