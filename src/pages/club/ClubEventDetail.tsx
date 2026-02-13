import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClubData } from "@/components/layout/ClubLayout";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  FileText,
  Download,
  Image,
} from "lucide-react";

const eventData: Record<string, {
  title: string; date: string; time: string; location: string;
  wrestler: string; type: string; description: string;
  address?: string; notes?: string;
  attachments: { name: string; type: string; size: string }[];
}> = {
  "1": {
    title: "Regular Practice", date: "February 5, 2024", time: "5:00 PM - 6:00 PM",
    location: "Main Gym", wrestler: "Emma Johnson", type: "practice",
    description: "Standard youth wrestling practice session. Focus on takedowns and escapes this week. Please bring headgear and proper shoes.",
    notes: "Coach Martinez will be running warm-ups. Arrive 10 minutes early.",
    attachments: [],
  },
  "2": {
    title: "Regular Practice", date: "February 6, 2024", time: "4:00 PM - 5:30 PM",
    location: "Main Gym", wrestler: "Marcus Johnson", type: "practice",
    description: "Middle school wrestling practice. Working on par terre positions and conditioning.",
    attachments: [],
  },
  "3": {
    title: "Austin Youth Tournament", date: "February 10, 2024", time: "8:00 AM - 4:00 PM",
    location: "Austin Convention Center", wrestler: "Marcus & Emma Johnson", type: "tournament",
    address: "500 E Cesar Chavez St, Austin, TX 78701",
    description: "Annual Austin Youth Wrestling Tournament. Over 200 wrestlers expected across all age divisions. Weigh-ins begin at 7:00 AM. Wrestlers must have valid USA Wrestling cards.",
    notes: "Bring folding chairs, snacks, and water. Concessions will be available. Parking is $10 at the venue garage.",
    attachments: [
      { name: "Austin_Youth_Tournament_Flyer.pdf", type: "pdf", size: "2.4 MB" },
      { name: "Tournament_Bracket_Schedule.pdf", type: "pdf", size: "1.1 MB" },
      { name: "Venue_Map.png", type: "image", size: "850 KB" },
    ],
  },
};

export default function ClubEventDetail() {
  const { clubSlug, eventId } = useParams();
  const club = useClubData();
  const basePath = `/club/${clubSlug}`;
  const event = eventData[eventId || "1"];

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-display mb-4">EVENT NOT FOUND</h1>
        <Link to={`${basePath}/parent`}>
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const typeStyles = {
    practice: { bg: "bg-navy/10 text-navy", badge: "bg-navy/10 text-navy border-navy/20" },
    tournament: { bg: "bg-gold/20 text-gold", badge: "bg-gold/10 text-gold border-gold/20" },
    meeting: { bg: "bg-blue-500/20 text-blue-600", badge: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  };
  const style = typeStyles[event.type as keyof typeof typeStyles] || typeStyles.practice;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Link to={`${basePath}/parent`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Event Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className={`w-14 h-14 rounded-lg flex items-center justify-center shrink-0 ${style.bg}`}>
          {event.type === "tournament" ? <Trophy className="h-7 w-7" /> : <Calendar className="h-7 w-7" />}
        </div>
        <div>
          <Badge variant="outline" className={`mb-2 ${style.badge}`}>
            {event.type}
          </Badge>
          <h1 className="text-3xl font-display mb-1">{event.title.toUpperCase()}</h1>
          <p className="text-muted-foreground">{event.wrestler}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Details */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl font-display">DETAILS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="font-medium">{event.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium">{event.location}</p>
                  {event.address && <p className="text-xs text-muted-foreground">{event.address}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gold" />
                <div>
                  <p className="text-xs text-muted-foreground">Wrestler(s)</p>
                  <p className="font-medium">{event.wrestler}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl font-display">DESCRIPTION</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">{event.description}</p>
            {event.notes && (
              <div className="p-4 rounded-lg bg-gold/5 border border-gold/20">
                <p className="text-sm font-medium text-gold mb-1">Coach Notes</p>
                <p className="text-sm text-muted-foreground">{event.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attachments / Flyers */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl font-display">ATTACHMENTS & FLYERS</CardTitle>
          </CardHeader>
          <CardContent>
            {event.attachments.length > 0 ? (
              <div className="space-y-3">
                {event.attachments.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors">
                    <div className="flex items-center gap-3">
                      {file.type === "image" ? (
                        <Image className="h-5 w-5 text-gold" />
                      ) : (
                        <FileText className="h-5 w-5 text-gold" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No attachments for this event yet.</p>
                <p className="text-xs mt-1">Club admins can upload flyers, brackets, and other info here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
