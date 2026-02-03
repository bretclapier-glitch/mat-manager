import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trophy,
  ArrowLeft,
  ArrowRight,
  User,
  Users,
  FileText,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const programs: Record<string, {
  id: number;
  name: string;
  ageRange: string;
  price: number;
  duration: string;
  schedule: string;
  startDate: string;
}> = {
  "1": {
    id: 1,
    name: "Youth Wrestling",
    ageRange: "6-10 years",
    price: 150,
    duration: "8 weeks",
    schedule: "Tue/Thu 5:00-6:00 PM",
    startDate: "March 1, 2024",
  },
  "2": {
    id: 2,
    name: "Middle School",
    ageRange: "11-14 years",
    price: 200,
    duration: "10 weeks",
    schedule: "Mon/Wed/Fri 4:00-5:30 PM",
    startDate: "March 1, 2024",
  },
  "3": {
    id: 3,
    name: "High School",
    ageRange: "14-18 years",
    price: 250,
    duration: "12 weeks",
    schedule: "Mon-Fri 3:30-5:30 PM",
    startDate: "March 1, 2024",
  },
  "4": {
    id: 4,
    name: "Summer Camp",
    ageRange: "6-18 years",
    price: 300,
    duration: "1 week",
    schedule: "Mon-Fri 9:00 AM - 3:00 PM",
    startDate: "June 10, 2024",
  },
};

const steps = [
  { id: 1, name: "Wrestler Info", icon: User },
  { id: 2, name: "Parent Info", icon: Users },
  { id: 3, name: "Waiver", icon: FileText },
  { id: 4, name: "Payment", icon: CreditCard },
  { id: 5, name: "Complete", icon: CheckCircle },
];

