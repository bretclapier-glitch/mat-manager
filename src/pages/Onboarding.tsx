import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  MapPin, 
  Users,
  Palette,
  Settings,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Globe,
  Calendar,
  CreditCard,
  ClipboardList,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";
import { OnboardingData, defaultOnboardingData } from "@/types/onboarding";
import ClubInfoStep from "@/components/onboarding/ClubInfoStep";
import LocationStep from "@/components/onboarding/LocationStep";
import ProgramsStep from "@/components/onboarding/ProgramsStep";
import FeaturesStep from "@/components/onboarding/FeaturesStep";
import WebsiteStep from "@/components/onboarding/WebsiteStep";
import ScheduleStep from "@/components/onboarding/ScheduleStep";
import PaymentsStep from "@/components/onboarding/PaymentsStep";
import RegistrationStep from "@/components/onboarding/RegistrationStep";
import BrandingStep from "@/components/onboarding/BrandingStep";
import MessagingStep from "@/components/onboarding/MessagingStep";
import MerchStep from "@/components/onboarding/MerchStep";
import { supabase } from "@/lib/supabase";

interface Step {
  id: string;
  title: string;
  icon: React.ElementType;
}

// Map day names to JS getDay() values
const DAY_MAP: Record<string, number> = {
  Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
};

function generatePracticeDates(practiceDays: string[], seasonStart: string, seasonEnd: string): Date[] {
  const dates: Date[] = [];
  const start = new Date(seasonStart);
  const end = new Date(seasonEnd);
  const targetDays = practiceDays.map(d => DAY_MAP[d]).filter(d => d !== undefined);
  const current = new Date(start);
  while (current <= end) {
    if (targetDays.includes(current.getDay())) dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function buildEventDateTime(date: Date, timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const dt = new Date(date);
  dt.setHours(hours, minutes, 0, 0);
  return dt.toISOString();
}

const baseSteps: Step[] = [
  { id: 'club-info', title: 'Club Info', icon: Trophy },
  { id: 'location', title: 'Location', icon: MapPin },
  { id: 'programs', title: 'Programs', icon: Users },
  { id: 'features', title: 'Features', icon: Settings },
];

const featureSteps: Record<string, Step> = {
  website: { id: 'website', title: 'Website', icon: Globe },
  schedule: { id: 'schedule', title: 'Schedule', icon: Calendar },
  messaging: { id: 'messaging', title: 'Messaging', icon: MessageSquare },
  payments: { id: 'payments', title: 'Payments', icon: CreditCard },
  registration: { id: 'registration', title: 'Registration', icon: ClipboardList },
  merch: { id: 'merch', title: 'Merch', icon: ShoppingBag },
};

const finalStep: Step = { id: 'branding', title: 'Branding', icon: Palette };

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [clubName, setClubName] = useState('');
  const [onboardingData, setOnboardingData] = useState<OnboardingData>(defaultOnboardingData);
  const [saving, setSaving] = useState(false);

  async function saveClubToSupabase() {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/wrestling/dashboard");
        return;
      }

      const name = onboardingData.clubName ?? 'My Wrestling Club';
      const slug = name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      const uniqueSlug = `${slug}-${user.id.slice(0, 6)}`;

      // Check if user already has a club
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('club_id')
        .eq('id', user.id)
        .single();

      if (existingProfile?.club_id) {
        // Already has a club — just update it
        await supabase
          .from('clubs')
          .update({
            name,
            tagline: onboardingData.tagline ?? 'Building champions on and off the mat',
          })
          .eq('id', existingProfile.club_id);
      } else {
        // Create new club
        const { data: club, error } = await supabase
          .from('clubs')
          .insert({
            name,
            slug: uniqueSlug,
            tagline: onboardingData.tagline ?? 'Building champions on and off the mat',
          })
          .select()
          .single();

        if (!error && club) {
          await supabase
            .from('profiles')
            .update({ club_id: club.id })
            .eq('id', user.id);
        }
      }

      // Auto-generate calendar events for each program
      if (clubId) {
        const { data: savedPrograms } = await supabase
          .from('programs')
          .select('id, name, season_start, season_end, practice_days, practice_time, practice_end_time')
          .eq('club_id', clubId);

        if (savedPrograms && savedPrograms.length > 0) {
          const allEvents: any[] = [];
          for (const program of savedPrograms) {
            if (!program.practice_days?.length || !program.season_start || !program.season_end || !program.practice_time) continue;
            const dates = generatePracticeDates(program.practice_days, program.season_start, program.season_end);
            for (const date of dates) {
              allEvents.push({
                title: `${program.name} Practice`,
                start_time: buildEventDateTime(date, program.practice_time),
                end_time: buildEventDateTime(date, program.practice_end_time || program.practice_time),
                event_type: 'practice',
                club_id: clubId,
                program_id: program.id,
                location: null,
              });
            }
          }
          for (let i = 0; i < allEvents.length; i += 100) {
            await supabase.from('events').insert(allEvents.slice(i, i + 100));
          }
        }
      }

sessionStorage.setItem('onboardingData', JSON.stringify(onboardingData));

      // Get the club slug so we can store it for the parent URL
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const { data: prof } = await supabase
          .from('profiles').select('club_id').eq('id', currentUser.id).single();
        if (prof?.club_id) {
          const { data: clubData } = await supabase
            .from('clubs').select('slug').eq('id', prof.club_id).single();
          if (clubData?.slug) {
            localStorage.setItem('clubSlug', clubData.slug);
          }
        }
      }
      navigate("/wrestling/dashboard");
    } catch (err) {
      console.error('Error saving club:', err);
      navigate("/wrestling/dashboard");
    } finally {
      setSaving(false);
    }
  }

  // Load club name from signup
  useEffect(() => {
    const stored = sessionStorage.getItem('clubSignup');
    if (stored) {
      const { clubName } = JSON.parse(stored);
      setClubName(clubName);
    }
  }, []);

  // Build dynamic steps based on selected features
  const steps = useMemo(() => {
    const dynamicSteps = [...baseSteps];
    
    const featureOrder = ['website', 'schedule', 'messaging', 'payments', 'registration', 'merch'];
    featureOrder.forEach(feature => {
      if (onboardingData.selectedFeatures.includes(feature) && featureSteps[feature]) {
        dynamicSteps.push(featureSteps[feature]);
      }
    });
    
    dynamicSteps.push(finalStep);
    return dynamicSteps;
  }, [onboardingData.selectedFeatures]);

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleDataChange = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = async () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      await saveClubToSupabase();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep.id) {
      case 'club-info':
        return <ClubInfoStep data={onboardingData} onChange={handleDataChange} />;
      case 'location':
        return <LocationStep data={onboardingData} onChange={handleDataChange} />;
      case 'programs':
        return <ProgramsStep data={onboardingData} onChange={handleDataChange} />;
      case 'features':
        return <FeaturesStep data={onboardingData} onChange={handleDataChange} />;
      case 'website':
        return <WebsiteStep data={onboardingData} onChange={handleDataChange} />;
      case 'schedule':
        return <ScheduleStep data={onboardingData} onChange={handleDataChange} />;
      case 'messaging':
        return <MessagingStep data={onboardingData} onChange={handleDataChange} />;
      case 'payments':
        return <PaymentsStep data={onboardingData} onChange={handleDataChange} />;
      case 'registration':
        return <RegistrationStep data={onboardingData} onChange={handleDataChange} />;
      case 'merch':
        return <MerchStep data={onboardingData} onChange={handleDataChange} />;
      case 'branding':
        return <BrandingStep data={onboardingData} onChange={handleDataChange} clubName={clubName} />;
      default:
        return null;
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-gold" />
              <span className="text-2xl font-display">HOMETEAM</span>
            </div>
            <Button variant="ghost" onClick={() => navigate("/wrestling/dashboard")}>
              Skip for now
            </Button>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2">
            {steps.slice(0, 6).map((step, index) => {
              const status = getStepStatus(index);
              const StepIcon = step.icon;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all flex-shrink-0
                    ${status === 'completed' 
                      ? "bg-gold border-gold text-navy" 
                      : status === 'current'
                        ? "bg-gold border-gold text-navy"
                        : "border-border text-muted-foreground"
                    }
                  `}>
                    {status === 'completed' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  {index < Math.min(steps.length - 1, 5) && (
                    <div className={`
                      w-8 md:w-16 h-0.5 mx-1 flex-shrink-0
                      ${status === 'completed' ? "bg-gold" : "bg-border"}
                    `} />
                  )}
                </div>
              );
            })}
            {steps.length > 6 && (
              <span className="text-sm text-muted-foreground ml-2 flex-shrink-0">
                +{steps.length - 6} more
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">{currentStep.title}</span>
            <span className="text-muted-foreground">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="bg-card rounded-2xl shadow-card p-8">
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStepIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button variant="hero" onClick={handleNext} disabled={saving}>
              {saving ? "Saving..." : currentStepIndex === steps.length - 1 ? "Complete Setup" : "Continue"}
              {!saving && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
