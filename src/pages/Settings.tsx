import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Lock,
  CreditCard,
  Bell,
  Globe,
  Shield,
  CheckCircle,
} from "lucide-react";

export default function Settings() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-display">SETTINGS</h1>
          <p className="text-muted-foreground">Manage your account and club preferences.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="profile" className="text-xs sm:text-sm"><User className="h-4 w-4 mr-1 hidden sm:inline" />Profile</TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm"><Lock className="h-4 w-4 mr-1 hidden sm:inline" />Security</TabsTrigger>
            <TabsTrigger value="subscription" className="text-xs sm:text-sm"><CreditCard className="h-4 w-4 mr-1 hidden sm:inline" />Plan</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm"><Bell className="h-4 w-4 mr-1 hidden sm:inline" />Notifications</TabsTrigger>
            <TabsTrigger value="club" className="text-xs sm:text-sm"><Globe className="h-4 w-4 mr-1 hidden sm:inline" />Club</TabsTrigger>
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display">PROFILE INFORMATION</CardTitle>
                <CardDescription>Update your personal details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" defaultValue="john@thunderwrestling.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input type="tel" defaultValue="(555) 123-4567" />
                </div>
                <Button variant="hero">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display">PASSWORD & SECURITY</CardTitle>
                <CardDescription>Keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>
                <Button variant="hero">Update Password</Button>

                <div className="border-t pt-6 space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-gold" />
                    Two-Factor Authentication
                  </h3>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription */}
          <TabsContent value="subscription">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display">SUBSCRIPTION & BILLING</CardTitle>
                <CardDescription>Manage your plan and payment methods.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">Pro Plan</h3>
                      <Badge className="bg-gold text-navy">Active</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">$49/month • Renews March 1, 2024</p>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Plan Features</h4>
                  {["Up to 200 members", "Unlimited messaging", "Payment processing", "Custom website", "Merch store", "Priority support"].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-wrestling-green" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6 space-y-4">
                  <h4 className="font-semibold">Payment Method</h4>
                  <div className="p-3 rounded-lg bg-secondary/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm">Visa ending in 4242</span>
                    </div>
                    <Button variant="ghost" size="sm">Update</Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <Button variant="ghost" className="text-destructive hover:text-destructive">Cancel Subscription</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display">NOTIFICATION PREFERENCES</CardTitle>
                <CardDescription>Choose how you want to be notified.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: "Email Notifications", desc: "Receive updates via email", checked: emailNotifs, onChange: setEmailNotifs },
                  { label: "SMS Notifications", desc: "Get text message alerts", checked: smsNotifs, onChange: setSmsNotifs },
                  { label: "Push Notifications", desc: "Browser push notifications", checked: pushNotifs, onChange: setPushNotifs },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div>
                      <p className="font-medium">{n.label}</p>
                      <p className="text-sm text-muted-foreground">{n.desc}</p>
                    </div>
                    <Switch checked={n.checked} onCheckedChange={n.onChange} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Club Settings */}
          <TabsContent value="club">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display">CLUB SETTINGS</CardTitle>
                <CardDescription>Update your club's public information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Club Name</Label>
                  <Input defaultValue="Thunder Wrestling Club" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>USA Wrestling Club ID</Label>
                    <Input defaultValue="TX-12345" />
                  </div>
                  <div className="space-y-2">
                    <Label>Club Website Slug</Label>
                    <Input defaultValue="thunder" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input defaultValue="Austin" />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input defaultValue="TX" />
                  </div>
                </div>
                <Button variant="hero">Save Club Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
