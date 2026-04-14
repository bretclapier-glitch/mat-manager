import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  FileText, 
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Send,
  Bell,
  Loader2,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

type Registration = {
  id: string;
  program: string;
  status: string;
  created_at: string;
  wrestlers?: { full_name: string; profiles?: { full_name: string } | null } | null;
};

type Program = {
  id: string;
  name: string;
  price: number | null;
};

export default function Registration() {
  const { profile } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [waiverOpen, setWaiverOpen] = useState(false);

  useEffect(() => {
    if (profile?.club_id) {
      loadRegistrations(profile.club_id);
      loadPrograms(profile.club_id);
    }
  }, [profile]);

  async function loadRegistrations(clubId: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from('registrations')
      .select('*, wrestlers(full_name, profiles(full_name))')
      .eq('club_id', clubId)
      .order('created_at', { ascending: false });

    if (!error) setRegistrations((data ?? []) as Registration[]);
    setLoading(false);
  }

  async function loadPrograms(clubId: string) {
    const { data } = await supabase
      .from('programs')
      .select('id, name, price')
      .eq('club_id', clubId)
      .order('name');
    setPrograms((data ?? []) as Program[]);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from('registrations')
      .update({ status })
      .eq('id', id);

    if (!error && profile?.club_id) {
      loadRegistrations(profile.club_id);
      toast.success('Registration status updated');
    }
  }

  function sendReminder(name: string) {
    toast.success(`Reminder sent`, {
      description: `Nudge sent to complete ${name}'s registration.`
    });
  }

  function sendAllReminders() {
    const pendingCount = registrations.filter(r => r.status === 'pending').length;
    toast.success(`Reminders sent to ${pendingCount} incomplete registrations`, {
      description: "Parents will receive an email to complete their registration."
    });
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }

  // Get registration counts per program
  function getProgramCount(programName: string) {
    return registrations.filter(r => r.program === programName).length;
  }

  const stats = {
    total: registrations.length,
    complete: registrations.filter(r => r.status === 'complete').length,
    pending: registrations.filter(r => r.status === 'pending').length,
  };

  const pendingCount = registrations.filter(r => r.status === 'pending').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display">REGISTRATION</h1>
            <p className="text-muted-foreground">Manage wrestler registrations and waivers</p>
          </div>
          <div className="flex gap-3">
            {pendingCount > 0 && (
              <Button variant="outline" onClick={sendAllReminders}>
                <Bell className="h-4 w-4 mr-2" />
                Send Reminders ({pendingCount})
              </Button>
            )}
            <Button variant="hero" onClick={() => window.open(`/wrestling/club/${profile?.club_id}/programs`, '_blank')}>
              <Plus className="h-4 w-4 mr-2" />
              Registration Link
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-navy" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Registrations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-wrestling-green/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-wrestling-green" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.complete}</p>
                  <p className="text-sm text-muted-foreground">Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Registrations Table */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle className="text-xl font-display">REGISTRATIONS</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gold" />
                </div>
              ) : registrations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No registrations yet</p>
                  <p className="text-sm mt-1">Registrations will appear here when parents sign up</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-medium text-muted-foreground">Wrestler</th>
                        <th className="pb-3 font-medium text-muted-foreground">Program</th>
                        <th className="pb-3 font-medium text-muted-foreground">Date</th>
                        <th className="pb-3 font-medium text-muted-foreground">Status</th>
                        <th className="pb-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((reg) => (
                        <tr key={reg.id} className="border-b last:border-0">
                          <td className="py-4">
                            <div>
                              <p className="font-medium">
                                {reg.wrestlers?.full_name ?? 'Unknown'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {reg.wrestlers?.profiles?.full_name ?? ''}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 text-sm">{reg.program}</td>
                          <td className="py-4 text-sm text-muted-foreground">
                            {formatDate(reg.created_at)}
                          </td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              reg.status === 'complete'
                                ? 'bg-wrestling-green/10 text-wrestling-green'
                                : reg.status === 'cancelled'
                                ? 'bg-wrestling-red/10 text-wrestling-red'
                                : 'bg-gold/10 text-gold'
                            }`}>
                              {reg.status}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-1">
                              {reg.status === 'pending' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => sendReminder(reg.wrestlers?.full_name ?? 'wrestler')}
                                    title="Send reminder"
                                  >
                                    <Send className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => updateStatus(reg.id, 'complete')}
                                    title="Mark complete"
                                  >
                                    <CheckCircle className="h-4 w-4 text-wrestling-green" />
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="sm">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Programs & Waiver */}
          <div className="space-y-6">
            {/* Programs */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-xl font-display">PROGRAMS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {programs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No programs set up yet
                  </p>
                ) : (
                  programs.map((program) => {
                    const count = getProgramCount(program.name);
                    return (
                      <div key={program.id} className="p-3 rounded-lg bg-secondary/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{program.name}</span>
                          {program.price && (
                            <span className="text-sm font-bold text-gold">${program.price}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                          <span>{count} registered</span>
                        </div>
                        <Progress value={Math.min(count * 10, 100)} className="h-2" />
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>

            {/* Waiver */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-xl font-display">WAIVER</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/50 flex items-center gap-3">
                  <FileText className="h-8 w-8 text-gold" />
                  <div className="flex-1">
                    <p className="font-medium">Club Liability Waiver</p>
                    <p className="text-sm text-muted-foreground">Required for all wrestlers</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setWaiverOpen(true)}
                >
                  Preview Waiver
                </Button>
                <Button variant="hero" className="w-full">
                  Edit Waiver
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Waiver Preview Dialog */}
      <Dialog open={waiverOpen} onOpenChange={setWaiverOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">LIABILITY WAIVER</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm leading-relaxed">
            <h3 className="font-bold text-lg">Release and Waiver of Liability</h3>
            <p>In consideration of being permitted to participate in wrestling activities at this club, I hereby agree to the following:</p>
            <h4 className="font-semibold">1. Assumption of Risk</h4>
            <p>I understand that wrestling involves inherent risks including but not limited to physical contact, falls, collisions, and the potential for serious injury.</p>
            <h4 className="font-semibold">2. Release of Liability</h4>
            <p>I release and hold harmless this wrestling club, its coaches, volunteers, and affiliates from any claims, damages, or losses arising from participation.</p>
            <h4 className="font-semibold">3. Medical Authorization</h4>
            <p>I authorize club personnel to seek emergency medical treatment for the participant if necessary and agree to be responsible for all medical expenses.</p>
            <h4 className="font-semibold">4. Photo/Video Release</h4>
            <p>I grant permission for photos and videos taken during club activities to be used for promotional purposes.</p>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
