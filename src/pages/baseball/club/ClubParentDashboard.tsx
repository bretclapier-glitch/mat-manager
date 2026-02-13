import { Link, useParams } from "react-router-dom";
import BaseballParentDashboardLayout from "@/components/layout/BaseballParentDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, CreditCard, Plus, CheckCircle, Clock, MapPin, ChevronRight, ShoppingBag, MessageSquare, Target, Bell, AlertCircle, User } from "lucide-react";

const players = [
  { id: 1, name: "Jake Thompson", age: 10, team: "10U Travel", position: "SS/P", status: "active", nextGame: "Saturday, 10:00 AM", battingAvg: ".385", gamesPlayed: 12 },
  { id: 2, name: "Lily Thompson", age: 8, team: "8U Rec", position: "OF", status: "active", nextGame: "Saturday, 9:00 AM", battingAvg: ".310", gamesPlayed: 8 },
];

const upcomingEvents = [
  { id: 1, title: "10U Practice", date: "Feb 5, 2024", time: "5:30 PM", location: "Diamond 1", player: "Jake", type: "practice" },
  { id: 2, title: "Thunder vs Eagles", date: "Feb 8, 2024", time: "10:00 AM", location: "Eagles Field", player: "Jake", type: "game" },
  { id: 3, title: "8U Practice", date: "Feb 9, 2024", time: "9:00 AM", location: "Diamond 2", player: "Lily", type: "practice" },
];

const recentPayments = [
  { id: 1, description: "10U Travel Registration", amount: 350, date: "Jan 10, 2024", status: "paid" },
  { id: 2, description: "8U Rec Registration", amount: 150, date: "Jan 10, 2024", status: "paid" },
  { id: 3, description: "Tournament Fee", amount: 50, date: "Feb 1, 2024", status: "pending" },
];

export default function BaseballClubParentDashboard() {
  const { clubSlug } = useParams();
  const basePath = `/baseball/club/${clubSlug}`;

  return (
    <BaseballParentDashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-display mb-2">WELCOME BACK, SARAH</h1>
          <p className="text-muted-foreground">Manage your players, view schedules, and stay up to date.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-xl font-display">MY PLAYERS</CardTitle>
                <Link to={`${basePath}/programs`}><Button variant="outline" size="sm"><Plus className="h-4 w-4 mr-2" />Add Player</Button></Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {players.map(p => (
                  <div key={p.id} className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12"><AvatarFallback className="bg-[hsl(150,30%,12%)] text-white">{p.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                        <div><h3 className="font-semibold">{p.name}</h3><p className="text-sm text-muted-foreground">{p.team} • {p.position} • Age {p.age}</p></div>
                      </div>
                      <Badge variant="outline" className="bg-[hsl(150,45%,35%)]/10 text-[hsl(150,45%,35%)] border-[hsl(150,45%,35%)]/20">{p.status}</Badge>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[hsl(150,45%,35%)]" /><span>Next: {p.nextGame}</span></div>
                      <div className="flex items-center gap-2"><Target className="h-4 w-4 text-[hsl(150,45%,35%)]" /><span>AVG: {p.battingAvg}</span></div>
                      <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-[hsl(150,45%,35%)]" /><span>{p.gamesPlayed} games</span></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-xl font-display">UPCOMING SCHEDULE</CardTitle>
                <Link to={`${basePath}/parent/calendar`}><Button variant="outline" size="sm"><Calendar className="h-4 w-4 mr-2" />Calendar</Button></Link>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingEvents.map(ev => (
                  <div key={ev.id} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${ev.type === "game" ? "bg-red-500/20 text-red-500" : "bg-[hsl(150,45%,35%)]/20 text-[hsl(150,45%,35%)]"}`}>
                      {ev.type === "game" ? <Target className="h-6 w-6" /> : <Calendar className="h-6 w-6" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{ev.title}</h4>
                      <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground"><span>{ev.date}</span><span>{ev.time}</span><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.location}</span></div>
                      <Badge variant="secondary" className="mt-2 text-xs">{ev.player}</Badge>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-xl font-display">QUICK ACTIONS</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-3 gap-3">
                <Link to={`${basePath}/parent/messages`}><Button variant="outline" className="flex-col h-auto py-4 w-full"><MessageSquare className="h-5 w-5 mb-2" /><span className="text-xs">Messages</span></Button></Link>
                <Link to={`${basePath}/store`}><Button variant="outline" className="flex-col h-auto py-4 w-full"><ShoppingBag className="h-5 w-5 mb-2" /><span className="text-xs">Shop</span></Button></Link>
                <Link to={`${basePath}/parent/profile`}><Button variant="outline" className="flex-col h-auto py-4 w-full"><User className="h-5 w-5 mb-2" /><span className="text-xs">Profile</span></Button></Link>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader><CardTitle className="text-xl font-display">PAYMENTS</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {recentPayments.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      {p.status === "paid" ? <CheckCircle className="h-5 w-5 text-[hsl(150,45%,35%)]" /> : <Clock className="h-5 w-5 text-amber-500" />}
                      <div><p className="text-sm font-medium">{p.description}</p><p className="text-xs text-muted-foreground">{p.date}</p></div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${p.amount}</p>
                      <Badge variant={p.status === "paid" ? "secondary" : "outline"} className={p.status === "pending" ? "border-amber-500 text-amber-500" : ""}>{p.status}</Badge>
                    </div>
                  </div>
                ))}
                <Button className="w-full mt-2 bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white"><CreditCard className="h-4 w-4 mr-2" />Pay Outstanding</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BaseballParentDashboardLayout>
  );
}
