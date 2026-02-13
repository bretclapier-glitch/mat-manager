import { BaseballOnboardingData } from "@/types/baseball-onboarding";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, CloudSun, Leaf, Calendar } from "lucide-react";

interface BaseballScheduleStepProps {
  data: BaseballOnboardingData;
  onChange: (updates: Partial<BaseballOnboardingData>) => void;
}

const seasons = [
  { id: 'spring', label: 'Spring Season', desc: 'Feb – May', icon: Sun },
  { id: 'summer', label: 'Summer Ball', desc: 'Jun – Aug', icon: CloudSun },
  { id: 'fall', label: 'Fall Ball', desc: 'Sep – Nov', icon: Leaf },
  { id: 'year-round', label: 'Year-Round', desc: 'All seasons', icon: Calendar },
];

export default function BaseballScheduleStep({ data, onChange }: BaseballScheduleStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display mb-2">GAME SCHEDULE</h2>
        <p className="text-muted-foreground">Set up your season structure and scheduling preferences.</p>
      </div>

      <div className="space-y-2">
        <Label>Primary Season *</Label>
        <RadioGroup
          value={data.seasonType}
          onValueChange={(v) => onChange({ seasonType: v as BaseballOnboardingData['seasonType'] })}
          className="grid grid-cols-2 gap-3"
        >
          {seasons.map((s) => (
            <label
              key={s.id}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                data.seasonType === s.id
                  ? "border-[hsl(150,45%,35%)] bg-[hsl(150,45%,35%)]/5"
                  : "border-border hover:border-[hsl(150,45%,35%)]/30"
              }`}
            >
              <RadioGroupItem value={s.id} className="sr-only" />
              <s.icon className={`h-5 w-5 ${data.seasonType === s.id ? "text-[hsl(150,45%,35%)]" : "text-muted-foreground"}`} />
              <div>
                <p className="font-medium text-sm">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>

      <Card className="bg-secondary/30">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> You can configure detailed practice schedules, game times, and tournament dates per team from your dashboard after setup.
          </p>
        </CardContent>
      </Card>

      {data.teams.length > 0 && (
        <div className="space-y-3">
          <Label>Team Schedule Preview</Label>
          {data.teams.map((team) => (
            <div key={team.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div>
                <p className="font-medium text-sm">{team.name}</p>
                <p className="text-xs text-muted-foreground">{team.ageGroup} • {team.type}</p>
              </div>
              <span className="text-xs text-muted-foreground">Configure after setup →</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
