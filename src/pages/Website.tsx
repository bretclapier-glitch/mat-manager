import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Globe, 
  Eye,
  Palette,
  Layout,
  Image,
  Type,
  Settings,
  ExternalLink,
  Save,
  Smartphone,
  Monitor
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Website() {
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [siteSettings, setSiteSettings] = useState({
    clubName: "Thunder Wrestling Club",
    tagline: "Building Champions On and Off the Mat",
    description: "Thunder Wrestling Club is dedicated to developing young athletes through the sport of wrestling.",
    primaryColor: "#d4a739",
    secondaryColor: "#1a1f36",
    showSchedule: true,
    showRegistration: true,
    showStore: true,
    showContact: true,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display">WEBSITE BUILDER</h1>
            <p className="text-muted-foreground">Customize your club's public website</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="hero">
              <Save className="h-4 w-4 mr-2" />
              Publish Changes
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div className="space-y-6">
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">
                  <Type className="h-4 w-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="design">
                  <Palette className="h-4 w-4 mr-2" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="pages">
                  <Layout className="h-4 w-4 mr-2" />
                  Pages
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4 mt-4">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Hero Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="clubName">Club Name</Label>
                      <Input
                        id="clubName"
                        value={siteSettings.clubName}
                        onChange={(e) => setSiteSettings({ ...siteSettings, clubName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input
                        id="tagline"
                        value={siteSettings.tagline}
                        onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={siteSettings.description}
                        onChange={(e) => setSiteSettings({ ...siteSettings, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hero Image</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-gold/50 transition-colors cursor-pointer">
                        <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="space-y-4 mt-4">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Brand Colors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={siteSettings.primaryColor}
                            onChange={(e) => setSiteSettings({ ...siteSettings, primaryColor: e.target.value })}
                            className="w-12 h-12 rounded-lg cursor-pointer border-0"
                          />
                          <Input
                            value={siteSettings.primaryColor}
                            onChange={(e) => setSiteSettings({ ...siteSettings, primaryColor: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Secondary Color</Label>
                        <div className="flex items-center gap-3">
                          <input
                            type="color"
                            value={siteSettings.secondaryColor}
                            onChange={(e) => setSiteSettings({ ...siteSettings, secondaryColor: e.target.value })}
                            className="w-12 h-12 rounded-lg cursor-pointer border-0"
                          />
                          <Input
                            value={siteSettings.secondaryColor}
                            onChange={(e) => setSiteSettings({ ...siteSettings, secondaryColor: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Logo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-gold/50 transition-colors cursor-pointer">
                      <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload your club logo</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pages" className="space-y-4 mt-4">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Page Visibility</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Schedule</Label>
                        <p className="text-sm text-muted-foreground">Show practice schedule</p>
                      </div>
                      <Switch
                        checked={siteSettings.showSchedule}
                        onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, showSchedule: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Registration</Label>
                        <p className="text-sm text-muted-foreground">Allow online registration</p>
                      </div>
                      <Switch
                        checked={siteSettings.showRegistration}
                        onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, showRegistration: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Merch Store</Label>
                        <p className="text-sm text-muted-foreground">Display merchandise</p>
                      </div>
                      <Switch
                        checked={siteSettings.showStore}
                        onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, showStore: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Contact Form</Label>
                        <p className="text-sm text-muted-foreground">Allow visitors to contact</p>
                      </div>
                      <Switch
                        checked={siteSettings.showContact}
                        onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, showContact: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Preview
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={previewMode === "desktop" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setPreviewMode("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setPreviewMode("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`
                border rounded-lg overflow-hidden mx-auto transition-all duration-300
                ${previewMode === "mobile" ? "max-w-[375px]" : "w-full"}
              `}>
                {/* Preview Site */}
                <div 
                  className="aspect-[16/10] overflow-hidden"
                  style={{ backgroundColor: siteSettings.secondaryColor }}
                >
                  {/* Hero Preview */}
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <h1 
                      className="text-2xl md:text-3xl font-display text-white mb-2"
                    >
                      {siteSettings.clubName.toUpperCase()}
                    </h1>
                    <p 
                      className="text-sm md:text-base mb-4"
                      style={{ color: siteSettings.primaryColor }}
                    >
                      {siteSettings.tagline}
                    </p>
                    <p className="text-xs text-white/70 max-w-md">
                      {siteSettings.description}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <button 
                        className="px-4 py-2 rounded-lg text-sm font-semibold"
                        style={{ 
                          backgroundColor: siteSettings.primaryColor,
                          color: siteSettings.secondaryColor 
                        }}
                      >
                        Register Now
                      </button>
                      <button 
                        className="px-4 py-2 rounded-lg text-sm font-semibold border border-white/30 text-white"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>

                {/* Navigation Preview */}
                <div className="bg-white p-3 flex items-center justify-between border-t">
                  <div className="flex gap-4 text-xs text-gray-600">
                    {siteSettings.showSchedule && <span>Schedule</span>}
                    {siteSettings.showRegistration && <span>Register</span>}
                    {siteSettings.showStore && <span>Store</span>}
                    {siteSettings.showContact && <span>Contact</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
