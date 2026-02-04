import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, CreditCard } from "lucide-react";
import { OnboardingData, Program } from "@/types/onboarding";

interface PaymentsStepProps {
  data: OnboardingData;
  onChange: (data: Partial<OnboardingData>) => void;
}

export default function PaymentsStep({ data, onChange }: PaymentsStepProps) {
  const updateProgram = (id: string, updates: Partial<Program>) => {
    onChange({
      programs: data.programs.map(p => 
        p.id === id ? { ...p, ...updates } : p
      )
    });
  };

  if (data.programs.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display mb-2">Program Pricing</h2>
          <p className="text-muted-foreground">Set prices for each program</p>
        </div>
        <div className="text-center py-12 bg-muted/30 rounded-xl">
          <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            You haven't added any programs yet.<br />
            Go back to add programs first, or skip this step for now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display mb-2">Program Pricing</h2>
        <p className="text-muted-foreground">Set prices for each program</p>
      </div>

      <div className="space-y-4">
        {data.programs.map((program) => (
          <div 
            key={program.id} 
            className="p-5 rounded-xl border bg-card space-y-4"
          >
            <h3 className="font-semibold text-lg">{program.name || 'Unnamed Program'}</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={program.price || ''}
                    onChange={(e) => updateProgram(program.id, { 
                      price: parseFloat(e.target.value) || undefined 
                    })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Type</Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateProgram(program.id, { paymentType: 'one-time' })}
                    className={`
                      flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${program.paymentType === 'one-time'
                        ? "bg-gold text-navy"
                        : "bg-muted hover:bg-muted/80"
                      }
                    `}
                  >
                    One-time
                  </button>
                  <button
                    type="button"
                    onClick={() => updateProgram(program.id, { paymentType: 'monthly' })}
                    className={`
                      flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${program.paymentType === 'monthly'
                        ? "bg-gold text-navy"
                        : "bg-muted hover:bg-muted/80"
                      }
                    `}
                  >
                    Monthly
                  </button>
                </div>
              </div>
            </div>

            {program.price && program.paymentType && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm">
                  <span className="font-medium">${program.price}</span>
                  {program.paymentType === 'monthly' ? '/month' : ' one-time payment'}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Payment processing will be set up through Stripe after onboarding
      </p>
    </div>
  );
}
