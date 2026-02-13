import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useClubData } from "@/components/layout/ClubLayout";
import {
  Trophy,
  Calendar,
  Bell,
  CreditCard,
  FileText,
  User,
  LogOut,
  Plus,
  CheckCircle,
  Clock,
  MapPin,
  ChevronRight,
  ShoppingBag,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

const parentInfo = { name: "David Johnson", email: "david.johnson@email.com" };

const wrestlers = [
  { id: 1, name: "Marcus Johnson", age: 12, program: "Middle School", status: "active", nextPractice: "Tomorrow, 4:00 PM", attendance: 85, upcomingEvents: 2 },
  { id: 2, name: "Emma Johnson", age: 8, program: "Youth Wrestling", status: "active", nextPractice: "Today, 5:00 PM", attendance: 92, upcomingEvents: 1 },
];

const upcomingEvents = [
  { id: 1, title: "Regular Practice", date: "Feb 5, 2024", time: "5:00 PM - 6:00 PM", location: "Main Gym", wrestler: "Emma Johnson", type: "practice" },
  { id: 2, title: "Regular Practice", date: "Feb 6, 2024", time: "4:00 PM - 5:30 PM", location: "Main Gym", wrestler: "Marcus Johnson", type: "practice" },
  { id: 3, title: "Austin Youth Tournament", date: "Feb 10, 2024", time: "8:00 AM - 4:00 PM", location: "Austin Convention Center", wrestler: "Both", type: "tournament" },
];

const recentPayments = [
  { id: 1, description: "Middle School Registration", amount: 225, date: "Jan 15, 2024", status: "paid" },
  { id: 2, description: "Youth Wrestling Registration", amount: 175, date: "Jan 15, 2024", status: "paid" },
  { id: 3, description: "Tournament Fee - Austin Youth", amount: 35, date: "Feb 1, 2024", status: "pending" },
];

const announcements = [
  { id: 1, title: "Practice Cancelled Feb 8", message: "Due to facility maintenance, practice is cancelled on Thursday Feb 8.", date: "Feb 3, 2024", priority: "high" },
  { id: 2, title: "Tournament Registration Open", message: "Registration for the State Championship qualifier is now open.", date: "Feb 2, 2024", priority: "normal" },
];

export default function ClubParentDashboard() {
  const { clubSlug } = useParams();
  const club = useClubData();
  const basePath = `/club/${clubSlug}`;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display mb-2">WELCOME BACK, {parentInfo.name.split(" ")[0].toUpperCase()}</h1>
          <p className="text-muted-foreground">Manage your wrestlers, view schedules, and stay up to date.</p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gold text-navy font-bold">DJ</AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{parentInfo.name}</p>
            <p className="text-xs text-muted-foreground">{parentInfo.email}</p>
          </div>
        </div>
      </div>

      {/* Alert */}
      {announcements.some((a) => a.priority === "high") && (
        <Card className="mb-6 border-wrestling-red bg-wrestling-red/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-wrestling-red shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-wrestling-red">{announcements.find((a) => a.priority === "high")?.title}</p>
              <p className="text-sm text-muted-foreground">{announcements.find((a) => a.priority === "high")?.message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Wrestlers */}
          <Card className="shadow-card">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-xl font-display">MY WRESTLERS</CardTitle>
              <Link to={`${basePath}/programs`}>
                <Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-2" />Add Wrestler</Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {wrestlers.map((w) => (
                <div key={w.id} className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-navy text-white">{w.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{w.name}</h3>
                        <p className="text-sm text-muted-foreground">{w.program} • Age {w.age}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-wrestling-green/10 text-wrestling-green border-wrestling-green/20">{w.status}</Badge>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-gold" /><span>Next: {w.nextPractice}</span></div>
                    <div className="flex items-center gap-2"><Trophy className="h-4 w-4 text-gold" /><span>{w.upcomingEvents} upcoming</span></div>
                    <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-wrestling-green" /><span>{w.attendance}% attendance</span></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-xl font-display">UPCOMING SCHEDULE</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${event.type === "tournament" ? "bg-gold/20 text-gold" : "bg-navy/10 text-navy"}`}>
                    {event.type === "tournament" ? <Trophy className="h-6 w-6" /> : <Calendar className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span>{event.date}</span>
                      <span>{event.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
                    </div>
                    <Badge variant="secondary" className="mt-2 text-xs">{event.wrestler}</Badge>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-xl font-display">QUICK ACTIONS</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex-col h-auto py-4"><MessageSquare className="h-5 w-5 mb-2" /><span className="text-xs">Messages</span></Button>
              <Link to={`${basePath}/store`}><Button variant="outline" className="flex-col h-auto py-4 w-full"><ShoppingBag className="h-5 w-5 mb-2" /><span className="text-xs">Shop</span></Button></Link>
              <Button variant="outline" className="flex-col h-auto py-4"><FileText className="h-5 w-5 mb-2" /><span className="text-xs">Documents</span></Button>
              <Button variant="outline" className="flex-col h-auto py-4"><User className="h-5 w-5 mb-2" /><span className="text-xs">Profile</span></Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-xl font-display">PAYMENTS</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    {p.status === "paid" ? <CheckCircle className="h-5 w-5 text-wrestling-green" /> : <Clock className="h-5 w-5 text-gold" />}
                    <div><p className="text-sm font-medium">{p.description}</p><p className="text-xs text-muted-foreground">{p.date}</p></div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${p.amount}</p>
                    <Badge variant={p.status === "paid" ? "secondary" : "outline"} className={`text-xs ${p.status === "pending" ? "border-gold text-gold" : ""}`}>{p.status}</Badge>
                  </div>
                </div>
              ))}
              {recentPayments.some((p) => p.status === "pending") && (
                <Button variant="hero" className="w-full mt-2"><CreditCard className="h-4 w-4 mr-2" />Pay Outstanding Balance</Button>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader><CardTitle className="text-xl font-display">ANNOUNCEMENTS</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className={`p-3 rounded-lg ${a.priority === "high" ? "bg-wrestling-red/10 border border-wrestling-red/20" : "bg-secondary/50"}`}>
                  <div className="flex items-start gap-2">
                    <Bell className={`h-4 w-4 mt-0.5 ${a.priority === "high" ? "text-wrestling-red" : "text-gold"}`} />
                    <div>
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{a.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{a.date}</p>
                    </div>
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
