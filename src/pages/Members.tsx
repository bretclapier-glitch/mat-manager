import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Users, Search, Plus, Loader2, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

type Wrestler = {
  id: string;
  full_name: string;
  date_of_birth: string | null;
  weight_class: string | null;
  program: string;
  status: string;
  parent_id: string | null;
  club_id: string;
  created_at: string;
  profiles?: { full_name: string; email: string } | null;
};

type Program = {
  id: string;
  name: string;
};

export default function Members() {
  const { profile } = useAuth();
  const [wrestlers, setWrestlers] = useState<Wrestler[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add member form state
  const [newName, setNewName] = useState("");
  const [newDob, setNewDob] = useState("");
  const [newProgram, setNewProgram] = useState("");
  const [newWeightClass, setNewWeightClass] = useState("");
  const [newParentEmail, setNewParentEmail] = useState("");

  useEffect(() => {
    if (profile?.club_id) {
      loadWrestlers(profile.club_id);
      loadPrograms(profile.club_id);
    }
  }, [profile]);

  async function loadWrestlers(clubId: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from('wrestlers')
      .select('*, profiles(full_name, email)')
      .eq('club_id', clubId)
      .order('full_name');

    if (!error) setWrestlers((data ?? []) as Wrestler[]);
    setLoading(false);
  }

  async function loadPrograms(clubId: string) {
    const { data } = await supabase
      .from('programs')
      .select('id, name')
      .eq('club_id', clubId)
      .order('name');
    setPrograms((data ?? []) as Program[]);
  }

  async function handleAddMember() {
    if (!newName.trim() || !profile?.club_id) return;
    setSaving(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('wrestlers')
        .insert({
          full_name: newName,
          date_of_birth: newDob || null,
          program: newProgram || 'General',
          weight_class: newWeightClass || null,
          status: 'active',
          club_id: profile.club_id,
        });

      if (insertError) throw insertError;

      setAddOpen(false);
      resetForm();
      loadWrestlers(profile.club_id);
    } catch (err: any) {
      setError('Failed to add member. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setNewName("");
    setNewDob("");
    setNewProgram("");
    setNewWeightClass("");
    setNewParentEmail("");
    setError(null);
  }

  function getAge(dob: string | null) {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  const filtered = wrestlers.filter((w) => {
    const matchesProgram = selectedProgram === "all" || w.program === selectedProgram;
    const matchesSearch =
      w.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (w.profiles?.full_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (w.profiles?.email ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesProgram && matchesSearch;
  });

  const programOptions = [
    { id: "all", name: "All Programs" },
    ...programs,
    ...Array.from(new Set(wrestlers.map(w => w.program)))
      .filter(p => !programs.find(pr => pr.name === p))
      .map(p => ({ id: p, name: p })),
  ];

  const uniquePrograms = Array.from(new Set(wrestlers.map(w => w.program)));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display">MEMBERS</h1>
            <p className="text-muted-foreground">View and manage your club roster.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="hero" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />Add Member
            </Button>
          </div>
        </div>

        {/* Program quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setSelectedProgram("all")}
            className={`p-3 rounded-lg text-left transition-colors border ${
              selectedProgram === "all"
                ? "bg-gold/10 border-gold"
                : "bg-card border-border hover:bg-secondary/50"
            }`}
          >
            <p className="text-2xl font-bold">{wrestlers.length}</p>
            <p className="text-xs text-muted-foreground">All Members</p>
          </button>
          <button
            onClick={() => setSelectedProgram("active")}
            className={`p-3 rounded-lg text-left transition-colors border ${
              selectedProgram === "active"
                ? "bg-gold/10 border-gold"
                : "bg-card border-border hover:bg-secondary/50"
            }`}
          >
            <p className="text-2xl font-bold">{wrestlers.filter(w => w.status === 'active').length}</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </button>
          <button
            onClick={() => setSelectedProgram("inactive")}
            className={`p-3 rounded-lg text-left transition-colors border ${
              selectedProgram === "inactive"
                ? "bg-gold/10 border-gold"
                : "bg-card border-border hover:bg-secondary/50"
            }`}
          >
            <p className="text-2xl font-bold">{wrestlers.filter(w => w.status === 'inactive').length}</p>
            <p className="text-xs text-muted-foreground">Inactive</p>
          </button>
          <div className="p-3 rounded-lg text-left bg-card border border-border">
            <p className="text-2xl font-bold">{uniquePrograms.length}</p>
            <p className="text-xs text-muted-foreground">Programs</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by wrestler or parent name..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {programOptions.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Roster Table */}
        <Card className="shadow-card">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-xl font-display flex items-center gap-2">
              <Users className="h-5 w-5 text-gold" />
              ROSTER ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No members yet</p>
                <p className="text-sm mt-1">Add your first wrestler to get started</p>
                <Button variant="hero" size="sm" className="mt-4" onClick={() => setAddOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />Add Member
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Wrestler</TableHead>
                      <TableHead>Program</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Weight Class</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((w) => (
                      <TableRow key={w.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {w.full_name.split(" ").map((n) => n[0]).join("")}
                              </span>
                            </div>
                            <p className="font-medium">{w.full_name}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{w.program}</Badge>
                        </TableCell>
                        <TableCell>
                          {getAge(w.date_of_birth) ? `${getAge(w.date_of_birth)} yrs` : '—'}
                        </TableCell>
                        <TableCell>{w.weight_class ?? '—'}</TableCell>
                        <TableCell>
                          {w.profiles ? (
                            <div>
                              <p className="text-sm">{w.profiles.full_name}</p>
                              <p className="text-xs text-muted-foreground">{w.profiles.email}</p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={w.status === "active"
                              ? "bg-wrestling-green/10 text-wrestling-green border-wrestling-green/20"
                              : "bg-muted text-muted-foreground"
                            }
                          >
                            {w.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) resetForm(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">ADD MEMBER</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Wrestler Name *</Label>
              <Input
                placeholder="Full name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={newDob}
                onChange={(e) => setNewDob(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Program</Label>
              {programs.length > 0 ? (
                <Select value={newProgram} onValueChange={setNewProgram}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((p) => (
                      <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder="e.g. Youth Wrestling"
                  value={newProgram}
                  onChange={(e) => setNewProgram(e.target.value)}
                />
              )}
            </div>
            <div className="space-y-2">
              <Label>Weight Class</Label>
              <Input
                placeholder="e.g. 106, 113, 120..."
                value={newWeightClass}
                onChange={(e) => setNewWeightClass(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Parent Email (optional)</Label>
              <Input
                type="email"
                placeholder="parent@email.com"
                value={newParentEmail}
                onChange={(e) => setNewParentEmail(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-wrestling-red/10 border border-wrestling-red/20 text-wrestling-red text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="hero"
                className="flex-1"
                onClick={handleAddMember}
                disabled={saving || !newName.trim()}
              >
                {saving ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                ) : (
                  "Add Member"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
