import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, ArrowLeft, Mail, Lock, User, Building, Shield } from "lucide-react";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clubName: "",
    usaWrestlingId: "",
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store club info for onboarding
    sessionStorage.setItem('clubSignup', JSON.stringify({
      clubName: formData.clubName,
      usaWrestlingId: formData.usaWrestlingId,
    }));
    navigate("/wrestling/onboarding");
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col">
      {/* Back Link */}
      <div className="container mx-auto px-6 py-6">
        <Link to="/" className="inline-flex items-center text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>
      </div>

      {/* Signup Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Trophy className="h-10 w-10 text-gold" />
              <span className="text-3xl font-display text-white">HOMETEAM</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create your club</h1>
            <p className="text-white/60">Start managing your wrestling club today</p>
          </div>

          <div className="bg-card rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="usaWrestlingId">USA Wrestling Club ID *</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="usaWrestlingId"
                    type="text"
                    placeholder="e.g., 123456"
                    value={formData.usaWrestlingId}
                    onChange={(e) => setFormData({ ...formData, usaWrestlingId: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This ensures unique club registration. Find your ID at{" "}
                  <a href="https://www.usawrestling.org" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                    usawrestling.org
                  </a>
                </p>
              </div>

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
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" size="lg">
                Create Club Account
              </Button>
            </form>

            <p className="mt-4 text-xs text-center text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </p>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-gold font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}