import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CreditCard,
  Building2,
  User,
  Shield,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  { id: 1, label: "Business Info", icon: Building2 },
  { id: 2, label: "Personal Details", icon: User },
  { id: 3, label: "Bank Account", icon: CreditCard },
  { id: 4, label: "Review & Submit", icon: Shield },
];

export default function StripeSetup() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business
    businessName: "",
    businessType: "",
    ein: "",
    businessAddress: "",
    businessCity: "",
    businessState: "",
    businessZip: "",
    businessPhone: "",
    businessWebsite: "",
    // Personal
    firstName: "",
    lastName: "",
    dob: "",
    ssn: "",
    personalAddress: "",
    personalCity: "",
    personalState: "",
    personalZip: "",
    email: "",
    phone: "",
    // Bank
    routingNumber: "",
    accountNumber: "",
    confirmAccountNumber: "",
    accountHolderName: "",
    accountType: "",
    // Agreement
    agreeTos: false,
  });

  const update = (field: string, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    // Demo: just navigate back
    navigate("/wrestling/dashboard/payments");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/wrestling/dashboard/payments")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Payments
        </Button>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-display">SET UP PAYMENTS</h1>
          <p className="text-muted-foreground">
            Connect your Stripe account to start accepting payments
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2">
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center flex-1">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all w-full ${
                  currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : currentStep > step.id
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="h-4 w-4 shrink-0" />
                ) : (
                  <step.icon className="h-4 w-4 shrink-0" />
                )}
                <span className="hidden sm:inline truncate">{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground mx-1 shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card className="shadow-card">
          <CardContent className="p-6 space-y-5">
            {currentStep === 1 && (
              <>
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-xl font-display">BUSINESS INFORMATION</CardTitle>
                  <p className="text-sm text-muted-foreground">Tell us about your organization</p>
                </CardHeader>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Business / Organization Name</Label>
                    <Input
                      placeholder="e.g. Eastside Wrestling Club"
                      value={formData.businessName}
                      onChange={(e) => update("businessName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Type</Label>
                    <Select value={formData.businessType} onValueChange={(v) => update("businessType", v)}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nonprofit">Non-Profit Organization</SelectItem>
                        <SelectItem value="sole_proprietor">Sole Proprietor</SelectItem>
                        <SelectItem value="llc">LLC</SelectItem>
                        <SelectItem value="corporation">Corporation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>EIN / Tax ID (optional)</Label>
                    <Input
                      placeholder="XX-XXXXXXX"
                      value={formData.ein}
                      onChange={(e) => update("ein", e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Business Address</Label>
                    <Input
                      placeholder="Street address"
                      value={formData.businessAddress}
                      onChange={(e) => update("businessAddress", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input value={formData.businessCity} onChange={(e) => update("businessCity", e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input value={formData.businessState} onChange={(e) => update("businessState", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>ZIP</Label>
                      <Input value={formData.businessZip} onChange={(e) => update("businessZip", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Business Phone</Label>
                    <Input placeholder="(555) 123-4567" value={formData.businessPhone} onChange={(e) => update("businessPhone", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Website (optional)</Label>
                    <Input placeholder="https://" value={formData.businessWebsite} onChange={(e) => update("businessWebsite", e.target.value)} />
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-xl font-display">PERSONAL DETAILS</CardTitle>
                  <p className="text-sm text-muted-foreground">Information about the account representative</p>
                </CardHeader>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input value={formData.firstName} onChange={(e) => update("firstName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input value={formData.lastName} onChange={(e) => update("lastName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" value={formData.dob} onChange={(e) => update("dob", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Last 4 of SSN</Label>
                    <Input placeholder="XXXX" maxLength={4} value={formData.ssn} onChange={(e) => update("ssn", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={formData.email} onChange={(e) => update("email", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input placeholder="(555) 123-4567" value={formData.phone} onChange={(e) => update("phone", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Home Address</Label>
                    <Input value={formData.personalAddress} onChange={(e) => update("personalAddress", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input value={formData.personalCity} onChange={(e) => update("personalCity", e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input value={formData.personalState} onChange={(e) => update("personalState", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>ZIP</Label>
                      <Input value={formData.personalZip} onChange={(e) => update("personalZip", e.target.value)} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-xl font-display">BANK ACCOUNT</CardTitle>
                  <p className="text-sm text-muted-foreground">Where you'll receive your payouts</p>
                </CardHeader>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-2">
                    <Label>Account Holder Name</Label>
                    <Input value={formData.accountHolderName} onChange={(e) => update("accountHolderName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Type</Label>
                    <Select value={formData.accountType} onValueChange={(v) => update("accountType", v)}>
                      <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Routing Number</Label>
                    <Input placeholder="9 digits" value={formData.routingNumber} onChange={(e) => update("routingNumber", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input type="password" value={formData.accountNumber} onChange={(e) => update("accountNumber", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Account Number</Label>
                    <Input type="password" value={formData.confirmAccountNumber} onChange={(e) => update("confirmAccountNumber", e.target.value)} />
                  </div>
                </div>
                <Card className="bg-muted/50 border-dashed mt-4">
                  <CardContent className="p-4 flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-sm">Secure & Encrypted</p>
                      <p className="text-xs text-muted-foreground">Your banking information is encrypted and sent directly to Stripe. We never store your full account details.</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {currentStep === 4 && (
              <>
                <CardHeader className="p-0 pb-2">
                  <CardTitle className="text-xl font-display">REVIEW & SUBMIT</CardTitle>
                  <p className="text-sm text-muted-foreground">Confirm your details before connecting</p>
                </CardHeader>

                <div className="space-y-4">
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Building2 className="h-4 w-4" /> Business
                      </h4>
                      <div className="text-sm space-y-1 text-muted-foreground">
                        <p>{formData.businessName || "—"}</p>
                        <p>{formData.businessType || "—"}</p>
                        <p>{[formData.businessAddress, formData.businessCity, formData.businessState, formData.businessZip].filter(Boolean).join(", ") || "—"}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <User className="h-4 w-4" /> Representative
                      </h4>
                      <div className="text-sm space-y-1 text-muted-foreground">
                        <p>{[formData.firstName, formData.lastName].filter(Boolean).join(" ") || "—"}</p>
                        <p>{formData.email || "—"}</p>
                        <p>{formData.phone || "—"}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" /> Bank Account
                      </h4>
                      <div className="text-sm space-y-1 text-muted-foreground">
                        <p>{formData.accountHolderName || "—"}</p>
                        <p>{formData.accountType ? `${formData.accountType.charAt(0).toUpperCase() + formData.accountType.slice(1)} Account` : "—"}</p>
                        <p>Routing: {formData.routingNumber ? `•••${formData.routingNumber.slice(-4)}` : "—"}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex items-start gap-3 pt-2">
                    <Checkbox
                      id="agreeTos"
                      checked={formData.agreeTos}
                      onCheckedChange={(v) => update("agreeTos", !!v)}
                    />
                    <label htmlFor="agreeTos" className="text-sm leading-snug cursor-pointer">
                      I agree to the{" "}
                      <span className="text-primary underline">Stripe Connected Account Agreement</span>{" "}
                      and authorize payment processing on behalf of my organization.
                    </label>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          {currentStep < 4 ? (
            <Button variant="hero" onClick={() => setCurrentStep((s) => s + 1)}>
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button variant="hero" onClick={handleSubmit} disabled={!formData.agreeTos}>
              <Shield className="h-4 w-4 mr-1" />
              Connect Stripe Account
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
