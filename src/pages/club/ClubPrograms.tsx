import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useClubData } from "@/components/layout/ClubLayout";
import { useAuth } from "@/hooks/useAuth";
import {
  Calendar,
  Clock,
  Users,
  ArrowRight,
  CheckCircle,
  LogIn,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

export default function ClubPrograms() {
  const { clubSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const basePath = `/wrestling/club/${clubSlug}`;
  const [loginPromptOpen, setLoginPromptOpen] = useState(false);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);

  function handleRegisterClick(programId: number) {
    if (user) {
      // Logged in — go straight to registration
      navigate(`${basePath}/register/${programId}`);
    } else {
      // Not logged in — show login prompt
      setSelectedProgramId(programId);
      setLoginPromptOpen(true);
    }
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
                      <span className="text-muted-foreground">{spotsLeft} spots remaining</span>
                      <span className="font-medium">{Math.round(fillPercent)}% full</span>
                    </div>
                    <Progress value={fillPercent} className="h-2" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {program.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-1 text-sm bg-secondary/50 px-2 py-1 rounded">
                        <CheckCircle className="h-3 w-3 text-wrestling-green" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

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
