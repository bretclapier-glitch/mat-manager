import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  MapPin, 
  Phone, 
  Globe, 
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Users,
  Calendar,
  Palette
} from "lucide-react";

const steps = [
  { id: 1, title: "Club Info", icon: Trophy },
  { id: 2, title: "Location", icon: MapPin },
  { id: 3, title: "Programs", icon: Users },
  { id: 4, title: "Branding", icon: Palette },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [clubData, setClubData] = useState({
    description: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    website: "",
    programs: [] as string[],
    primaryColor: "#d4a739",
    secondaryColor: "#1a1f36",
  });

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const programOptions = [
    "Youth Wrestling (K-5)",
    "Middle School (6-8)",
    "High School (9-12)",
    "Adult/Masters",
    "Girls/Women's Wrestling",
    "Freestyle/Greco",
    "Private Lessons",
    "Summer Camps",
  ];

  const toggleProgram = (program: string) => {
    setClubData(prev => ({
      ...prev,
      programs: prev.programs.includes(program)
        ? prev.programs.filter(p => p !== program)
        : [...prev.programs, program]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-gold" />
              <span className="text-2xl font-display">MATMASTER</span>
            </div>
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              Skip for now
            </Button>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="container mx-auto px-6 py-8 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                  ${currentStep >= step.id 
                    ? "bg-gold border-gold text-navy" 
                    : "border-border text-muted-foreground"
                  }
                `}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 md:w-24 h-0.5 mx-2
                    ${currentStep > step.id ? "bg-gold" : "bg-border"}
                  `} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="bg-card rounded-2xl shadow-card p-8">
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-display mb-2">Tell us about your club</h2>
                <p className="text-muted-foreground">This information will appear on your club's website</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Club Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us about your wrestling club's history, mission, and what makes it special..."
                    value={clubData.description}
                    onChange={(e) => setClubData({ ...clubData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={clubData.phone}
                        onChange={(e) => setClubData({ ...clubData, phone: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website (optional)</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="website"
                        type="url"
                        placeholder="www.yourclub.com"
                        value={clubData.website}
                        onChange={(e) => setClubData({ ...clubData, website: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-display mb-2">Where are you located?</h2>
                <p className="text-muted-foreground">Help wrestlers find your facility</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="123 Wrestling Way"
                      value={clubData.address}
                      onChange={(e) => setClubData({ ...clubData, address: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Anytown"
                      value={clubData.city}
                      onChange={(e) => setClubData({ ...clubData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="PA"
                      value={clubData.state}
                      onChange={(e) => setClubData({ ...clubData, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      placeholder="12345"
                      value={clubData.zip}
                      onChange={(e) => setClubData({ ...clubData, zip: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-display mb-2">What programs do you offer?</h2>
                <p className="text-muted-foreground">Select all that apply</p>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {programOptions.map((program) => (
                  <button
                    key={program}
                    type="button"
                    onClick={() => toggleProgram(program)}
                    className={`
                      p-4 rounded-xl border-2 text-left transition-all
                      ${clubData.programs.includes(program)
                        ? "border-gold bg-gold/10 text-foreground"
                        : "border-border hover:border-gold/50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${clubData.programs.includes(program)
                          ? "border-gold bg-gold"
                          : "border-border"
                        }
                      `}>
                        {clubData.programs.includes(program) && (
                          <CheckCircle className="h-3 w-3 text-navy" />
                        )}
                      </div>
                      <span className="font-medium">{program}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-display mb-2">Customize your brand</h2>
                <p className="text-muted-foreground">Upload your logo and choose your colors</p>
              </div>

              <div className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-gold/50 transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium mb-1">Upload your club logo</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={clubData.primaryColor}
                        onChange={(e) => setClubData({ ...clubData, primaryColor: e.target.value })}
                        className="w-12 h-12 rounded-lg cursor-pointer border-0"
                      />
                      <Input
                        value={clubData.primaryColor}
                        onChange={(e) => setClubData({ ...clubData, primaryColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Secondary Color</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={clubData.secondaryColor}
                        onChange={(e) => setClubData({ ...clubData, secondaryColor: e.target.value })}
                        className="w-12 h-12 rounded-lg cursor-pointer border-0"
                      />
                      <Input
                        value={clubData.secondaryColor}
                        onChange={(e) => setClubData({ ...clubData, secondaryColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="rounded-xl overflow-hidden border">
                  <div 
                    className="p-6 text-white"
                    style={{ backgroundColor: clubData.secondaryColor }}
                  >
                    <div className="flex items-center gap-2">
                      <Trophy className="h-6 w-6" style={{ color: clubData.primaryColor }} />
                      <span className="text-xl font-display">YOUR CLUB</span>
                    </div>
                  </div>
                  <div className="p-6 bg-card">
                    <Button 
                      style={{ backgroundColor: clubData.primaryColor }}
                      className="text-white"
                    >
                      Sample Button
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button variant="hero" onClick={handleNext}>
              {currentStep === steps.length ? "Complete Setup" : "Continue"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
