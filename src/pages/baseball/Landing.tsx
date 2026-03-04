import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Target,
  Calendar,
  Users,
  CreditCard,
  Globe,
} from "lucide-react";

const features = [
  { icon: Users, title: "Roster & Lineup Management", desc: "Track players, positions, and team assignments across age groups" },
  { icon: Calendar, title: "Game & Practice Scheduling", desc: "Field reservations, game schedules, and automated reminders" },
  { icon: CreditCard, title: "Payments & Registration", desc: "Collect fees, manage sign-ups, and track payment status" },
  { icon: Globe, title: "Organization Website", desc: "Professional website for your baseball org in minutes" },
];

const benefits = [
  "Save 10+ hours per week on administrative tasks",
  "Never miss a payment or registration deadline",
  "Keep parents engaged and informed",
  "Player stats and development tracking",
];

export default function BaseballLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(150,30%,12%)] via-[hsl(150,25%,15%)] to-[hsl(150,20%,18%)]">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-8 w-8 text-[hsl(150,45%,45%)]" />
          <span className="text-2xl font-display text-white">HOMETEAM BASEBALL</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/baseball/login">
            <Button variant="ghost" className="text-white hover:text-[hsl(150,45%,45%)]">Login</Button>
          </Link>
          <Link to="/baseball/signup">
            <Button className="bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white" size="lg">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-6 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-display text-white mb-6 animate-fade-in">
            RUN YOUR <span className="text-[hsl(150,45%,45%)]">BASEBALL ORG</span> LIKE A PRO
          </h1>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            The all-in-one platform built specifically for baseball organizations. Manage rosters, schedules, payments, and more.
          </p>
          <div className="flex items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Link to="/baseball/signup">
              <Button className="bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white" size="lg">
                Start Your Free Trial <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link to="/baseball/dashboard">
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">View Demo</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16 bg-background rounded-t-[3rem]">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">DIAMOND-READY TOOLS</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Purpose-built for baseball organizations with sport-specific features and workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4 p-6 rounded-2xl bg-card shadow-card">
              <div className="w-12 h-12 rounded-xl bg-[hsl(150,45%,45%)]/10 flex items-center justify-center flex-shrink-0">
                <feature.icon className="h-6 w-6 text-[hsl(150,45%,45%)]" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-6 py-20 bg-background">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-display text-foreground mb-8">
              FOCUS ON COACHING, NOT PAPERWORK
            </h2>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-[hsl(150,45%,45%)] flex-shrink-0 mt-0.5" />
                  <span className="text-lg text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
            <Link to="/baseball/signup" className="inline-block mt-8">
              <Button className="bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white" size="lg">
                Get Started Today <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[hsl(150,30%,12%)] to-[hsl(150,25%,18%)] p-8 shadow-2xl">
              <div className="h-full rounded-2xl bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center">
                <Target className="h-32 w-32 text-[hsl(150,45%,45%)] animate-float" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(150,30%,8%)] py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6 text-[hsl(150,45%,45%)]" />
              <span className="text-xl font-display text-white">HOMETEAM BASEBALL</span>
            </div>
            <p className="text-white/50 text-sm">© {new Date().getFullYear()} HomeTeam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
