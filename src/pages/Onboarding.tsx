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

interface Step {
  id: string;
  title: string;
  icon: React.ElementType;
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
    
    // Add feature-specific steps in order
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

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Save onboarding data and navigate to dashboard
      sessionStorage.setItem('onboardingData', JSON.stringify(onboardingData));
      navigate("/dashboard");
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

  // Find completed step indices for progress display
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
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              Skip for now
            </Button>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="mb-8">
          {/* Step indicators - show max 6 */}
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
            <Button variant="hero" onClick={handleNext}>
              {currentStepIndex === steps.length - 1 ? "Complete Setup" : "Continue"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
