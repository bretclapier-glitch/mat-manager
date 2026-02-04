import { 
  Globe, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  ClipboardList, 
  ShoppingBag,
  CheckCircle 
} from "lucide-react";
import { OnboardingData, FEATURE_OPTIONS } from "@/types/onboarding";

interface FeaturesStepProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

const iconMap = {
  Globe,
  Calendar,
  MessageSquare,
  CreditCard,
  ClipboardList,
  ShoppingBag,
};

export default function FeaturesStep({ data, onChange }: FeaturesStepProps) {
  const toggleFeature = (featureId: string) => {
    const newFeatures = data.selectedFeatures.includes(featureId)
      ? data.selectedFeatures.filter(f => f !== featureId)
      : [...data.selectedFeatures, featureId];
    onChange({ selectedFeatures: newFeatures });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display mb-2">What do you need?</h2>
        <p className="text-muted-foreground">Select the features you want to set up</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {FEATURE_OPTIONS.map((feature) => {
          const Icon = iconMap[feature.icon as keyof typeof iconMap];
          const isSelected = data.selectedFeatures.includes(feature.id);
          
          return (
            <button
              key={feature.id}
              type="button"
              onClick={() => toggleFeature(feature.id)}
              className={`
                p-5 rounded-xl border-2 text-left transition-all
                ${isSelected
                  ? "border-gold bg-gold/10"
                  : "border-border hover:border-gold/50"
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`
                  p-3 rounded-lg
                  ${isSelected ? "bg-gold/20" : "bg-muted"}
                `}>
                  <Icon className={`h-6 w-6 ${isSelected ? "text-gold" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{feature.label}</h3>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-gold" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don't worry, you can always add more features later
      </p>
    </div>
  );
}
