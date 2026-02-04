import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Trophy } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";

interface BrandingStepProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
  clubName?: string;
}

export default function BrandingStep({ data, onChange, clubName }: BrandingStepProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display mb-2">Customize your brand</h2>
        <p className="text-muted-foreground">Upload your logo and choose your colors</p>
      </div>

      <div className="space-y-6">
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-gold/50 transition-colors cursor-pointer">
          <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="font-medium mb-1">Upload your club logo</p>
          <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={data.primaryColor}
                onChange={(e) => onChange({ primaryColor: e.target.value })}
                className="w-12 h-12 rounded-lg cursor-pointer border-0"
              />
              <Input
                value={data.primaryColor}
                onChange={(e) => onChange({ primaryColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Secondary Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={data.secondaryColor}
                onChange={(e) => onChange({ secondaryColor: e.target.value })}
                className="w-12 h-12 rounded-lg cursor-pointer border-0"
              />
              <Input
                value={data.secondaryColor}
                onChange={(e) => onChange({ secondaryColor: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-xl overflow-hidden border">
          <div 
            className="p-6 text-white"
            style={{ backgroundColor: data.secondaryColor }}
          >
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6" style={{ color: data.primaryColor }} />
              <span className="text-xl font-display">{clubName || 'YOUR CLUB'}</span>
            </div>
          </div>
          <div className="p-6 bg-card">
            <Button 
              style={{ backgroundColor: data.primaryColor }}
              className="text-white"
            >
              Sample Button
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
