import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Link2, Sparkles } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";

interface WebsiteStepProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

export default function WebsiteStep({ data, onChange }: WebsiteStepProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display mb-2">Club Website</h2>
        <p className="text-muted-foreground">Do you already have a website?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange({ hasExistingWebsite: true })}
          className={`
            p-6 rounded-xl border-2 text-left transition-all
            ${data.hasExistingWebsite
              ? "border-gold bg-gold/10"
              : "border-border hover:border-gold/50"
            }
          `}
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className={`p-4 rounded-full ${data.hasExistingWebsite ? "bg-gold/20" : "bg-muted"}`}>
              <Link2 className={`h-8 w-8 ${data.hasExistingWebsite ? "text-gold" : "text-muted-foreground"}`} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">I have a website</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Link your existing site and add HomeTeam as a portal
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange({ hasExistingWebsite: false, existingWebsiteUrl: '' })}
          className={`
            p-6 rounded-xl border-2 text-left transition-all
            ${!data.hasExistingWebsite
              ? "border-gold bg-gold/10"
              : "border-border hover:border-gold/50"
            }
          `}
        >
          <div className="flex flex-col items-center text-center gap-4">
            <div className={`p-4 rounded-full ${!data.hasExistingWebsite ? "bg-gold/20" : "bg-muted"}`}>
              <Sparkles className={`h-8 w-8 ${!data.hasExistingWebsite ? "text-gold" : "text-muted-foreground"}`} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Build me a website</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create a beautiful club website with HomeTeam
              </p>
            </div>
          </div>
        </button>
      </div>

      {data.hasExistingWebsite && (
        <div className="space-y-2 animate-fade-in mt-6">
          <Label htmlFor="existingUrl">Your Website URL</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="existingUrl"
              type="url"
              placeholder="https://www.yourclub.com"
              value={data.existingWebsiteUrl}
              onChange={(e) => onChange({ existingWebsiteUrl: e.target.value })}
              className="pl-10"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            We'll provide you with a link to add to your website for parent registration and portal access
          </p>
        </div>
      )}

      {!data.hasExistingWebsite && (
        <div className="bg-muted/50 rounded-xl p-4 animate-fade-in">
          <p className="text-sm text-muted-foreground text-center">
            Great choice! After setup, you'll be able to customize your website with your branding, 
            programs, and all the information parents need.
          </p>
        </div>
      )}
    </div>
  );
}