export default function PublicRegister() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [waiverSigned, setWaiverSigned] = useState(false);
  const [formData, setFormData] = useState({
    // Wrestler
    wrestlerFirstName: "",
    wrestlerLastName: "",
    wrestlerDOB: "",
    wrestlerGender: "",
    wrestlerGrade: "",
    experience: "",
    shirtSize: "",
    // Parent
    parentFirstName: "",
    parentLastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    emergencyContact: "",
    emergencyPhone: "",
    // Medical
    medicalConditions: "",
    allergies: "",
    medications: "",
  });

  const program = programs[programId || "1"];

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Program Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The program you're looking for doesn't exist.
            </p>
            <Link to="/programs">
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

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="border-b bg-navy text-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/programs" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center">
              <Trophy className="h-6 w-6 text-navy" />
            </div>
            <span className="font-display text-xl">THUNDER WRESTLING CLUB</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Program Summary */}
        <Card className="mb-6 bg-navy text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-display">{program.name.toUpperCase()}</h1>
                <p className="text-white/70">
                  {program.schedule} • Starts {program.startDate}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gold">${program.price}</p>
                <p className="text-white/70">{program.duration}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isComplete = currentStep > step.id;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isComplete
                        ? "bg-wrestling-green text-white"
                        : isActive
                        ? "bg-gold text-navy"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 hidden sm:block ${
                      isActive ? "font-semibold" : "text-muted-foreground"
                    }`}
                  >
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
                <CardDescription>
                  Tell us about the wrestler who will be participating
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wrestlerFirstName">First Name *</Label>
                    <Input
                      id="wrestlerFirstName"
                      value={formData.wrestlerFirstName}
                      onChange={(e) => handleInputChange("wrestlerFirstName", e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wrestlerLastName">Last Name *</Label>
                    <Input
                      id="wrestlerLastName"
                      value={formData.wrestlerLastName}
                      onChange={(e) => handleInputChange("wrestlerLastName", e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wrestlerDOB">Date of Birth *</Label>
                    <Input
                      id="wrestlerDOB"
                      type="date"
                      value={formData.wrestlerDOB}
                      onChange={(e) => handleInputChange("wrestlerDOB", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select
                      value={formData.wrestlerGender}
                      onValueChange={(v) => handleInputChange("wrestlerGender", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Current Grade *</Label>
                    <Select
                      value={formData.wrestlerGrade}
                      onValueChange={(v) => handleInputChange("wrestlerGrade", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="k">Kindergarten</SelectItem>
                        <SelectItem value="1">1st Grade</SelectItem>
                        <SelectItem value="2">2nd Grade</SelectItem>
                        <SelectItem value="3">3rd Grade</SelectItem>
                        <SelectItem value="4">4th Grade</SelectItem>
                        <SelectItem value="5">5th Grade</SelectItem>
                        <SelectItem value="6">6th Grade</SelectItem>
                        <SelectItem value="7">7th Grade</SelectItem>
                        <SelectItem value="8">8th Grade</SelectItem>
                        <SelectItem value="9">9th Grade</SelectItem>
                        <SelectItem value="10">10th Grade</SelectItem>
                        <SelectItem value="11">11th Grade</SelectItem>
                        <SelectItem value="12">12th Grade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Wrestling Experience</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(v) => handleInputChange("experience", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No experience</SelectItem>
                        <SelectItem value="1year">Less than 1 year</SelectItem>
                        <SelectItem value="1-2years">1-2 years</SelectItem>
                        <SelectItem value="3+years">3+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>T-Shirt Size *</Label>
                    <Select
                      value={formData.shirtSize}
                      onValueChange={(v) => handleInputChange("shirtSize", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ys">Youth Small</SelectItem>
                        <SelectItem value="ym">Youth Medium</SelectItem>
                        <SelectItem value="yl">Youth Large</SelectItem>
                        <SelectItem value="as">Adult Small</SelectItem>
                        <SelectItem value="am">Adult Medium</SelectItem>
                        <SelectItem value="al">Adult Large</SelectItem>
                        <SelectItem value="axl">Adult XL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Medical Conditions</Label>
                  <Textarea
                    value={formData.medicalConditions}
                    onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                    placeholder="List any medical conditions, injuries, or special considerations..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl font-display">PARENT / GUARDIAN INFORMATION</CardTitle>
                <CardDescription>
                  Primary contact information for the parent or legal guardian
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentFirstName">First Name *</Label>
                    <Input
                      id="parentFirstName"
                      value={formData.parentFirstName}
                      onChange={(e) => handleInputChange("parentFirstName", e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentLastName">Last Name *</Label>
                    <Input
                      id="parentLastName"
                      value={formData.parentLastName}
                      onChange={(e) => handleInputChange("parentLastName", e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="parent@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      placeholder="Austin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State *</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(v) => handleInputChange("state", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        {/* Add more states as needed */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code *</Label>
                    <Input
                      id="zip"
                      value={formData.zip}
                      onChange={(e) => handleInputChange("zip", e.target.value)}
                      placeholder="78701"
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-4">Emergency Contact (if different from above)</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Contact Name</Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                        placeholder="Emergency contact name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Contact Phone</Label>
                      <Input
                        id="emergencyPhone"
                        type="tel"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 3 && (
            <>
              <CardHeader>
                <CardTitle className="text-2xl font-display">LIABILITY WAIVER</CardTitle>
                <CardDescription>
                  Please read and sign the liability waiver to continue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-secondary/50 rounded-lg p-6 max-h-[400px] overflow-y-auto prose prose-sm">
                  <h3>Release and Waiver of Liability</h3>
                  <p>
                    In consideration of being permitted to participate in wrestling activities
                    at Thunder Wrestling Club, I hereby agree to the following:
                  </p>
                  <h4>1. Assumption of Risk</h4>
                  <p>
                    I understand that wrestling involves inherent risks including but not limited to
                    physical contact, falls, collisions, and the potential for serious injury. I
                    voluntarily assume all such risks and accept personal responsibility for any
                    damages or injuries that may occur.
                  </p>
                  <h4>2. Release of Liability</h4>
                  <p>
                    I release and hold harmless Thunder Wrestling Club, its owners, coaches,
                    volunteers, employees, and affiliates from any and all claims, damages, losses,
                    or expenses arising from participation in club activities, except for claims
                    arising from gross negligence or intentional misconduct.
                  </p>
                  <h4>3. Medical Authorization</h4>
                  <p>
                    I authorize club personnel to seek emergency medical treatment for the
                    participant if necessary and agree to be responsible for all medical expenses.
                    I certify that the participant is physically fit to participate and has no
                    known medical conditions that would prevent safe participation.
                  </p>
                  <h4>4. Photo/Video Release</h4>
                  <p>
                    I grant permission for photos and videos taken during club activities to be
                    used for promotional purposes, including social media, website, and marketing
                    materials.
                  </p>
                  <h4>5. Rules and Conduct</h4>
                  <p>
                    I agree to follow all club rules and guidelines. I understand that failure
                    to comply may result in removal from the program without refund.
                  </p>
                </div>

                <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="waiver"
                      checked={waiverSigned}
                      onCheckedChange={(checked) => setWaiverSigned(checked as boolean)}
                    />
                    <label htmlFor="waiver" className="text-sm leading-relaxed cursor-pointer">
                      <span className="font-semibold">I agree to the terms above.</span> By checking
                      this box, I acknowledge that I have read, understood, and agree to the Release
                      and Waiver of Liability. I am the parent or legal guardian of the wrestler
                      named in this registration and have the authority to sign on their behalf.
                    </label>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Parent/Guardian Name (Signature)</Label>
                    <Input
                      value={`${formData.parentFirstName} ${formData.parentLastName}`}
                      disabled
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input value={new Date().toLocaleDateString()} disabled className="bg-secondary/50" />
                  </div>
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
                <div className="bg-secondary/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>{program.name}</span>
                      <span>${program.price}.00</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Registration Fee</span>
                      <span>$25.00</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-gold">${program.price + 25}.00</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Payment Method</Label>
                  <RadioGroup defaultValue="card" className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer">
                      <RadioGroupItem value="card" id="card" />
                      <label htmlFor="card" className="flex-1 cursor-pointer">
                        <span className="font-medium">Credit/Debit Card</span>
                        <p className="text-sm text-muted-foreground">
                          Visa, Mastercard, American Express
                        </p>
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiration</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-wrestling-green" />
                  <span>Your payment information is encrypted and secure</span>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 5 && (
            <>
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-wrestling-green/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-wrestling-green" />
                </div>
                <h2 className="text-3xl font-display mb-4">REGISTRATION COMPLETE!</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Thank you for registering {formData.wrestlerFirstName || "your wrestler"} for{" "}
                  {program.name}. A confirmation email has been sent to {formData.email || "your email"}.
                </p>

                <Card className="bg-secondary/50 max-w-md mx-auto mb-8">
                  <CardContent className="p-6 text-left">
                    <h3 className="font-semibold mb-4">What's Next?</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-wrestling-green shrink-0 mt-0.5" />
                        <span>Check your email for confirmation and receipt</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-wrestling-green shrink-0 mt-0.5" />
                        <span>Mark your calendar: First practice is {program.startDate}</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-wrestling-green shrink-0 mt-0.5" />
                        <span>Bring wrestling shoes, athletic wear, and water bottle</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/programs">
                    <Button variant="outline">Register Another Wrestler</Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="hero">
                      Access Parent Portal
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation */}
          {currentStep < 5 && (
            <div className="border-t p-6 flex justify-between">
              {currentStep > 1 ? (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              ) : (
                <Link to="/programs">
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Programs
                  </Button>
                </Link>
              )}

              <Button
                variant="hero"
                onClick={nextStep}
                disabled={currentStep === 3 && !waiverSigned}
              >
                {currentStep === 4 ? "Complete Payment" : "Continue"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
