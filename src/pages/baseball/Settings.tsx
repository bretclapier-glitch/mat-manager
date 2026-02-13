import { useState } from "react";
import BaseballDashboardLayout from "@/components/layout/BaseballDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, CreditCard, Bell, Globe, Shield, CheckCircle } from "lucide-react";

export default function BaseballSettings() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);

  return (
    <BaseballDashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <div><h1 className="text-3xl font-display">SETTINGS</h1><p className="text-muted-foreground">Manage your account and organization.</p></div>
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="subscription">Plan</TabsTrigger>
            <TabsTrigger value="org">Organization</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="font-display">PROFILE</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4"><div className="space-y-2"><Label>First Name</Label><Input defaultValue="Mike" /></div><div className="space-y-2"><Label>Last Name</Label><Input defaultValue="Coach" /></div></div>
                <div className="space-y-2"><Label>Email</Label><Input defaultValue="mike@thunderbaseball.com" /></div>
                <Button className="bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="font-display">PASSWORD</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2"><Label>Current Password</Label><Input type="password" placeholder="••••••••" /></div>
                <div className="grid sm:grid-cols-2 gap-4"><div className="space-y-2"><Label>New Password</Label><Input type="password" placeholder="••••••••" /></div><div className="space-y-2"><Label>Confirm</Label><Input type="password" placeholder="••••••••" /></div></div>
                <Button className="bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white">Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="subscription">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="font-display">SUBSCRIPTION</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-[hsl(150,45%,35%)]/10 border border-[hsl(150,45%,35%)]/20 flex items-center justify-between">
                  <div><div className="flex items-center gap-2"><h3 className="font-bold text-lg">Pro Plan</h3><Badge className="bg-[hsl(150,45%,35%)] text-white">Active</Badge></div><p className="text-sm text-muted-foreground mt-1">$49/month</p></div>
                  <Button variant="outline">Change Plan</Button>
                </div>
                {["Up to 200 players", "Unlimited messaging", "Payment processing", "Custom website", "Team store", "Priority support"].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-[hsl(150,45%,35%)]" /><span>{f}</span></div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="org">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="font-display">ORGANIZATION</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2"><Label>Organization Name</Label><Input defaultValue="Austin Thunder Baseball" /></div>
                <div className="grid sm:grid-cols-2 gap-4"><div className="space-y-2"><Label>City</Label><Input defaultValue="Austin" /></div><div className="space-y-2"><Label>State</Label><Input defaultValue="TX" /></div></div>
                <div className="space-y-2"><Label>Website Slug</Label><Input defaultValue="thunder-baseball" /></div>
                <Button className="bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white">Save</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BaseballDashboardLayout>
  );
}
