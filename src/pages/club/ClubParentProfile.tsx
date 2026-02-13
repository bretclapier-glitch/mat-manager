import { useParams } from "react-router-dom";
import ParentDashboardLayout from "@/components/layout/ParentDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ClubParentProfile() {
  return (
    <ParentDashboardLayout>
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-3xl font-display">MY PROFILE</h1>

        <Tabs defaultValue="info" className="space-y-6">
          <TabsList>
            <TabsTrigger value="info">Personal Info</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="font-display">PERSONAL INFORMATION</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-gold text-navy font-bold text-xl">DJ</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">Change Photo</Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>First Name</Label><Input defaultValue="David" /></div>
                  <div className="space-y-2"><Label>Last Name</Label><Input defaultValue="Johnson" /></div>
                </div>
                <div className="space-y-2"><Label>Email</Label><Input defaultValue="david.johnson@email.com" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input defaultValue="(512) 555-1234" /></div>
                <div className="space-y-2"><Label>Address</Label><Input defaultValue="1234 Main St, Austin, TX 78701" /></div>
                <Button variant="hero">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="shadow-card">
              <CardHeader><CardTitle className="font-display">CHANGE PASSWORD</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2"><Label>Current Password</Label><Input type="password" placeholder="••••••••" /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>New Password</Label><Input type="password" placeholder="••••••••" /></div>
                  <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" placeholder="••••••••" /></div>
                </div>
                <Button variant="hero">Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ParentDashboardLayout>
  );
}
