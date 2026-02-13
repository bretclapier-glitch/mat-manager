import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  ArrowRight,
  CheckCircle,
  Trophy,
  Target,
} from "lucide-react";

const sports = [
  {
    name: "Wrestling",
    tagline: "Mat-tested management for wrestling clubs",
    icon: Trophy,
    color: "from-[hsl(45,93%,47%)] to-[hsl(45,93%,35%)]",
    bgColor: "bg-[hsl(220,20%,10%)]",
    textColor: "text-[hsl(45,93%,47%)]",
    path: "/wrestling/onboarding",
    demoPath: "/wrestling/dashboard",
    features: ["USA Wrestling integration", "Weight tracking & weigh-ins", "Tournament management", "Mat assignment scheduling"],
  },
  {
    name: "Baseball",
    tagline: "Diamond-ready tools for baseball organizations",
    icon: Target,
    color: "from-[hsl(150,45%,35%)] to-[hsl(150,45%,25%)]",
    bgColor: "bg-[hsl(150,30%,12%)]",
    textColor: "text-[hsl(150,45%,45%)]",
    path: "/baseball/onboarding",
    demoPath: "/baseball/dashboard",
    features: ["Roster & lineup management", "Game scheduling & scorekeeping", "Player stats & development", "Equipment & uniform tracking"],
  },
];

const benefits = [
  "Save 10+ hours per week on administrative tasks",
  "Never miss a payment or registration deadline",
  "Keep parents engaged and informed",
  "Professional club website in minutes",
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-hero-gradient">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-8 w-8 text-gold" />
          <span className="text-2xl font-display text-white">HOMETEAM</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="text-white hover:text-gold">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="hero" size="lg">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-6 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-display text-white mb-6 animate-fade-in">
            RUN YOUR <span className="text-gradient">SPORTS CLUB</span> LIKE A CHAMPION
          </h1>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            The all-in-one platform for youth sports organizations. Purpose-built tools for every sport.
          </p>
        </div>
      </section>

      {/* Sport Selection */}
      <section className="container mx-auto px-6 py-16 bg-background rounded-t-[3rem]">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">CHOOSE YOUR SPORT</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each HomeTeam app is purpose-built with sport-specific features, terminology, and workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {sports.map((sport) => (
            <Card key={sport.name} className="overflow-hidden shadow-card hover:shadow-xl transition-all hover:-translate-y-1">
              <div className={`${sport.bgColor} p-8 text-center`}>
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${sport.color} flex items-center justify-center mx-auto mb-4`}>
                  <sport.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-display text-white mb-1">HOMETEAM {sport.name.toUpperCase()}</h3>
                <p className="text-white/70 text-sm">{sport.tagline}</p>
              </div>
              <CardContent className="p-6 space-y-4">
                <ul className="space-y-2">
                  {sport.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`h-4 w-4 ${sport.textColor}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3 pt-2">
                  <Link to={sport.path} className="flex-1">
                    <Button variant="hero" className="w-full">
                      Get Started <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link to={sport.demoPath}>
                    <Button variant="outline">Demo</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
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
                  <CheckCircle className="h-6 w-6 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-lg text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
            <Link to="/signup" className="inline-block mt-8">
              <Button variant="hero" size="lg">Get Started Today <ArrowRight className="ml-2" /></Button>
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-navy to-navy-light p-8 shadow-2xl">
              <div className="h-full rounded-2xl bg-white/5 backdrop-blur border border-white/10 flex items-center justify-center">
                <Trophy className="h-32 w-32 text-gold animate-float" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-gold to-gold-light py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-display text-navy mb-6">READY TO ELEVATE YOUR CLUB?</h2>
          <p className="text-xl text-navy/70 mb-8 max-w-2xl mx-auto">Join hundreds of sports clubs already using HomeTeam</p>
          <Link to="/signup">
            <Button variant="dark" size="xl">Start Your Free Trial <ArrowRight className="ml-2" /></Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-gold" />
              <span className="text-xl font-display text-white">HOMETEAM</span>
            </div>
            <p className="text-white/50 text-sm">© {new Date().getFullYear()} HomeTeam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
