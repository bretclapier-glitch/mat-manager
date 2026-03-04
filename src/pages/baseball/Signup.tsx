import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, ArrowLeft, Mail, Lock, User, Building } from "lucide-react";

export default function BaseballSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    orgName: "",
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem('baseballSignup', JSON.stringify({
      orgName: formData.orgName,
    }));
    navigate("/baseball/onboarding");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(150,30%,12%)] via-[hsl(150,25%,15%)] to-[hsl(150,20%,18%)] flex flex-col">
      <div className="container mx-auto px-6 py-6">
        <Link to="/baseball" className="inline-flex items-center text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to HomeTeam Baseball
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Target className="h-10 w-10 text-[hsl(150,45%,45%)]" />
              <span className="text-3xl font-display text-white">HOMETEAM BASEBALL</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Create your organization</h1>
            <p className="text-white/60">Start managing your baseball org today</p>
          </div>

          <div className="bg-card rounded-2xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name *</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="orgName" type="text" placeholder="Thunder Baseball Club" value={formData.orgName} onChange={(e) => setFormData({ ...formData, orgName: e.target.value })} className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="name" type="text" placeholder="John Smith" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="john@baseballorg.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="pl-10" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="pl-10" required />
                </div>
              </div>

              <Button type="submit" className="w-full bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white" size="lg">Create Organization Account</Button>
            </form>

            <p className="mt-4 text-xs text-center text-muted-foreground">By signing up, you agree to our Terms of Service and Privacy Policy</p>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/baseball/login" className="text-[hsl(150,45%,45%)] font-semibold hover:underline">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
