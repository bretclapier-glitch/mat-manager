import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BaseballOnboardingData } from "@/types/baseball-onboarding";
import { MapPin } from "lucide-react";

interface BaseballLocationStepProps {
  data: BaseballOnboardingData;
  onChange: (updates: Partial<BaseballOnboardingData>) => void;
}

export default function BaseballLocationStep({ data, onChange }: BaseballLocationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display mb-2">HOME FIELD</h2>
        <p className="text-muted-foreground">Where does your organization play and practice?</p>
      </div>

      <div className="space-y-2">
        <Label>Field / Complex Name</Label>
        <Input
          value={data.fieldName}
          onChange={(e) => onChange({ fieldName: e.target.value })}
          placeholder="e.g., Thunder Field at Riverside Park"
        />
      </div>

      <div className="space-y-2">
        <Label>Address *</Label>
        <Input
          value={data.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="123 Diamond Drive"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>City *</Label>
          <Input value={data.city} onChange={(e) => onChange({ city: e.target.value })} placeholder="Austin" />
        </div>
        <div className="space-y-2">
          <Label>State *</Label>
          <Input value={data.state} onChange={(e) => onChange({ state: e.target.value })} placeholder="TX" />
        </div>
        <div className="space-y-2">
          <Label>ZIP *</Label>
          <Input value={data.zip} onChange={(e) => onChange({ zip: e.target.value })} placeholder="78701" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Number of Fields</Label>
        <Input
          type="number"
          min={1}
          value={data.fieldCount}
          onChange={(e) => onChange({ fieldCount: parseInt(e.target.value) || 1 })}
        />
      </div>

      <div className="space-y-4 p-4 rounded-xl bg-secondary/50">
        <h3 className="font-semibold text-sm">Facility Amenities</h3>
        <div className="flex items-center justify-between">
          <div>
            <Label>Batting Cages</Label>
            <p className="text-xs text-muted-foreground">On-site batting cages available</p>
          </div>
          <Switch checked={data.hasBattingCages} onCheckedChange={(c) => onChange({ hasBattingCages: c })} />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label>Bullpens</Label>
            <p className="text-xs text-muted-foreground">Dedicated pitching bullpens</p>
          </div>
          <Switch checked={data.hasBullpens} onCheckedChange={(c) => onChange({ hasBullpens: c })} />
        </div>
      </div>
    </div>
  );
}
