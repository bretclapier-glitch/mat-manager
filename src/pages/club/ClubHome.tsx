import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useClubData } from "@/components/layout/ClubLayout";
import {
  Users,
  Star,
  ArrowRight,
  Calendar,
  Trophy,
  Shield,
  User,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "My son has grown so much in confidence since joining. The coaches are amazing!",
    author: "Sarah M.",
    role: "Parent of Youth Wrestler",
  },
  {
    quote: "Best wrestling program in town. My daughter went from beginner to state qualifier in two years.",
    author: "David K.",
    role: "Parent of High School Wrestler",
  },
];

const highlights = [
  { icon: Users, label: "150+ Active Wrestlers" },
  { icon: Star, label: "4.9 Parent Rating" },
  { icon: Calendar, label: "Year-Round Programs" },
  { icon: Trophy, label: "20+ State Qualifiers" },
];

export default function ClubHome() {
  const { clubSlug } = useParams();
  const club = useClubData();
  const basePath = `/wrestling/club/${clubSlug}`;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=600&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <h1 className="text-5xl md:text-7xl font-display mb-4">
            {club.name.toUpperCase()}
          </h1>
          <p className="text-xl text-white/70 mb-8 max-w-2xl">{club.tagline}</p>

          <div className="flex flex-wrap gap-6 mb-10">
            {highlights.map((h) => (
              <div key={h.label} className="flex items-center gap-2 text-white/80">
                <h.icon className="h-5 w-5 text-gold" />
                <span>{h.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={`${basePath}/programs`}>
              <Button variant="hero" size="xl">
                View Programs & Register
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to={`${basePath}/login`}>
              <Button
                variant="outline"
                size="xl"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <User className="mr-2 h-5 w-5" />
                Parent Login
              </Button>
            </Link>
            <Link to="/wrestling/login">
              <Button
                variant="outline"
                size="xl"
                className="border-white/20 text-white/60 hover:bg-white/5 hover:text-white/80"
              >
                <Shield className="mr-2 h-4 w-4" />
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display mb-4">WHY JOIN US?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're dedicated to developing young athletes through the sport of
              wrestling, building character, discipline, and lifelong friendships.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="text-center shadow-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-bold text-lg mb-2">Expert Coaching</h3>
                <p className="text-muted-foreground text-sm">
                  Certified coaches with competitive experience at the highest levels.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-bold text-lg mb-2">All Skill Levels</h3>
                <p className="text-muted-foreground text-sm">
                  Programs for beginners through elite competitors, ages 6–18.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-bold text-lg mb-2">Flexible Scheduling</h3>
                <p className="text-muted-foreground text-sm">
                  Multiple practice times and seasonal programs to fit your family's schedule.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-navy text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-display text-center mb-12">WHAT PARENTS SAY</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <Card key={i} className="bg-navy-light border-gold/20">
                <CardContent className="p-6">
                  <p className="text-lg text-white/90 mb-4">"{t.quote}"</p>
                  <div>
                    <p className="font-semibold text-gold">{t.author}</p>
                    <p className="text-sm text-white/60">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-gold to-gold-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-display text-navy mb-4">READY TO JOIN THE TEAM?</h2>
          <p className="text-navy/70 mb-8 max-w-xl mx-auto">
            Browse our programs and register your wrestler today.
          </p>
          <Link to={`${basePath}/programs`}>
            <Button variant="dark" size="xl">
              View Programs <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
