import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Lock,
  Bell,
  Globe,
  Shield,
  Loader2,
  CheckCircle,
  Save,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Settings() {
  const { profile, user } = useAuth();

  // Profile state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Club state
  const [clubName, setClubName] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [clubPhone, setClubPhone] = useState("");
  const [clubWebsite, setClubWebsite] = useState("");
  const [clubAddress, setClubAddress] = useState("");
  const [clubCity, setClubCity] = useState("");
  const [clubState, setClubState] = useState("");
  const [clubZip, setClubZip] = useState("");
  const [clubSlug, setClubSlug] = useState("");
  const [savingClub, setSavingClub] = useState(false);

  // Notification state
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setEmail(profile.email ?? "");
      loadClub();
    }
  }, [profile]);

  async function loadClub() {
    if (!profile?.club_id) { setLoading(false); return; }
    const { data } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', profile.club_id)
      .single();

    if (data) {
      setClubName(data.name ?? "");
      setClubDescription(data.description ?? "");
      setClubPhone(data.phone ?? "");
      setClubWebsite(data.website_url ?? "");
      setClubAddress(data.address ?? "");
      setClubCity(data.city ?? "");
      setClubState(data.state ?? "");
      setClubZip(data.zip ?? "");
      setClubSlug(data.slug ?? "");
    }
    setLoading(false);
  }

  async function saveProfile() {
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword() {
    setPasswordError(null);
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully");
    } catch (err) {
      toast.error("Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  }

  async function saveClub() {
    if (!profile?.club_id) return;
    setSavingClub(true);
    try {
      const { error } = await supabase
        .from('clubs')
        .update({
          name: clubName,
          description: clubDescription,
          phone: clubPhone,
          website_url: clubWebsite,
          address: clubAddress,
          city: clubCity,
          state: clubState,
          zip: clubZip,
        })
        .eq('id', profile.club_id);

      if (error) throw error;
      toast.success("Club settings saved successfully");
    } catch (err) {
      toast.error("Failed to save club settings");
    } finally {
      setSavingClub(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gold" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-display">SETTINGS</h1>
          <p className="text-muted-foreground">Manage your account and club preferences.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="profile" className="text-xs sm:text-sm">
              <User className="h-4 w-4 mr-1 hidden sm:inline" />Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm">
              <Lock className="h-4 w-4 mr-1 hidden sm:inline" />Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm">
              <Bell className="h-4 w-4 mr-1 hidden sm:inline" />Notifications
            </TabsTrigger>
            <TabsTrigger value="club" className="text-xs sm:text-sm">
              <Globe className="h-4 w-4 mr-1 hidden sm:inline" />Club
            </TabsTrigger>
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="font-display">PROFILE INFORMATION</CardTitle>
                <CardDescription>Update your personal details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    disabled
                    className="opacity-60"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed here. Contact support if needed.</p>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={profile?.role ?? ""} disabled className="opacity-60 capitalize" />
                </div>
                <Button variant="hero" onClick={saveProfile} disabled={savingProfile}>
                  {savingProfile ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                  ) : (
                    <><Save className="h-4 w-4 mr-2" />Save Changes</>
                  )}
                </Button>
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
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      placeholder="Min. 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                {passwordError && (
                  <div className="p-3 rounded-lg bg-wrestling-red/10 border border-wrestling-red/20 text-wrestling-red text-sm">
                    {passwordError}
                  </div>
                )}

                <Button variant="hero" onClick={savePassword} disabled={savingPassword || !newPassword}>
                  {savingPassword ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Updating...</>
                  ) : (
                    <><Shield className="h-4 w-4 mr-2" />Update Password</>
                  )}
                </Button>
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
                <Button variant="hero" onClick={() => toast.success("Notification preferences saved")}>
                  <Save className="h-4 w-4 mr-2" />Save Preferences
                </Button>
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
                  <Input
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    placeholder="Your club name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Club Description</Label>
                  <Textarea
                    value={clubDescription}
                    onChange={(e) => setClubDescription(e.target.value)}
                    placeholder="Tell parents about your club..."
                    rows={3}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={clubPhone}
                      onChange={(e) => setClubPhone(e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      value={clubWebsite}
                      onChange={(e) => setClubWebsite(e.target.value)}
                      placeholder="www.yourclub.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Street Address</Label>
                  <Input
                    value={clubAddress}
                    onChange={(e) => setClubAddress(e.target.value)}
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      value={clubCity}
                      onChange={(e) => setClubCity(e.target.value)}
                      placeholder="Austin"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input
                      value={clubState}
                      onChange={(e) => setClubState(e.target.value)}
                      placeholder="TX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>ZIP</Label>
                    <Input
                      value={clubZip}
                      onChange={(e) => setClubZip(e.target.value)}
                      placeholder="78701"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Club URL Slug</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">mat-manager.vercel.app/wrestling/club/</span>
                    <Input
                      value={clubSlug}
                      disabled
                      className="opacity-60 max-w-48"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">URL slug cannot be changed after setup.</p>
                </div>

                <Button variant="hero" onClick={saveClub} disabled={savingClub}>
                  {savingClub ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                  ) : (
                    <><Save className="h-4 w-4 mr-2" />Save Club Settings</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
