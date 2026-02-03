import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  ArrowRight,
  Trophy,
  Star,
  CheckCircle,
} from "lucide-react";

const clubInfo = {
  name: "Thunder Wrestling Club",
  location: "Austin, TX",
  description: "Building champions on and off the mat since 2010. Our program focuses on technique, discipline, and character development for wrestlers of all skill levels.",
  image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=400&fit=crop",
};

const programs = [
  {
    id: 1,
    name: "Youth Wrestling",
    ageRange: "6-10 years",
    price: 150,
    duration: "8 weeks",
    schedule: "Tue/Thu 5:00-6:00 PM",
    spots: 24,
    filled: 18,
    description: "Introduction to wrestling fundamentals in a fun, supportive environment.",
    features: ["Basic techniques", "Fitness & conditioning", "Team building", "Tournament prep"],
    startDate: "March 1, 2024",
  },
  {
    id: 2,
    name: "Middle School",
    ageRange: "11-14 years",
    price: 200,
    duration: "10 weeks",
    schedule: "Mon/Wed/Fri 4:00-5:30 PM",
    spots: 20,
    filled: 15,
    description: "Intermediate program for developing wrestlers ready to compete.",
    features: ["Advanced techniques", "Competition prep", "Strength training", "Video analysis"],
    startDate: "March 1, 2024",
  },
  {
    id: 3,
    name: "High School",
    ageRange: "14-18 years",
    price: 250,
    duration: "12 weeks",
    schedule: "Mon-Fri 3:30-5:30 PM",
    spots: 25,
    filled: 22,
    description: "Elite training for serious competitors looking to excel at the varsity level.",
    features: ["Elite coaching", "College recruitment", "Mental training", "Nutrition guidance"],
    startDate: "March 1, 2024",
  },
  {
    id: 4,
    name: "Summer Camp",
    ageRange: "6-18 years",
    price: 300,
    duration: "1 week",
    schedule: "Mon-Fri 9:00 AM - 3:00 PM",
    spots: 40,
    filled: 8,
    description: "Intensive week-long camp with guest coaches and specialized clinics.",
    features: ["Guest coaches", "Daily competitions", "Technique clinics", "Team activities"],
    startDate: "June 10, 2024",
  },
];

const testimonials = [
  {
    quote: "My son has grown so much in confidence since joining Thunder Wrestling. The coaches are amazing!",
    author: "Sarah M.",
    role: "Parent of Youth Wrestler",
  },
  {
    quote: "Best wrestling program in Austin. My daughter went from beginner to state qualifier in two years.",
    author: "David K.",
    role: "Parent of High School Wrestler",
  },
];

export default function PublicPrograms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-navy text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
              <Trophy className="h-6 w-6 text-navy" />
            </div>
            <span className="font-display text-xl">{clubInfo.name.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:text-gold">
                Parent Login
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-navy">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${clubInfo.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 to-navy/70" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-display text-white mb-4">
            JOIN OUR TEAM
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mb-6">
            {clubInfo.description}
          </p>
          <div className="flex items-center gap-4 text-white/80">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gold" />
              <span>{clubInfo.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gold" />
              <span>150+ Active Wrestlers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-gold" />
              <span>4.9 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display mb-4">OUR PROGRAMS</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the program that's right for your wrestler. All programs include
              professional coaching, equipment access, and tournament opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {programs.map((program) => {
              const spotsLeft = program.spots - program.filled;
              const fillPercent = (program.filled / program.spots) * 100;

              return (
                <Card key={program.id} className="shadow-card hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl font-display">
                          {program.name.toUpperCase()}
                        </CardTitle>
                        <p className="text-muted-foreground">{program.ageRange}</p>
                      </div>
                      <Badge variant="outline" className="text-gold border-gold">
                        ${program.price}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{program.description}</p>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gold" />
                        <span>Starts {program.startDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gold" />
                        <span>{program.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <Users className="h-4 w-4 text-gold" />
                        <span>{program.schedule}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {spotsLeft} spots remaining
                        </span>
                        <span className="font-medium">{Math.round(fillPercent)}% full</span>
                      </div>
                      <Progress value={fillPercent} className="h-2" />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {program.features.map((feature) => (
                        <div
                          key={feature}
                          className="flex items-center gap-1 text-sm bg-secondary/50 px-2 py-1 rounded"
                        >
                          <CheckCircle className="h-3 w-3 text-wrestling-green" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link to={`/register/${program.id}`}>
                      <Button variant="hero" className="w-full mt-4">
                        Register Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-navy text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-display text-center mb-12">
            WHAT PARENTS SAY
          </h2>
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

      {/* Footer */}
      <footer className="bg-navy-light text-white/60 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 {clubInfo.name}. All rights reserved.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-gold">Contact Us</a>
            {" • "}
            <a href="#" className="hover:text-gold">Privacy Policy</a>
            {" • "}
            <a href="#" className="hover:text-gold">Terms of Service</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
