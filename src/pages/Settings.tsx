import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User, Lock, Bell, Globe, Shield, Loader2, Save,
  Plus, Pencil, Trash2, Users, DollarSign, Calendar,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type Program = {
  id: string;
  name: string;
  description: string | null;
  season_start: string | null;
  season_end: string | null;
  practice_days: string[];
  practice_time: string | null;
  practice_end_time: string | null;
  price: number | null;
  payment_type: string;
  club_id: string;
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Settings() {
  const { profile, user } = useAuth();

  // Profile state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
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

  // Programs state
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programDialogOpen, setProgramDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [savingProgram, setSavingProgram] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Program form state
  const [pName, setPName] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [pSeasonStart, setPSeasonStart] = useState("");
  const [pSeasonEnd, setPSeasonEnd] = useState("");
  const [pDays, setPDays] = useState<string[]>([]);
  const [pTime, setPTime] = useState("");
  const [pEndTime, setPEndTime] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pPaymentType, setPPaymentType] = useState("one-time");

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
      loadPrograms();
    }
  }, [profile]);

  async function loadClub() {
    if (!profile?.club_id) { setLoading(false); return; }
    const { data } = await supabase.from('clubs').select('*').eq('id', profile.club_id).single();
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

  async function loadPrograms() {
    if (!profile?.club_id) return;
    const { data } = await supabase
      .from('programs')
      .select('*')
      .eq('club_id', profile.club_id)
      .order('name');
    setPrograms((data ?? []) as Program[]);
  }

  function openAddProgram() {
    setEditingProgram(null);
    setPName(""); setPDescription(""); setPSeasonStart(""); setPSeasonEnd("");
    setPDays([]); setPTime(""); setPEndTime(""); setPPrice(""); setPPaymentType("one-time");
    setProgramDialogOpen(true);
  }

  function openEditProgram(program: Program) {
    setEditingProgram(program);
    setPName(program.name);
    setPDescription(program.description ?? "");
    setPSeasonStart(program.season_start ?? "");
    setPSeasonEnd(program.season_end ?? "");
    setPDays(Array.isArray(program.practice_days) ? program.practice_days : []);
    setPTime(program.practice_time ?? "");
    setPEndTime(program.practice_end_time ?? "");
    setPPrice(program.price?.toString() ?? "");
    setPPaymentType(program.payment_type ?? "one-time");
    setProgramDialogOpen(true);
  }

  function toggleDay(day: string) {
    setPDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  }

  async function saveProgram() {
    if (!pName.trim() || !profile?.club_id) return;
    setSavingProgram(true);

    const programData = {
      name: pName,
      description: pDescription || null,
      season_start: pSeasonStart || null,
      season_end: pSeasonEnd || null,
      practice_days: pDays,
      practice_time: pTime || null,
      practice_end_time: pEndTime || null,
      price: pPrice ? parseFloat(pPrice) : null,
      payment_type: pPaymentType,
      club_id: profile.club_id,
    };

    try {
      if (editingProgram) {
        const { error } = await supabase
          .from('programs')
          .update(programData)
          .eq('id', editingProgram.id);
        if (error) throw error;
        toast.success("Program updated successfully");
      } else {
        const { error } = await supabase
          .from('programs')
          .insert(programData);
        if (error) throw error;
        toast.success("Program added successfully");
      }
      setProgramDialogOpen(false);
      loadPrograms();
    } catch (err) {
      toast.error("Failed to save program");
    } finally {
      setSavingProgram(false);
    }
  }

  async function deleteProgram(id: string) {
    if (!confirm("Are you sure you want to delete this program?")) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.from('programs').delete().eq('id', id);
      if (error) throw error;
      toast.success("Program deleted");
      loadPrograms();
    } catch (err) {
      toast.error("Failed to delete program");
    } finally {
      setDeletingId(null);
    }
  }

  async function saveProfile() {
    if (!user) return;
    setSavingProfile(true);
    try {
      const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id);
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
    if (newPassword.length < 6) { setPasswordError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Passwords do not match."); return; }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword(""); setConfirmPassword("");
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
      const { error } = await supabase.from('clubs').update({
        name: clubName, description: clubDescription, phone: clubPhone,
        website_url: clubWebsite, address: clubAddress, city: clubCity,
        state: clubState, zip: clubZip,
      }).eq('id', profile.club_id);
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
          <TabsList className="grid grid-cols-5 w-full">
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
            <TabsTrigger value="programs" className="text-xs sm:text-sm">
              <Users className="h-4 w-4 mr-1 hidden sm:inline" />Programs
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
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={email} disabled className="opacity-60" />
                  <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={profile?.role ?? ""} disabled className="opacity-60 capitalize" />
                </div>
                <Button variant="hero" onClick={saveProfile} disabled={savingProfile}>
                  {savingProfile ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
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
                    <Input type="password" placeholder="Min. 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                </div>
                {passwordError && (
                  <div className="p-3 rounded-lg bg-wrestling-red/10 border border-wrestling-red/20 text-wrestling-red text-sm">{passwordError}</div>
                )}
                <Button variant="hero" onClick={savePassword} disabled={savingPassword || !newPassword}>
                  {savingPassword ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Updating...</> : <><Shield className="h-4 w-4 mr-2" />Update Password</>}
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
                  <Input value={clubName} onChange={(e) => setClubName(e.target.value)} placeholder="Your club name" />
                </div>
                <div className="space-y-2">
                  <Label>Club Description</Label>
                  <Textarea value={clubDescription} onChange={(e) => setClubDescription(e.target.value)} placeholder="Tell parents about your club..." rows={3} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={clubPhone} onChange={(e) => setClubPhone(e.target.value)} placeholder="(555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input value={clubWebsite} onChange={(e) => setClubWebsite(e.target.value)} placeholder="www.yourclub.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Street Address</Label>
                  <Input value={clubAddress} onChange={(e) => setClubAddress(e.target.value)} placeholder="123 Main St" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input value={clubCity} onChange={(e) => setClubCity(e.target.value)} placeholder="Austin" />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input value={clubState} onChange={(e) => setClubState(e.target.value)} placeholder="TX" />
                  </div>
                  <div className="space-y-2">
                    <Label>ZIP</Label>
                    <Input value={clubZip} onChange={(e) => setClubZip(e.target.value)} placeholder="78701" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Club URL Slug</Label>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">...vercel.app/wrestling/club/</span>
                    <Input value={clubSlug} disabled className="opacity-60 max-w-48" />
                  </div>
                  <p className="text-xs text-muted-foreground">URL slug cannot be changed after setup.</p>
                </div>
                <Button variant="hero" onClick={saveClub} disabled={savingClub}>
                  {savingClub ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Club Settings</>}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Programs */}
          <TabsContent value="programs">
            <Card className="shadow-card">
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-display">PROGRAMS</CardTitle>
                  <CardDescription>Manage the programs parents can register for.</CardDescription>
                </div>
                <Button variant="hero" size="sm" onClick={openAddProgram}>
                  <Plus className="h-4 w-4 mr-2" />Add Program
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {programs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No programs yet</p>
                    <p className="text-sm mt-1">Add your first program so parents can register.</p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={openAddProgram}>
                      <Plus className="h-4 w-4 mr-2" />Add Program
                    </Button>
                  </div>
                ) : (
                  programs.map((program) => (
                    <div key={program.id} className="p-4 rounded-lg border bg-card space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{program.name}</h3>
                          {program.description && (
                            <p className="text-sm text-muted-foreground mt-0.5">{program.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {program.price && (
                            <Badge variant="outline" className="text-gold border-gold">
                              ${program.price}{program.payment_type === 'monthly' ? '/mo' : ''}
                            </Badge>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => openEditProgram(program)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => deleteProgram(program.id)}
                            disabled={deletingId === program.id}
                          >
                            {deletingId === program.id
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <Trash2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {program.practice_days?.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {program.practice_days.join(', ')}
                            {program.practice_time && ` • ${program.practice_time}`}
                            {program.practice_end_time && ` - ${program.practice_end_time}`}
                          </span>
                        )}
                        {program.season_start && (
                          <span>Starts {new Date(program.season_start).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Program Dialog */}
      <Dialog open={programDialogOpen} onOpenChange={setProgramDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingProgram ? "EDIT PROGRAM" : "ADD PROGRAM"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Program Name *</Label>
              <Input placeholder="e.g. Youth Wrestling" value={pName} onChange={(e) => setPName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Describe this program..." value={pDescription} onChange={(e) => setPDescription(e.target.value)} rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Season Start</Label>
                <Input type="date" value={pSeasonStart} onChange={(e) => setPSeasonStart(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Season End</Label>
                <Input type="date" value={pSeasonEnd} onChange={(e) => setPSeasonEnd(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Practice Days</Label>
              <div className="flex gap-2 flex-wrap">
                {DAYS.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-colors ${
                      pDays.includes(day)
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border hover:border-gold/50"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input type="time" value={pTime} onChange={(e) => setPTime(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input type="time" value={pEndTime} onChange={(e) => setPEndTime(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input type="number" placeholder="0.00" value={pPrice} onChange={(e) => setPPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Payment Type</Label>
                <Select value={pPaymentType} onValueChange={setPPaymentType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-time</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setProgramDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="hero" className="flex-1" onClick={saveProgram} disabled={savingProgram || !pName.trim()}>
                {savingProgram
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                  : editingProgram ? "Update Program" : "Add Program"
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
