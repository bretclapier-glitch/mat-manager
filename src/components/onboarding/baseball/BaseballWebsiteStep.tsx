import { BaseballOnboardingData } from "@/types/baseball-onboarding";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe, Link } from "lucide-react";

interface BaseballWebsiteStepProps {
  data: BaseballOnboardingData;
  onChange: (updates: Partial<BaseballOnboardingData>) => void;
}

export default function BaseballWebsiteStep({ data, onChange }: BaseballWebsiteStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display mb-2">TEAM WEBSITE</h2>
        <p className="text-muted-foreground">Set up your organization's online presence.</p>
      </div>

      <RadioGroup
        value={data.hasExistingWebsite ? 'existing' : 'new'}
        onValueChange={(v) => onChange({ hasExistingWebsite: v === 'existing' })}
        className="grid grid-cols-2 gap-4"
      >
        <label className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all ${
          !data.hasExistingWebsite ? "border-[hsl(150,45%,35%)] bg-[hsl(150,45%,35%)]/5" : "border-border hover:border-[hsl(150,45%,35%)]/30"
        }`}>
          <RadioGroupItem value="new" className="sr-only" />
          <Globe className={`h-8 w-8 ${!data.hasExistingWebsite ? "text-[hsl(150,45%,35%)]" : "text-muted-foreground"}`} />
          <span className="font-semibold">Build with HomeTeam</span>
          <span className="text-xs text-muted-foreground text-center">We'll create a branded site for your organization</span>
        </label>
        <label className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all ${
          data.hasExistingWebsite ? "border-[hsl(150,45%,35%)] bg-[hsl(150,45%,35%)]/5" : "border-border hover:border-[hsl(150,45%,35%)]/30"
        }`}>
          <RadioGroupItem value="existing" className="sr-only" />
          <Link className={`h-8 w-8 ${data.hasExistingWebsite ? "text-[hsl(150,45%,35%)]" : "text-muted-foreground"}`} />
          <span className="font-semibold">Link Existing Site</span>
          <span className="text-xs text-muted-foreground text-center">Connect your current website</span>
        </label>
      </RadioGroup>

      {data.hasExistingWebsite && (
        <div className="space-y-2">
          <Label>Existing Website URL</Label>
          <Input
            value={data.existingWebsiteUrl}
            onChange={(e) => onChange({ existingWebsiteUrl: e.target.value })}
            placeholder="https://yourteam.com"
          />
        </div>
      )}
    </div>
  );
}
