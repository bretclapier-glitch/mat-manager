import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, ArrowLeft, Mail, Lock } from "lucide-react";

export default function WrestlingLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/wrestling/dashboard");
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex flex-col">
      <div className="container mx-auto px-6 py-6">
        <Link to="/wrestling" className="inline-flex items-center text-white/70 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to HomeTeam Wrestling
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Trophy className="h-10 w-10 text-gold" />
              <span className="text-3xl font-display text-white">HOMETEAM WRESTLING</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-white/60">Sign in to manage your wrestling club</p>
          </div>

          <div className="bg-card rounded-2xl shadow-2xl p-8">
            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="admin" className="font-semibold">Club Admin</TabsTrigger>
                <TabsTrigger value="parent" className="font-semibold">Parent</TabsTrigger>
              </TabsList>

              <TabsContent value="admin">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="admin-email" type="email" placeholder="admin@wrestlingclub.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="admin-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  <Button type="submit" variant="hero" className="w-full" size="lg">Sign In as Admin</Button>
                </form>
              </TabsContent>

              <TabsContent value="parent">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="parent-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="parent-email" type="email" placeholder="parent@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="parent-password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  <Button type="submit" variant="hero" className="w-full" size="lg">Sign In as Parent</Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/wrestling/signup" className="text-gold font-semibold hover:underline">Get started</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
