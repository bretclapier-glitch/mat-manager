import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  DollarSign, 
  Calendar, 
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare
} from "lucide-react";

const stats = [
  { title: "Total Members", value: "156", change: "+12%", trend: "up", icon: Users, path: "/wrestling/dashboard/members" },
  { title: "Monthly Revenue", value: "$8,420", change: "+18%", trend: "up", icon: DollarSign, path: "/wrestling/dashboard/payments" },
  { title: "Active Registrations", value: "23", change: "-5%", trend: "down", icon: Calendar, path: "/wrestling/dashboard/registration" },
  { title: "Messages", value: "8", change: "unread", trend: "neutral", icon: MessageSquare, path: "/wrestling/dashboard/messages" },
];

const upcomingEvents = [
  { title: "Youth Practice", time: "Today, 4:00 PM", type: "practice" },
  { title: "Parents Meeting", time: "Tomorrow, 6:00 PM", type: "meeting" },
  { title: "Varsity Dual Meet", time: "Saturday, 9:00 AM", type: "competition" },
  { title: "Team Photo Day", time: "Sunday, 2:00 PM", type: "event" },
];

const recentRegistrations = [
  { name: "Marcus Johnson", program: "Youth Wrestling", status: "pending" },
  { name: "Emily Chen", program: "High School", status: "complete" },
  { name: "Tyler Williams", program: "Middle School", status: "pending" },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display">DASHBOARD</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your club.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link key={stat.title} to={stat.path}>
              <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-gold" />
                    </div>
                    {stat.trend !== "neutral" && (
                      <div className={`flex items-center gap-1 text-sm font-medium ${
                        stat.trend === "up" ? "text-wrestling-green" : "text-wrestling-red"
                      }`}>
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
              <CardTitle className="text-xl font-display">UPCOMING EVENTS</CardTitle>
              <Link to="/wrestling/dashboard/schedule">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <Link key={index} to="/wrestling/dashboard/schedule" className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        event.type === "practice" ? "bg-gold" :
                        event.type === "competition" ? "bg-wrestling-red" :
                        event.type === "meeting" ? "bg-blue-500" :
                        "bg-muted-foreground"
                      }`} />
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
              <Link to="/wrestling/dashboard/registration">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentRegistrations.map((reg, index) => (
                  <Link key={index} to="/wrestling/dashboard/registration" className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {reg.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{reg.name}</p>
                        <p className="text-sm text-muted-foreground">{reg.program}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      reg.status === "complete" 
                        ? "bg-wrestling-green/10 text-wrestling-green" 
                        : "bg-gold/10 text-gold"
                    }`}>
                      {reg.status}
                    </span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card bg-gradient-to-r from-navy to-navy-light text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-display mb-2">QUICK ACTIONS</h3>
                <p className="text-white/70">Common tasks to manage your club</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/wrestling/dashboard/members">
                  <Button variant="hero" size="lg">Add Member</Button>
                </Link>
                <Link to="/wrestling/dashboard/schedule">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">Create Event</Button>
                </Link>
                <Link to="/wrestling/dashboard/messages">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">Send Message</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
