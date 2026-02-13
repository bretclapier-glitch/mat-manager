import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BaseballOnboardingData, BaseballTeam, AGE_GROUPS } from "@/types/baseball-onboarding";
import { Plus, X, Users } from "lucide-react";

interface TeamsStepProps {
  data: BaseballOnboardingData;
  onChange: (updates: Partial<BaseballOnboardingData>) => void;
}

const teamTypes = [
  { value: 'travel', label: 'Travel', color: 'bg-[hsl(150,45%,35%)]/10 text-[hsl(150,45%,35%)]' },
  { value: 'rec', label: 'Recreational', color: 'bg-blue-500/10 text-blue-600' },
  { value: 'select', label: 'Select', color: 'bg-amber-500/10 text-amber-600' },
];

export default function TeamsStep({ data, onChange }: TeamsStepProps) {
  const [newTeam, setNewTeam] = useState<Partial<BaseballTeam>>({
    name: '',
    ageGroup: '10U',
    type: 'travel',
    headCoach: '',
    maxRoster: 15,
  });

  const addTeam = () => {
    if (!newTeam.name) return;
    const team: BaseballTeam = {
      id: Date.now().toString(),
      name: newTeam.name || '',
      ageGroup: newTeam.ageGroup || '10U',
      type: (newTeam.type as 'travel' | 'rec' | 'select') || 'travel',
      headCoach: newTeam.headCoach || '',
      maxRoster: newTeam.maxRoster || 15,
    };
    onChange({ teams: [...data.teams, team] });
    setNewTeam({ name: '', ageGroup: '10U', type: 'travel', headCoach: '', maxRoster: 15 });
  };

  const removeTeam = (id: string) => {
    onChange({ teams: data.teams.filter((t) => t.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display mb-2">TEAMS & ROSTERS</h2>
        <p className="text-muted-foreground">Set up your teams by age group and competition level.</p>
      </div>

      {/* Add Team Form */}
      <Card className="border-dashed border-2">
        <CardContent className="p-4 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Plus className="h-4 w-4 text-[hsl(150,45%,35%)]" />
            Add a Team
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Team Name *</Label>
              <Input
                value={newTeam.name}
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                placeholder="e.g., Thunder 10U Black"
              />
            </div>
            <div className="space-y-2">
              <Label>Age Group *</Label>
              <Select value={newTeam.ageGroup} onValueChange={(v) => setNewTeam({ ...newTeam, ageGroup: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AGE_GROUPS.map((ag) => (
                    <SelectItem key={ag} value={ag}>{ag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Team Type *</Label>
              <Select value={newTeam.type} onValueChange={(v) => setNewTeam({ ...newTeam, type: v as 'travel' | 'rec' | 'select' })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {teamTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Head Coach</Label>
              <Input
                value={newTeam.headCoach}
                onChange={(e) => setNewTeam({ ...newTeam, headCoach: e.target.value })}
                placeholder="Coach name"
              />
            </div>
            <div className="space-y-2">
              <Label>Max Roster Size</Label>
              <Input
                type="number"
                min={1}
                value={newTeam.maxRoster}
                onChange={(e) => setNewTeam({ ...newTeam, maxRoster: parseInt(e.target.value) || 15 })}
              />
            </div>
          </div>
          <Button onClick={addTeam} className="bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Team
          </Button>
        </CardContent>
      </Card>

      {/* Team List */}
      {data.teams.length > 0 ? (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground">
            {data.teams.length} team{data.teams.length !== 1 ? 's' : ''} added
          </h3>
          {data.teams.map((team) => {
            return (
              <Card key={team.id} className="shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[hsl(150,45%,35%)]/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-[hsl(150,45%,35%)]" />
                    </div>
                    <div>
                      <p className="font-semibold">{team.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{team.ageGroup}</Badge>
                        <Badge variant="outline" className={teamTypes.find((t) => t.value === team.type)?.color}>{teamTypes.find((t) => t.value === team.type)?.label}</Badge>
                        {team.headCoach && (
                          <span className="text-xs text-muted-foreground">Coach: {team.headCoach}</span>
                        )}
                        <span className="text-xs text-muted-foreground">Max {team.maxRoster} players</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeTeam(team.id)}>
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No teams added yet.</p>
          <p className="text-xs mt-1">Add your first team above to get started.</p>
        </div>
      )}
    </div>
  );
}
