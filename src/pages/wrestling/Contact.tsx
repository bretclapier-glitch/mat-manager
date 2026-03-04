import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, ArrowLeft, CheckCircle, User, Mail, Building, Phone, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function WrestlingContact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    clubName: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to backend/email service
    setSubmitted(true);
    toast.success("Demo request submitted!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-hero-gradient flex flex-col">
        <nav className="container mx-auto px-6 py-6">
          <Link to="/wrestling" className="inline-flex items-center text-white/70 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to HomeTeam Wrestling
          </Link>
        </nav>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-card rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-gold" />
            </div>
            <h2 className="text-2xl font-display text-foreground mb-3">WE'LL BE IN TOUCH</h2>
            <p className="text-muted-foreground mb-8">
              Thanks for your interest! Our team will reach out within 24 hours to schedule your personalized demo.
            </p>
            <Link to="/wrestling">
              <Button variant="hero" size="lg">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col">
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/wrestling" className="inline-flex items-center text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to HomeTeam Wrestling
        </Link>
        <div className="flex items-center gap-2">
          <Trophy className="h-8 w-8 text-gold" />
          <span className="text-2xl font-display text-white">HOMETEAM WRESTLING</span>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-display text-white mb-4">SCHEDULE A DEMO</h1>
            <p className="text-lg text-white/60">
              See how HomeTeam can streamline your wrestling club. Fill out the form and our team will be in touch.
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                    required
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@wrestlingclub.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                    maxLength={255}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clubName">Club Name *</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="clubName"
                    type="text"
                    placeholder="Thunder Wrestling Club"
                    value={formData.clubName}
                    onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
                    className="pl-10"
                    required
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10"
                    maxLength={20}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="message"
                    placeholder="Tell us about your club and what you're looking for..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="pl-10 min-h-[100px]"
                    maxLength={1000}
                  />
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" size="lg">
                Request a Demo
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
