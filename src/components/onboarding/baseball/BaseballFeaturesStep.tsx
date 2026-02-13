import { BaseballOnboardingData, BASEBALL_FEATURE_OPTIONS } from "@/types/baseball-onboarding";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Globe,
  Calendar,
  MessageSquare,
  CreditCard,
  ClipboardList,
  ShoppingBag,
} from "lucide-react";

interface BaseballFeaturesStepProps {
  data: BaseballOnboardingData;
  onChange: (updates: Partial<BaseballOnboardingData>) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Calendar,
  MessageSquare,
  CreditCard,
  ClipboardList,
  ShoppingBag,
};

export default function BaseballFeaturesStep({ data, onChange }: BaseballFeaturesStepProps) {
  const toggle = (featureId: string) => {
    const current = data.selectedFeatures;
    const updated = current.includes(featureId)
      ? current.filter((f) => f !== featureId)
      : [...current, featureId];
    onChange({ selectedFeatures: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display mb-2">CHOOSE YOUR FEATURES</h2>
        <p className="text-muted-foreground">
          Select the tools you want for your organization. You can always add more later.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {BASEBALL_FEATURE_OPTIONS.map((feature) => {
          const Icon = iconMap[feature.icon];
          const isSelected = data.selectedFeatures.includes(feature.id);
          return (
            <button
              key={feature.id}
              onClick={() => toggle(feature.id)}
              className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? "border-[hsl(150,45%,35%)] bg-[hsl(150,45%,35%)]/5"
                  : "border-border hover:border-[hsl(150,45%,35%)]/30"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                isSelected ? "bg-[hsl(150,45%,35%)] text-white" : "bg-secondary text-muted-foreground"
              }`}>
                {Icon && <Icon className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{feature.label}</span>
                  <Checkbox checked={isSelected} className="pointer-events-none" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
