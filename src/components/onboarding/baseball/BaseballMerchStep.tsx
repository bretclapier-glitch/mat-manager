import { BaseballOnboardingData } from "@/types/baseball-onboarding";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingBag, Store, Ban } from "lucide-react";

interface BaseballMerchStepProps {
  data: BaseballOnboardingData;
  onChange: (updates: Partial<BaseballOnboardingData>) => void;
}

const options = [
  { id: 'existing', label: 'Existing Store', desc: 'Link your current online store', icon: Store },
  { id: 'shopify', label: 'HomeTeam Store', desc: "We'll set up a team store for you", icon: ShoppingBag },
  { id: 'none', label: 'Skip for Now', desc: "I'll set this up later", icon: Ban },
];

export default function BaseballMerchStep({ data, onChange }: BaseballMerchStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display mb-2">TEAM STORE</h2>
        <p className="text-muted-foreground">Sell uniforms, gear, and team merchandise to families.</p>
      </div>

      <RadioGroup
        value={data.merchSetupType}
        onValueChange={(v) => onChange({ merchSetupType: v as 'existing' | 'shopify' | 'none' })}
        className="space-y-3"
      >
        {options.map((opt) => (
          <label
            key={opt.id}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              data.merchSetupType === opt.id
                ? "border-[hsl(150,45%,35%)] bg-[hsl(150,45%,35%)]/5"
                : "border-border hover:border-[hsl(150,45%,35%)]/30"
            }`}
          >
            <RadioGroupItem value={opt.id} className="sr-only" />
            <opt.icon className={`h-6 w-6 ${data.merchSetupType === opt.id ? "text-[hsl(150,45%,35%)]" : "text-muted-foreground"}`} />
            <div>
              <p className="font-semibold">{opt.label}</p>
              <p className="text-sm text-muted-foreground">{opt.desc}</p>
            </div>
          </label>
        ))}
      </RadioGroup>

      {data.merchSetupType === 'existing' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Store Name</Label>
            <Input
              value={data.existingMerchStoreName}
              onChange={(e) => onChange({ existingMerchStoreName: e.target.value })}
              placeholder="e.g., Thunder Baseball Gear"
            />
          </div>
          <div className="space-y-2">
            <Label>Store URL</Label>
            <Input
              value={data.existingMerchStoreUrl}
              onChange={(e) => onChange({ existingMerchStoreUrl: e.target.value })}
              placeholder="https://store.example.com"
            />
          </div>
        </div>
      )}
    </div>
  );
}
