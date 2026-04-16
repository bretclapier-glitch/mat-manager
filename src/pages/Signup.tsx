import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Trophy } from "lucide-react";

export default function Signup() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pick up club context from query params
  const searchParams = new URLSearchParams(location.search);
  const clubSlug = searchParams.get('club') ?? (location.state as any)?.clubSlug ?? null;
  const redirectTo = searchParams.get('redirectTo')
    ? decodeURIComponent(searchParams.get('redirectTo')!)
    : (location.state as any)?.redirectTo ?? null;

  // If coming from a club page, role is parent. Otherwise coach/admin.
  const role = clubSlug ? "parent" : "coach";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { error: signUpError } = await signUp(email, password, fullName, role);

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (role === "coach") {
      navigate("/wrestling/onboarding");
    } else if (clubSlug) {
      navigate(`/wrestling/club/${clubSlug}/login`, {
        state: { redirectTo: redirectTo ?? `/wrestling/club/${clubSlug}/programs` }
      });
    } else {
      navigate("/wrestling/login");
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gold/20 flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-gold" />
          </div>
          <h1 className="text-3xl font-display text-white">MAT MANAGER</h1>
          <p className="text-white/60 mt-2">
            {clubSlug ? "Create your parent account" : "Create your coach account"}
          </p>
        </div>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-display">
              {clubSlug ? "PARENT ACCOUNT" : "COACH / ADMIN ACCOUNT"}
            </CardTitle>
            <CardDescription>
              {clubSlug
                ? "Create an account to register your wrestler and access the parent portal"
                : "Set up your account to manage your wrestling club"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
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
                  placeholder="Min. 6 characters"
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
                {loading
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating account...</>
                  : "Create Account"
                }
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to={clubSlug ? `/wrestling/club/${clubSlug}/login` : "/wrestling/login"}
                className="text-gold hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        {clubSlug && (
          <div className="mt-4 text-center">
            <Link to={`/wrestling/club/${clubSlug}`} className="text-white/40 hover:text-white/60 text-sm">
              ← Back to club page
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
