import { Link } from "react-router-dom";
import BaseballDashboardLayout from "@/components/layout/BaseballDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Calendar, ArrowRight, ArrowUpRight, ArrowDownRight, MessageSquare } from "lucide-react";

const stats = [
  { title: "Total Players", value: "84", change: "+8%", trend: "up", icon: Users, path: "/baseball/dashboard/players" },
  { title: "Monthly Revenue", value: "$6,250", change: "+15%", trend: "up", icon: DollarSign, path: "/baseball/dashboard/payments" },
  { title: "Active Registrations", value: "12", change: "+3", trend: "up", icon: Calendar, path: "/baseball/dashboard/registration" },
  { title: "Messages", value: "5", change: "unread", trend: "neutral", icon: MessageSquare, path: "/baseball/dashboard/messages" },
];

const upcomingGames = [
  { title: "Practice - 10U", time: "Today, 5:00 PM", type: "practice" },
  { title: "Thunder vs Eagles", time: "Saturday, 10:00 AM", type: "game" },
  { title: "14U Tryouts", time: "Sunday, 9:00 AM", type: "tryout" },
  { title: "Team Pictures", time: "Next Mon, 4:00 PM", type: "event" },
];

const recentRegistrations = [
  { name: "Jake Thompson", program: "10U Travel", status: "complete" },
  { name: "Mia Rodriguez", program: "12U Rec", status: "pending" },
  { name: "Caleb Davis", program: "14U Travel", status: "pending" },
];

export default function BaseballDashboard() {
  return (
    <BaseballDashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display">DASHBOARD</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your organization.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link key={stat.title} to={stat.path}>
              <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[hsl(150,45%,35%)]/10 flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-[hsl(150,45%,35%)]" />
                    </div>
                    {stat.trend !== "neutral" && (
                      <div className={`flex items-center gap-1 text-sm font-medium ${stat.trend === "up" ? "text-[hsl(150,45%,35%)]" : "text-red-500"}`}>
                        {stat.trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                        {stat.change}
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-display">UPCOMING GAMES & EVENTS</CardTitle>
              <Link to="/baseball/dashboard/schedule"><Button variant="ghost" size="sm">View All <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingGames.map((event, i) => (
                  <Link key={i} to="/baseball/dashboard/schedule" className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${event.type === "practice" ? "bg-[hsl(150,45%,35%)]" : event.type === "game" ? "bg-red-500" : event.type === "tryout" ? "bg-blue-500" : "bg-muted-foreground"}`} />
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.time}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-display">RECENT REGISTRATIONS</CardTitle>
              <Link to="/baseball/dashboard/registration"><Button variant="ghost" size="sm">View All <ArrowRight className="h-4 w-4 ml-1" /></Button></Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRegistrations.map((reg, i) => (
                  <Link key={i} to="/baseball/dashboard/registration" className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[hsl(150,30%,12%)] flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{reg.name.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <div>
                        <p className="font-medium">{reg.name}</p>
                        <p className="text-sm text-muted-foreground">{reg.program}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${reg.status === "complete" ? "bg-[hsl(150,45%,35%)]/10 text-[hsl(150,45%,35%)]" : "bg-amber-500/10 text-amber-600"}`}>{reg.status}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card bg-gradient-to-r from-[hsl(150,30%,12%)] to-[hsl(150,30%,18%)] text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-display mb-2">QUICK ACTIONS</h3>
                <p className="text-white/70">Common tasks to manage your organization</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/baseball/dashboard/players"><Button className="bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white" size="lg">Add Player</Button></Link>
                <Link to="/baseball/dashboard/schedule"><Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">Schedule Game</Button></Link>
                <Link to="/baseball/dashboard/messages"><Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">Send Message</Button></Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseballDashboardLayout>
  );
}
