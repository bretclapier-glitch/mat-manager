import { BaseballOnboardingData } from "@/types/baseball-onboarding";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, DollarSign, Calendar, Repeat } from "lucide-react";

interface BaseballPaymentsStepProps {
  data: BaseballOnboardingData;
  onChange: (updates: Partial<BaseballOnboardingData>) => void;
}

const paymentFeatures = [
  { icon: DollarSign, title: "Registration Fees", desc: "Collect team registration and tryout fees online" },
  { icon: Calendar, title: "Monthly Dues", desc: "Set up recurring monthly payments for players" },
  { icon: Repeat, title: "Payment Plans", desc: "Allow parents to split fees into installments" },
  { icon: CreditCard, title: "Stripe Integration", desc: "Secure payment processing with automatic deposits" },
];

export default function BaseballPaymentsStep({ data, onChange }: BaseballPaymentsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display mb-2">PAYMENTS</h2>
        <p className="text-muted-foreground">Configure how you'll collect fees and dues from families.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {paymentFeatures.map((feature) => (
          <Card key={feature.title} className="shadow-sm">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[hsl(150,45%,35%)]/10 flex items-center justify-center shrink-0">
                <feature.icon className="h-5 w-5 text-[hsl(150,45%,35%)]" />
              </div>
              <div>
                <p className="font-semibold text-sm">{feature.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-secondary/30 border-dashed">
        <CardContent className="p-6 text-center">
          <CreditCard className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
          <p className="font-medium">Stripe will be connected after setup</p>
          <p className="text-sm text-muted-foreground mt-1">
            You'll connect your Stripe account from your dashboard to start accepting payments.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
