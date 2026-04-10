import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Globe } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";

interface ClubInfoStepProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

export default function ClubInfoStep({ data, onChange }: ClubInfoStepProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display mb-2">Tell us about your club</h2>
        <p className="text-muted-foreground">This information will appear on your club's website</p>
      </div>

      <div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="clubName">Club Name</Label>
    <Input
      id="clubName"
      placeholder="e.g., Westside Wrestling Club"
      value={data.clubName ?? ''}
      onChange={(e) => onChange({ clubName: e.target.value })}
    />
  </div>
  <div className="space-y-2">
    <Label htmlFor="description">Club Description</Label>
          <Textarea
            id="description"
            placeholder="Tell us about your wrestling club's history, mission, and what makes it special..."
            value={data.description}
            onChange={(e) => onChange({ description: e.target.value })}
            rows={4}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={data.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website (optional)</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                type="url"
                placeholder="www.yourclub.com"
                value={data.website}
                onChange={(e) => onChange({ website: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
