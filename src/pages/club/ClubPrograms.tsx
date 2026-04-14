import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import {
  Calendar,
  Clock,
  Users,
  ArrowRight,
  CheckCircle,
  LogIn,
  Loader2,
  Trophy,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Program = {
  id: string;
  name: string;
  description: string | null;
  season_start: string | null;
  season_end: string | null;
  practice_days: string[];
  practice_time: string | null;
  practice_end_time: string | null;
  price: number | null;
  payment_type: string;
  club_id: string;
};

export default function ClubPrograms() {
  const { clubSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const basePath = `/wrestling/club/${clubSlug}`;

  const [programs, setPrograms] = useState<Program[]>([]);
  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

  useEffect(() => {
    if (clubSlug) loadPrograms(clubSlug);
  }, [clubSlug]);

  async function loadPrograms(slug: string) {
    setLoading(true);
    try {
      // Find club by slug or id
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let club = null;
      if (uuidRegex.test(slug)) {
        const { data } = await supabase.from('clubs').select('id').eq('id', slug).maybeSingle();
        club = data;
      } else {
        const { data } = await supabase.from('clubs').select('id').eq('slug', slug).maybeSingle();
        club = data;
      }

      if (!club) { setLoading(false); return; }

      const { data: programData } = await supabase
        .from('programs')
        .select('*')
        .eq('club_id', club.id)
        .order('name');

      if (programData) {
        setPrograms(programData as Program[]);

        // Get registration counts per program
        const counts: Record<string, number> = {};
        await Promise.all(
          programData.map(async (p) => {
            const { count } = await supabase
              .from('registrations')
              .select('*', { count: 'exact', head: true })
              .eq('club_id', club.id)
              .eq('program', p.name);
            counts[p.id] = count ?? 0;
          })
        );
        setRegistrationCounts(counts);
      }
    } catch (err) {
      console.error('Programs load error:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleRegisterClick(programId: string) {
    if (user) {
      navigate(`${basePath}/register/${programId}`);
    } else {
      setSelectedProgramId(programId);
      setLoginPromptOpen(true);
    }
  }

  function formatSchedule(program: Program) {
    const days = Array.isArray(program.practice_days) ? program.practice_days.join('/') : '';
    const time = program.practice_time ?? '';
    const endTime = program.practice_end_time ?? '';
    if (days && time) return `${days} ${time}${endTime ? ` - ${endTime}` : ''}`;
    if (time) return time;
    return 'Schedule TBD';
  }

  function formatDateRange(program: Program) {
    if (program.season_start) {
      const start = new Date(program.season_start).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
      return `Starts ${start}`;
    }
    return 'Date TBD';
  }

  if (loading) {
    return (
      <div className="py-32 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (programs.length === 0) {
    return (
      <div className="py-32 text-center">
        <Trophy className="h-16 w-16 mx-auto mb-4 opacity-20" />
        <h2 className="text-2xl font-display mb-2">NO PROGRAMS YET</h2>
        <p className="text-muted-foreground">Check back soon — programs will be listed here.</p>
      </div>
    );
  }

  return (
    <div className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display mb-4">OUR PROGRAMS</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the program that's right for your wrestler. All programs include
            professional coaching, equipment access, and tournament opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {programs.map((program) => {
            const registrations = registrationCounts[program.id] ?? 0;

            return (
              <Card key={program.id} className="shadow-card hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl font-display">
                        {program.name.toUpperCase()}
                      </CardTitle>
                    </div>
                    {program.price && (
                      <Badge variant="outline" className="text-gold border-gold">
                        ${program.price}
                        {program.payment_type === 'monthly' ? '/mo' : ''}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {program.description && (
                    <p className="text-muted-foreground">{program.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gold" />
                      <span>{formatDateRange(program)}</span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Clock className="h-4 w-4 text-gold" />
                      <span>{formatSchedule(program)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gold" />
                      <span>{registrations} registered</span>
                    </div>
                  </div>

                  {registrations > 0 && (
                    <div className="space-y-2">
                      <Progress value={Math.min(registrations * 5, 100)} className="h-2" />
                    </div>
                  )}

                  <Button
                    variant="hero"
                    className="w-full mt-4"
                    onClick={() => handleRegisterClick(program.id)}
                  >
                    Register Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Login required dialog */}
      <Dialog open={loginPromptOpen} onOpenChange={setLoginPromptOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">ACCOUNT REQUIRED</DialogTitle>
            <DialogDescription>
              You need a parent account to register a wrestler. It only takes a minute to set up.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <Link
              to={`${basePath}/login`}
              state={{ redirectTo: selectedProgramId ? `${basePath}/register/${selectedProgramId}` : undefined }}
            >
              <Button variant="hero" className="w-full" onClick={() => setLoginPromptOpen(false)}>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link
              to="/wrestling/signup"
              state={{ redirectTo: selectedProgramId ? `${basePath}/register/${selectedProgramId}` : undefined }}
            >
              <Button variant="outline" className="w-full" onClick={() => setLoginPromptOpen(false)}>
                Create Parent Account
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
