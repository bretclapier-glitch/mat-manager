import { BaseballOnboardingData } from "@/types/baseball-onboarding";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BaseballBrandingStepProps {
  data: BaseballOnboardingData;
  onChange: (updates: Partial<BaseballOnboardingData>) => void;
  orgName: string;
}

export default function BaseballBrandingStep({ data, onChange, orgName }: BaseballBrandingStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display mb-2">TEAM BRANDING</h2>
        <p className="text-muted-foreground">Customize the look and feel of your organization's site.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Primary Color</Label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={data.primaryColor}
              onChange={(e) => onChange({ primaryColor: e.target.value })}
              className="w-14 h-14 rounded-lg cursor-pointer border-2 border-border"
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
              className="w-14 h-14 rounded-lg cursor-pointer border-2 border-border"
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
      <div className="space-y-2">
        <Label>Preview</Label>
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: data.secondaryColor }}
        >
          <div className="p-8 text-center">
            <h3 className="text-2xl font-display text-white mb-2">
              {(orgName || data.orgName || 'YOUR TEAM').toUpperCase()}
            </h3>
            <p className="text-sm" style={{ color: data.primaryColor }}>
              HomeTeam Baseball
            </p>
            <div className="flex justify-center gap-3 mt-4">
              <button
                className="px-6 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: data.primaryColor, color: data.secondaryColor }}
              >
                Register Now
              </button>
              <button
                className="px-6 py-2 rounded-lg text-sm font-semibold border border-white/30 text-white"
              >
                View Teams
              </button>
            </div>
          </div>
          <div className="bg-white/10 p-3 flex justify-center gap-6 text-xs text-white/60">
            <span>Teams</span>
            <span>Schedule</span>
            <span>Register</span>
            <span>Store</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-secondary/50 border border-dashed">
        <p className="text-sm text-muted-foreground">
          <strong>Logo upload:</strong> You'll be able to upload your team logo from the dashboard after completing setup.
        </p>
      </div>
    </div>
  );
}
