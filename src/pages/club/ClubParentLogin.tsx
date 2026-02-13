import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClubData } from "@/components/layout/ClubLayout";
import { Trophy, Mail, Lock, ArrowLeft } from "lucide-react";

export default function ClubParentLogin() {
  const { clubSlug } = useParams();
  const club = useClubData();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const basePath = `/club/${clubSlug}`;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: real auth
    navigate(`${basePath}/parent`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gold flex items-center justify-center">
              <Trophy className="h-7 w-7 text-navy" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-1">Parent Login</h1>
          <p className="text-muted-foreground">
            Sign in to manage your wrestlers at {club.name}
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-8 border">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="parent@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" variant="hero" className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to={`${basePath}/programs`}
              className="text-gold font-semibold hover:underline"
            >
              Register your wrestler
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
