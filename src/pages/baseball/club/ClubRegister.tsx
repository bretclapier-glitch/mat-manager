import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, Users, FileText, CreditCard, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";

const programs: Record<string, { name: string; price: number; duration: string }> = {
  "1": { name: "8U Rec League", price: 150, duration: "12 weeks" },
  "2": { name: "10U Travel", price: 350, duration: "Season" },
  "3": { name: "12U Rec League", price: 200, duration: "12 weeks" },
  "4": { name: "14U Travel", price: 400, duration: "Season" },
};

const steps = [
  { id: 1, name: "Player Info", icon: User },
  { id: 2, name: "Parent Info", icon: Users },
  { id: 3, name: "Waiver", icon: FileText },
  { id: 4, name: "Payment", icon: CreditCard },
  { id: 5, name: "Complete", icon: CheckCircle },
];

export default function BaseballClubRegister() {
  const { clubSlug, programId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [waiverSigned, setWaiverSigned] = useState(false);
  const program = programs[programId || "1"];
  const basePath = `/baseball/club/${clubSlug}`;
  const progress = ((currentStep - 1) / 4) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-6 bg-[hsl(150,30%,12%)] text-white">
        <CardContent className="p-6">
          <Link to={`${basePath}/programs`} className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2"><ArrowLeft className="h-3 w-3" /> Back to programs</Link>
          <h1 className="text-2xl font-display">{program?.name.toUpperCase()}</h1>
          <p className="text-3xl font-bold text-[hsl(150,45%,45%)] mt-2">${program?.price}</p>
        </CardContent>
      </Card>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map(step => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isComplete = currentStep > step.id;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isComplete ? "bg-[hsl(150,45%,35%)] text-white" : isActive ? "bg-[hsl(150,45%,45%)] text-white" : "bg-muted text-muted-foreground"}`}>
                  {isComplete ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                </div>
                <span className={`text-xs mt-2 hidden sm:block ${isActive ? "font-semibold" : "text-muted-foreground"}`}>{step.name}</span>
              </div>
            );
          })}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-card">
        {currentStep === 1 && (
          <>
            <CardHeader><CardTitle className="text-2xl font-display">PLAYER INFORMATION</CardTitle><CardDescription>Tell us about the player</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>First Name *</Label><Input placeholder="First name" /></div>
                <div className="space-y-2"><Label>Last Name *</Label><Input placeholder="Last name" /></div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Date of Birth *</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>Gender *</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>T-Shirt Size</Label><Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{["YS","YM","YL","S","M","L","XL"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Position(s)</Label><Input placeholder="e.g. SS, OF, P" /></div>
                <div className="space-y-2"><Label>Bats / Throws</Label><Input placeholder="e.g. R/R" /></div>
              </div>
              <div className="space-y-2"><Label>Medical Conditions</Label><Textarea placeholder="List any conditions..." rows={2} /></div>
            </CardContent>
          </>
        )}
        {currentStep === 2 && (
          <>
            <CardHeader><CardTitle className="text-2xl font-display">PARENT / GUARDIAN</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4"><div className="space-y-2"><Label>First Name *</Label><Input /></div><div className="space-y-2"><Label>Last Name *</Label><Input /></div></div>
              <div className="grid sm:grid-cols-2 gap-4"><div className="space-y-2"><Label>Email *</Label><Input type="email" /></div><div className="space-y-2"><Label>Phone *</Label><Input type="tel" /></div></div>
              <div className="space-y-2"><Label>Address *</Label><Input /></div>
              <div className="grid sm:grid-cols-3 gap-4"><div className="space-y-2"><Label>City</Label><Input /></div><div className="space-y-2"><Label>State</Label><Input /></div><div className="space-y-2"><Label>ZIP</Label><Input /></div></div>
            </CardContent>
          </>
        )}
        {currentStep === 3 && (
          <>
            <CardHeader><CardTitle className="text-2xl font-display">LIABILITY WAIVER</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="h-48 overflow-y-auto p-4 rounded-lg bg-secondary/50 text-sm text-muted-foreground border">
                <h4 className="font-bold text-foreground mb-2">Assumption of Risk & Liability Waiver</h4>
                <p>I acknowledge that baseball involves physical activity and carries inherent risks of injury including but not limited to being struck by a ball or bat. I voluntarily assume all risks...</p>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox checked={waiverSigned} onCheckedChange={(c) => setWaiverSigned(c === true)} />
                <Label className="text-sm leading-relaxed">I have read and agree to the liability waiver.</Label>
              </div>
            </CardContent>
          </>
        )}
        {currentStep === 4 && (
          <>
            <CardHeader><CardTitle className="text-2xl font-display">PAYMENT</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <Card className="bg-secondary/50"><CardContent className="p-4">
                <div className="flex justify-between mb-2"><span>{program?.name}</span><span className="font-bold">${program?.price}.00</span></div>
                <div className="flex justify-between text-sm text-muted-foreground"><span>Processing fee</span><span>$3.50</span></div>
                <div className="border-t mt-3 pt-3 flex justify-between font-bold text-lg"><span>Total</span><span className="text-[hsl(150,45%,35%)]">${((program?.price || 0) + 3.5).toFixed(2)}</span></div>
              </CardContent></Card>
              <div className="p-6 rounded-lg border-2 border-dashed border-muted text-center text-muted-foreground">
                <CreditCard className="h-8 w-8 mx-auto mb-2" /><p className="font-medium">Payment integration coming soon</p>
              </div>
            </CardContent>
          </>
        )}
        {currentStep === 5 && (
          <CardContent className="py-16 text-center">
            <div className="w-20 h-20 bg-[hsl(150,45%,35%)]/20 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="h-10 w-10 text-[hsl(150,45%,35%)]" /></div>
            <h2 className="text-3xl font-display mb-4">REGISTRATION COMPLETE!</h2>
            <p className="text-muted-foreground mb-8">Your player has been registered. Check your email for details.</p>
            <div className="flex gap-3 justify-center">
              <Link to={`${basePath}/parent`}><Button className="bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white">Go to Dashboard</Button></Link>
              <Link to={`${basePath}/programs`}><Button variant="outline">Register Another</Button></Link>
            </div>
          </CardContent>
        )}
        {currentStep < 5 && (
          <div className="px-6 pb-6 flex justify-between">
            <Button variant="outline" onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 1}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
            <Button className="bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white" onClick={() => setCurrentStep(s => s + 1)} disabled={currentStep === 3 && !waiverSigned}>
              {currentStep === 4 ? "Complete" : "Continue"} <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
