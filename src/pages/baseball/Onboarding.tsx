import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Target,
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
import { BaseballOnboardingData, defaultBaseballOnboardingData } from "@/types/baseball-onboarding";
import OrgInfoStep from "@/components/onboarding/baseball/OrgInfoStep";
import BaseballLocationStep from "@/components/onboarding/baseball/BaseballLocationStep";
import TeamsStep from "@/components/onboarding/baseball/TeamsStep";
import BaseballFeaturesStep from "@/components/onboarding/baseball/BaseballFeaturesStep";
import BaseballWebsiteStep from "@/components/onboarding/baseball/BaseballWebsiteStep";
import BaseballScheduleStep from "@/components/onboarding/baseball/BaseballScheduleStep";
import BaseballMessagingStep from "@/components/onboarding/baseball/BaseballMessagingStep";
import BaseballPaymentsStep from "@/components/onboarding/baseball/BaseballPaymentsStep";
import BaseballRegistrationStep from "@/components/onboarding/baseball/BaseballRegistrationStep";
import BaseballMerchStep from "@/components/onboarding/baseball/BaseballMerchStep";
import BaseballBrandingStep from "@/components/onboarding/baseball/BaseballBrandingStep";

interface Step {
  id: string;
  title: string;
  icon: React.ElementType;
}

const baseSteps: Step[] = [
  { id: 'org-info', title: 'Organization', icon: Target },
  { id: 'location', title: 'Home Field', icon: MapPin },
  { id: 'teams', title: 'Teams', icon: Users },
  { id: 'features', title: 'Features', icon: Settings },
];

const featureSteps: Record<string, Step> = {
  website: { id: 'website', title: 'Website', icon: Globe },
  schedule: { id: 'schedule', title: 'Schedule', icon: Calendar },
  messaging: { id: 'messaging', title: 'Messaging', icon: MessageSquare },
  payments: { id: 'payments', title: 'Payments', icon: CreditCard },
  registration: { id: 'registration', title: 'Registration', icon: ClipboardList },
  merch: { id: 'merch', title: 'Team Store', icon: ShoppingBag },
};

const finalStep: Step = { id: 'branding', title: 'Branding', icon: Palette };

export default function BaseballOnboarding() {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [orgName, setOrgName] = useState('');
  const [data, setData] = useState<BaseballOnboardingData>(defaultBaseballOnboardingData);

  useEffect(() => {
    const stored = sessionStorage.getItem('baseballSignup');
    if (stored) {
      const { orgName } = JSON.parse(stored);
      setOrgName(orgName);
    }
  }, []);

  const steps = useMemo(() => {
    const dynamic = [...baseSteps];
    const featureOrder = ['website', 'schedule', 'messaging', 'payments', 'registration', 'merch'];
    featureOrder.forEach((feature) => {
      if (data.selectedFeatures.includes(feature) && featureSteps[feature]) {
        dynamic.push(featureSteps[feature]);
      }
    });
    dynamic.push(finalStep);
    return dynamic;
  }, [data.selectedFeatures]);

  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleDataChange = (updates: Partial<BaseballOnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      sessionStorage.setItem('baseballOnboardingData', JSON.stringify(data));
      navigate("/baseball/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  const renderStepContent = () => {
    switch (currentStep.id) {
      case 'org-info': return <OrgInfoStep data={data} onChange={handleDataChange} />;
      case 'location': return <BaseballLocationStep data={data} onChange={handleDataChange} />;
      case 'teams': return <TeamsStep data={data} onChange={handleDataChange} />;
      case 'features': return <BaseballFeaturesStep data={data} onChange={handleDataChange} />;
      case 'website': return <BaseballWebsiteStep data={data} onChange={handleDataChange} />;
      case 'schedule': return <BaseballScheduleStep data={data} onChange={handleDataChange} />;
      case 'messaging': return <BaseballMessagingStep data={data} onChange={handleDataChange} />;
      case 'payments': return <BaseballPaymentsStep data={data} onChange={handleDataChange} />;
      case 'registration': return <BaseballRegistrationStep data={data} onChange={handleDataChange} />;
      case 'merch': return <BaseballMerchStep data={data} onChange={handleDataChange} />;
      case 'branding': return <BaseballBrandingStep data={data} onChange={handleDataChange} orgName={orgName} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-8 w-8 text-[hsl(150,45%,45%)]" />
              <span className="text-2xl font-display">HOMETEAM BASEBALL</span>
            </div>
            <Button variant="ghost" onClick={() => navigate("/baseball/dashboard")}>
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
                      ? "bg-[hsl(150,45%,35%)] border-[hsl(150,45%,35%)] text-white"
                      : status === 'current'
                        ? "bg-[hsl(150,45%,35%)] border-[hsl(150,45%,35%)] text-white"
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
                    <div className={`w-8 md:w-16 h-0.5 mx-1 flex-shrink-0 ${status === 'completed' ? "bg-[hsl(150,45%,35%)]" : "bg-border"}`} />
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

          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button variant="outline" onClick={handleBack} disabled={currentStepIndex === 0}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext} className="bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white">
              {currentStepIndex === steps.length - 1 ? "Complete Setup" : "Continue"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
