import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  FileText, 
  ShoppingBag,
  ArrowRight,
  CheckCircle,
  Trophy
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Club Management",
    description: "Manage wrestlers, coaches, and parents all in one place"
  },
  {
    icon: Calendar,
    title: "Schedule & Events",
    description: "Plan practices, matches, and tournaments with ease"
  },
  {
    icon: MessageSquare,
    title: "Communication",
    description: "Keep everyone informed with built-in messaging"
  },
  {
    icon: CreditCard,
    title: "Payments",
    description: "Collect dues and fees securely online"
  },
  {
    icon: FileText,
    title: "Registration",
    description: "Digital waivers and registration forms"
  },
  {
    icon: ShoppingBag,
    title: "Merch Store",
    description: "Sell club gear and apparel online"
  }
];

const benefits = [
  "Save 10+ hours per week on administrative tasks",
  "Never miss a payment or registration deadline",
  "Keep parents engaged and informed",
  "Professional club website in minutes"
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
            <Button variant="ghost" className="text-white hover:text-gold">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="hero" size="lg">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-display text-white mb-6 animate-fade-in">
            RUN YOUR <span className="text-gradient">WRESTLING CLUB</span> LIKE A CHAMPION
          </h1>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            The all-in-one platform for wrestling clubs. Manage registrations, schedules, payments, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Link to="/signup">
              <Button variant="hero" size="xl" className="w-full sm:w-auto">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/demo">
              <Button variant="outline" size="xl" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20 bg-background rounded-t-[3rem]">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-foreground mb-4">
            EVERYTHING YOUR CLUB NEEDS
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From registration to championships, we've got you covered
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="p-6 rounded-2xl bg-card shadow-card hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-navy" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
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
              <Button variant="hero" size="lg">
                Get Started Today <ArrowRight className="ml-2" />
              </Button>
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

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gold to-gold-light py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-display text-navy mb-6">
            READY TO ELEVATE YOUR CLUB?
          </h2>
          <p className="text-xl text-navy/70 mb-8 max-w-2xl mx-auto">
            Join hundreds of wrestling clubs already using HomeTeam
          </p>
          <Link to="/signup">
            <Button variant="dark" size="xl">
              Start Your Free Trial <ArrowRight className="ml-2" />
            </Button>
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
            <p className="text-white/50 text-sm">
              © 2024 HomeTeam. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
