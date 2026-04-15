import { useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useClubData } from "@/components/layout/ClubLayout";
import { supabase } from "@/lib/supabase";
import { Loader2, Trophy } from "lucide-react";

export default function ClubParentLogin() {
  const { clubSlug } = useParams();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const club = useClubData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = (location.state as any)?.redirectTo ?? `/wrestling/club/${clubSlug}/parent`;

  async function getSlug(): Promise<string> {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (clubSlug && uuidRegex.test(clubSlug)) {
      const { data } = await supabase
        .from('clubs')
        .select('slug')
        .eq('id', clubSlug)
        .single();
      if (data?.slug) return data.slug;
    }
    return clubSlug ?? '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      const slug = await getSlug();
      const destination = (location.state as any)?.redirectTo ?? `/wrestling/club/${slug}/parent`;
      navigate(destination);
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-gold" />
          </div>
          <h1 className="text-3xl font-display text-white">{club?.name?.toUpperCase() ?? 'MAT MANAGER'}</h1>
          <p className="text-white/60 mt-2">Parent portal</p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-display">WELCOME BACK</CardTitle>
            <CardDescription>Sign in to manage your wrestlers</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="parent@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="p-3 rounded-lg bg-wrestling-red/10 border border-wrestling-red/20 text-wrestling-red text-sm">
                  {error}
                </div>
              )}
              <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                {loading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Signing in...</>
                ) : "Sign In"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/wrestling/signup"
                state={{ clubSlug, redirectTo }}
                className="text-gold hover:underline font-medium"
              >
                Create account
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <Link
            to={`/wrestling/club/${clubSlug}`}
            className="text-white/40 hover:text-white/60 text-sm"
          >
            ← Back to club page
          </Link>
        </div>
      </div>
    </div>
  );
}
