import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Users,
  FileText,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const programs: Record<string, { name: string; price: number; duration: string; schedule: string; startDate: string }> = {
  "1": { name: "Youth Wrestling", price: 150, duration: "8 weeks", schedule: "Tue/Thu 5:00-6:00 PM", startDate: "March 1, 2024" },
  "2": { name: "Middle School", price: 200, duration: "10 weeks", schedule: "Mon/Wed/Fri 4:00-5:30 PM", startDate: "March 1, 2024" },
  "3": { name: "High School", price: 250, duration: "12 weeks", schedule: "Mon-Fri 3:30-5:30 PM", startDate: "March 1, 2024" },
  "4": { name: "Summer Camp", price: 300, duration: "1 week", schedule: "Mon-Fri 9:00 AM - 3:00 PM", startDate: "June 10, 2024" },
};

const steps = [
  { id: 1, name: "Wrestler Info", icon: User },
  { id: 2, name: "Parent Info", icon: Users },
  { id: 3, name: "Waiver", icon: FileText },
  { id: 4, name: "Payment", icon: CreditCard },
  { id: 5, name: "Complete", icon: CheckCircle },
];

export default function ClubRegister() {
  const { clubSlug, programId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [waiverSigned, setWaiverSigned] = useState(false);
  const [formData, setFormData] = useState({
    usaWrestlingNumber: "",
    wrestlerFirstName: "", wrestlerLastName: "", wrestlerDOB: "", wrestlerGender: "",
    wrestlerGrade: "", experience: "", shirtSize: "",
    parentFirstName: "", parentLastName: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "",
    emergencyContact: "", emergencyPhone: "",
    medicalConditions: "", allergies: "", medications: "",
  });

  const program = programs[programId || "1"];
  const basePath = `/wrestling/club/${clubSlug}`;

  if (!program) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Program Not Found</h2>
            <Link to={`${basePath}/programs`}>
              <Button>View All Programs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => { if (currentStep < 5) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };
  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Program Summary */}
      <Card className="mb-6 bg-navy text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Link to={`${basePath}/programs`} className="text-white/60 hover:text-white text-sm flex items-center gap-1 mb-2">
                <ArrowLeft className="h-3 w-3" /> Back to programs
              </Link>
              <h1 className="text-2xl font-display">{program.name.toUpperCase()}</h1>
              <p className="text-white/70">{program.schedule} • Starts {program.startDate}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gold">${program.price}</p>
              <p className="text-white/70">{program.duration}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isComplete = currentStep > step.id;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isComplete ? "bg-wrestling-green text-white" : isActive ? "bg-gold text-navy" : "bg-muted text-muted-foreground"
                }`}>
                  {isComplete ? <CheckCircle className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                </div>
                <span className={`text-xs mt-2 hidden sm:block ${isActive ? "font-semibold" : "text-muted-foreground"}`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Step Content */}
      <Card className="shadow-card">
        {currentStep === 1 && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-display">WRESTLER INFORMATION</CardTitle>
              <CardDescription>Tell us about the wrestler who will be participating</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-gold bg-gold/10">
                <AlertCircle className="h-4 w-4 text-gold" />
                <AlertDescription className="text-sm">
                  <strong>USA Wrestling membership is required.</strong> All wrestlers must have an active USA Wrestling card to participate. This ensures proper insurance coverage for your athlete.
                  <br />
                  <span className="text-muted-foreground mt-1 block">
                    Don't have a USA Wrestling card?{" "}
                    <a
                      href="https://www.usawmembership.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold underline hover:text-gold-light font-medium"
                    >
                      Follow these instructions to get one →
                    </a>
                  </span>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>USA Wrestling Number *</Label>
                <Input
                  value={formData.usaWrestlingNumber}
                  onChange={(e) => handleInputChange("usaWrestlingNumber", e.target.value)}
                  placeholder="Enter USA Wrestling membership number"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input value={formData.wrestlerFirstName} onChange={(e) => handleInputChange("wrestlerFirstName", e.target.value)} placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input value={formData.wrestlerLastName} onChange={(e) => handleInputChange("wrestlerLastName", e.target.value)} placeholder="Enter last name" />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Date of Birth *</Label>
                  <Input type="date" value={formData.wrestlerDOB} onChange={(e) => handleInputChange("wrestlerDOB", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select value={formData.wrestlerGender} onValueChange={(v) => handleInputChange("wrestlerGender", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Grade *</Label>
                  <Select value={formData.wrestlerGrade} onValueChange={(v) => handleInputChange("wrestlerGrade", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["K","1","2","3","4","5","6","7","8","9","10","11","12"].map((g) => (
                        <SelectItem key={g} value={g}>{g === "K" ? "Kindergarten" : `${g}th Grade`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Medical Conditions</Label>
                <Textarea value={formData.medicalConditions} onChange={(e) => handleInputChange("medicalConditions", e.target.value)} placeholder="List any medical conditions..." rows={3} />
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 2 && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-display">PARENT / GUARDIAN</CardTitle>
              <CardDescription>Primary contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input value={formData.parentFirstName} onChange={(e) => handleInputChange("parentFirstName", e.target.value)} placeholder="First name" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input value={formData.parentLastName} onChange={(e) => handleInputChange("parentLastName", e.target.value)} placeholder="Last name" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="parent@email.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="(555) 123-4567" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address *</Label>
                <Input value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} placeholder="123 Main St" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} placeholder="Austin" />
                </div>
                <div className="space-y-2">
                  <Label>State *</Label>
                  <Select value={formData.state} onValueChange={(v) => handleInputChange("state", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>ZIP *</Label>
                  <Input value={formData.zip} onChange={(e) => handleInputChange("zip", e.target.value)} placeholder="78701" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Emergency Contact *</Label>
                  <Input value={formData.emergencyContact} onChange={(e) => handleInputChange("emergencyContact", e.target.value)} placeholder="Contact name" />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Phone *</Label>
                  <Input type="tel" value={formData.emergencyPhone} onChange={(e) => handleInputChange("emergencyPhone", e.target.value)} placeholder="(555) 123-4567" />
                </div>
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 3 && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-display">LIABILITY WAIVER</CardTitle>
              <CardDescription>Please read and sign the waiver to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-64 overflow-y-auto p-4 rounded-lg bg-secondary/50 text-sm text-muted-foreground border">
                <h4 className="font-bold text-foreground mb-2">Assumption of Risk & Liability Waiver</h4>
                <p className="mb-3">I acknowledge that wrestling involves physical contact and carries inherent risks of injury. I voluntarily assume all risks associated with participation in wrestling activities...</p>
                <p className="mb-3">I hereby release, waive, and discharge the club, its coaches, volunteers, and affiliates from any and all liability, claims, demands, or causes of action arising from participation...</p>
                <p className="mb-3">I grant permission for emergency medical treatment if needed and agree to be responsible for any associated costs...</p>
                <p>I confirm that the wrestler is in good physical health and has no conditions that would prevent safe participation, other than those disclosed in this registration.</p>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox checked={waiverSigned} onCheckedChange={(c) => setWaiverSigned(c === true)} />
                <Label className="text-sm leading-relaxed">
                  I have read and agree to the liability waiver. I am the parent or legal guardian of the wrestler named above and have the authority to sign this waiver on their behalf.
                </Label>
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 4 && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl font-display">PAYMENT</CardTitle>
              <CardDescription>Complete your registration with payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Card className="bg-secondary/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>{program.name} Registration</span>
                    <span className="font-bold">${program.price}.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Processing fee</span>
                    <span>$3.50</span>
                  </div>
                  <div className="border-t mt-3 pt-3 flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span className="text-gold">${(program.price + 3.5).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
              <div className="p-6 rounded-lg border-2 border-dashed border-muted text-center text-muted-foreground">
                <CreditCard className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Payment integration coming soon</p>
                <p className="text-sm">Stripe checkout will be integrated here</p>
              </div>
            </CardContent>
          </>
        )}

        {currentStep === 5 && (
          <>
            <CardContent className="py-16 text-center">
              <div className="w-20 h-20 bg-wrestling-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-wrestling-green" />
              </div>
              <h2 className="text-3xl font-display mb-4">REGISTRATION COMPLETE!</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {formData.wrestlerFirstName || "Your wrestler"} has been registered for {program.name}. Check your email for confirmation details.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to={`${basePath}/parent`}>
                  <Button variant="hero">Go to Parent Dashboard</Button>
                </Link>
                <Link to={`${basePath}/programs`}>
                  <Button variant="outline">Register Another Wrestler</Button>
                </Link>
              </div>
            </CardContent>
          </>
        )}

        {/* Navigation */}
        {currentStep < 5 && (
          <div className="px-6 pb-6 flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button
              variant="hero"
              onClick={nextStep}
              disabled={currentStep === 3 && !waiverSigned}
            >
              {currentStep === 4 ? "Complete Registration" : "Continue"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
