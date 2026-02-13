import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BaseballOnboardingData } from "@/types/baseball-onboarding";
import { Building, Trophy, Users } from "lucide-react";

interface OrgInfoStepProps {
  data: BaseballOnboardingData;
  onChange: (updates: Partial<BaseballOnboardingData>) => void;
}

const orgTypes = [
  { id: 'club', label: 'Travel Club', description: 'Competitive travel baseball organization', icon: Trophy },
  { id: 'league', label: 'Rec League', description: 'Community recreational league', icon: Users },
  { id: 'academy', label: 'Academy', description: 'Training academy or facility', icon: Building },
];

export default function OrgInfoStep({ data, onChange }: OrgInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display mb-2">ORGANIZATION INFO</h2>
        <p className="text-muted-foreground">Tell us about your baseball organization.</p>
      </div>

      <div className="space-y-2">
        <Label>Organization Type *</Label>
        <RadioGroup
          value={data.orgType}
          onValueChange={(v) => onChange({ orgType: v as 'club' | 'league' | 'academy' })}
          className="grid grid-cols-3 gap-3"
        >
          {orgTypes.map((type) => (
            <label
              key={type.id}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                data.orgType === type.id
                  ? "border-[hsl(150,45%,35%)] bg-[hsl(150,45%,35%)]/5"
                  : "border-border hover:border-[hsl(150,45%,35%)]/30"
              }`}
            >
              <RadioGroupItem value={type.id} className="sr-only" />
              <type.icon className={`h-6 w-6 ${data.orgType === type.id ? "text-[hsl(150,45%,35%)]" : "text-muted-foreground"}`} />
              <span className="font-medium text-sm">{type.label}</span>
              <span className="text-xs text-muted-foreground text-center">{type.description}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Organization Name *</Label>
        <Input
          value={data.orgName}
          onChange={(e) => onChange({ orgName: e.target.value })}
          placeholder="e.g., Austin Thunder Baseball"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Tell parents what makes your organization special..."
          rows={3}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={data.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="(555) 123-4567"
          />
        </div>
        <div className="space-y-2">
          <Label>League Affiliation</Label>
          <Input
            value={data.league}
            onChange={(e) => onChange({ league: e.target.value })}
            placeholder="e.g., USSSA, Perfect Game, Little League"
          />
        </div>
      </div>
    </div>
  );
}
