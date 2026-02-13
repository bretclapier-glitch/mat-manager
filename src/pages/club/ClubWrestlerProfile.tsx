import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useClubData } from "@/components/layout/ClubLayout";
import {
  ArrowLeft,
  Trophy,
  Calendar,
  CheckCircle,
  ExternalLink,
  Plus,
  User,
  Award,
  TrendingUp,
} from "lucide-react";

const wrestlerData: Record<string, {
  name: string; age: number; program: string; status: string;
  weight: string; experience: string; attendance: number;
  record: string; flowrestlingId: string;
  achievements: { title: string; date: string }[];
  enrolledPrograms: { id: number; name: string; schedule: string }[];
}> = {
  "1": {
    name: "Marcus Johnson", age: 12, program: "Middle School", status: "active",
    weight: "105 lbs", experience: "3 years", attendance: 85,
    record: "15-4", flowrestlingId: "marcus-johnson-12345",
    achievements: [
      { title: "2nd Place - Austin Youth Open", date: "Jan 2024" },
      { title: "1st Place - Central TX Invitational", date: "Dec 2023" },
      { title: "Most Improved Wrestler", date: "Nov 2023" },
    ],
    enrolledPrograms: [
      { id: 1, name: "Middle School Wrestling", schedule: "Mon/Wed/Fri 4:00-5:30 PM" },
    ],
  },
  "2": {
    name: "Emma Johnson", age: 8, program: "Youth Wrestling", status: "active",
    weight: "65 lbs", experience: "1 year", attendance: 92,
    record: "8-2", flowrestlingId: "emma-johnson-67890",
    achievements: [
      { title: "3rd Place - Youth State Qualifier", date: "Jan 2024" },
      { title: "Rookie of the Year", date: "Dec 2023" },
    ],
    enrolledPrograms: [
      { id: 2, name: "Youth Wrestling", schedule: "Tue/Thu 5:00-6:00 PM" },
    ],
  },
};

const availablePrograms = [
  { id: 3, name: "Summer Wrestling Camp", dates: "Jun 10-14, 2024", price: 150 },
  { id: 4, name: "Competition Team", dates: "Year-round", price: 50 },
  { id: 5, name: "Private Lessons", dates: "Flexible", price: 75 },
];

export default function ClubWrestlerProfile() {
  const { clubSlug, wrestlerId } = useParams();
  const club = useClubData();
  const basePath = `/wrestling/club/${clubSlug}`;
  const wrestler = wrestlerData[wrestlerId || "1"];

  if (!wrestler) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-display mb-4">WRESTLER NOT FOUND</h1>
        <Link to={`${basePath}/parent`}>
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link to={`${basePath}/parent`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="bg-navy text-white text-2xl font-bold">
            {wrestler.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
            <h1 className="text-3xl font-display">{wrestler.name.toUpperCase()}</h1>
            <Badge variant="outline" className="bg-wrestling-green/10 text-wrestling-green border-wrestling-green/20 w-fit">
              {wrestler.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mb-3">
            {wrestler.program} • Age {wrestler.age} • {wrestler.weight}
          </p>
          <a
            href={`https://www.flowrestling.org/people/${wrestler.flowrestlingId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on FloWrestling
            </Button>
          </a>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { label: "Record", value: wrestler.record, icon: Trophy },
              { label: "Attendance", value: `${wrestler.attendance}%`, icon: CheckCircle },
              { label: "Experience", value: wrestler.experience, icon: TrendingUp },
              { label: "Weight", value: wrestler.weight, icon: User },
            ].map((stat) => (
              <Card key={stat.label} className="shadow-card">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="font-bold text-lg">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Enrolled Programs */}
          <Card className="shadow-card">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-xl font-display">ENROLLED PROGRAMS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {wrestler.enrolledPrograms.map((prog) => (
                <div key={prog.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gold" />
                    <div>
                      <p className="font-medium">{prog.name}</p>
                      <p className="text-sm text-muted-foreground">{prog.schedule}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl font-display">ACHIEVEMENTS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {wrestler.achievements.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <Award className="h-5 w-5 text-gold" />
                  <div>
                    <p className="font-medium text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar — Register for More */}
        <div>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl font-display">ADD PROGRAMS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Register {wrestler.name.split(" ")[0]} for additional programs:
              </p>
              {availablePrograms.map((prog) => (
                <div key={prog.id} className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors">
                  <h4 className="font-medium text-sm">{prog.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{prog.dates}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gold">${prog.price}/mo</span>
                    <Link to={`${basePath}/register/${prog.id}`}>
                      <Button size="sm" variant="outline">
                        <Plus className="h-3 w-3 mr-1" />
                        Register
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
