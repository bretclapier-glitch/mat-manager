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

// Map day names (full and abbreviated) to JS getDay() values
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
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load club name from signup
  useEffect(() => {
    const stored = sessionStorage.getItem('clubSignup');
    if (stored) {
      try {
        const { clubName } = JSON.parse(stored);
        setClubName(clubName);
      } catch {}
    }
  }, []);

  async function saveClubToSupabase() {
    setSaving(true);
    setSaveError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const name = onboardingData.clubName || clubName || 'My Wrestling Club';
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const uniqueSlug = `${slug}-${user.id.slice(0, 6)}`;

      // Step 1: Get or create club
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('club_id')
        .eq('id', user.id)
        .single();

      let clubId: string | null = existingProfile?.club_id ?? null;

      if (clubId) {
        // Update existing club
        await supabase.from('clubs').update({
          name,
          description: onboardingData.description ?? '',
          phone: onboardingData.phone ?? '',
          website_url: onboardingData.website ?? '',
          address: onboardingData.address ?? '',
          city: onboardingData.city ?? '',
          state: onboardingData.state ?? '',
          zip: onboardingData.zip ?? '',
          enable_direct_messages: onboardingData.enableDirectMessages ?? true,
          enable_email_notifications: onboardingData.enableEmailNotifications ?? true,
        }).eq('id', clubId);
      } else {
        // Create new club
        const { data: newClub, error: clubError } = await supabase
          .from('clubs')
          .insert({
            name,
            slug: uniqueSlug,
            description: onboardingData.description ?? '',
            phone: onboardingData.phone ?? '',
            website_url: onboardingData.website ?? '',
            address: onboardingData.address ?? '',
            city: onboardingData.city ?? '',
            state: onboardingData.state ?? '',
            zip: onboardingData.zip ?? '',
            enable_direct_messages: onboardingData.enableDirectMessages ?? true,
            enable_email_notifications: onboardingData.enableEmailNotifications ?? true,
          })
          .select()
          .single();

        if (clubError || !newClub) throw new Error('Failed to create club: ' + clubError?.message);
        clubId = newClub.id;

        // Step 2: Link profile to club — MUST succeed before continuing
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ club_id: clubId })
          .eq('id', user.id);

        if (profileError) throw new Error('Failed to link profile to club: ' + profileError.message);
      }

      // Step 3: Save message channels
      if (onboardingData.messageChannels && onboardingData.messageChannels.length > 0) {
        const channelsToInsert = onboardingData.messageChannels
          .filter(c => c.name.trim())
          .map(c => ({
            club_id: clubId,
            name: c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            description: c.description || null,
            is_private: c.isPrivate,
          }));
        if (channelsToInsert.length > 0) {
          await supabase.from('message_channels').delete().eq('club_id', clubId);
          await supabase.from('message_channels').insert(channelsToInsert);
        }
      }

      // Step 4: Save programs
      if (onboardingData.programs && onboardingData.programs.length > 0) {
        await supabase.from('programs').delete().eq('club_id', clubId);
        const programsToInsert = onboardingData.programs.map(p => ({
          club_id: clubId,
          name: p.name,
          description: p.description ?? '',
          season_start: p.seasonStart ?? null,
          season_end: p.seasonEnd ?? null,
          practice_days: p.practiceDays ?? [],
          practice_time: p.practiceTime ?? null,
          practice_end_time: p.practiceEndTime ?? null,
          price: p.price ?? null,
          payment_type: p.paymentType ?? 'one-time',
        }));
        const { error: programsError } = await supabase.from('programs').insert(programsToInsert);
        if (programsError) console.error('Programs insert error:', programsError);
      }

      // Step 5: Auto-generate calendar events for each program
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

      // Step 6: Store club slug in localStorage
      const { data: clubData } = await supabase
        .from('clubs').select('slug').eq('id', clubId).single();
      if (clubData?.slug) localStorage.setItem('clubSlug', clubData.slug);

      // Step 7: Navigate ONLY after everything is saved successfully
      navigate("/wrestling/dashboard");

    } catch (err: any) {
      console.error('Error saving club:', err);
      setSaveError('Something went wrong saving your data. Please try again.');
    } finally {
      setSaving(false);
    }
  }

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
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };

  const renderStepContent = () => {
    switch (currentStep.id) {
      case 'club-info': return <ClubInfoStep data={onboardingData} onChange={handleDataChange} />;
      case 'location': return <LocationStep data={onboardingData} onChange={handleDataChange} />;
      case 'programs': return <ProgramsStep data={onboardingData} onChange={handleDataChange} />;
      case 'features': return <FeaturesStep data={onboardingData} onChange={handleDataChange} />;
      case 'website': return <WebsiteStep data={onboardingData} onChange={handleDataChange} />;
      case 'schedule': return <ScheduleStep data={onboardingData} onChange={handleDataChange} />;
      case 'messaging': return <MessagingStep data={onboardingData} onChange={handleDataChange} />;
      case 'payments': return <PaymentsStep data={onboardingData} onChange={handleDataChange} />;
      case 'registration': return <RegistrationStep data={onboardingData} onChange={handleDataChange} />;
      case 'merch': return <MerchStep data={onboardingData} onChange={handleDataChange} />;
      case 'branding': return <BrandingStep data={onboardingData} onChange={handleDataChange} clubName={clubName} />;
      default: return null;
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
              <span className="text-2xl font-display">MAT MANAGER</span>
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
                    ${status === 'completed' || status === 'current'
                      ? "bg-gold border-gold text-navy"
                      : "border-border text-muted-foreground"
                    }
                  `}>
                    {status === 'completed'
                      ? <CheckCircle className="h-5 w-5" />
                      : <StepIcon className="h-5 w-5" />
                    }
                  </div>
                  {index < Math.min(steps.length - 1, 5) && (
                    <div className={`w-8 md:w-16 h-0.5 mx-1 flex-shrink-0 ${status === 'completed' ? "bg-gold" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
            {steps.length > 6 && (
              <span className="text-sm text-muted-foreground ml-2 flex-shrink-0">+{steps.length - 6} more</span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium">{currentStep.title}</span>
            <span className="text-muted-foreground">Step {currentStepIndex + 1} of {steps.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="bg-card rounded-2xl shadow-card p-8">
          {renderStepContent()}

          {saveError && (
            <div className="mt-4 p-3 rounded-lg bg-wrestling-red/10 border border-wrestling-red/20 text-wrestling-red text-sm">
              {saveError}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button variant="outline" onClick={handleBack} disabled={currentStepIndex === 0 || saving}>
              <ArrowLeft className="h-4 w-4 mr-2" />Back
            </Button>
            <Button variant="hero" onClick={handleNext} disabled={saving}>
              {saving
                ? "Saving your club..."
                : currentStepIndex === steps.length - 1
                  ? "Complete Setup"
                  : "Continue"
              }
              {!saving && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
