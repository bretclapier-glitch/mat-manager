import { useState } from "react";
import BaseballDashboardLayout from "@/components/layout/BaseballDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Download, Plus } from "lucide-react";

const teams = [
  { id: "all", name: "All Teams" },
  { id: "8u", name: "8U Rec" },
  { id: "10u-travel", name: "10U Travel" },
  { id: "12u-rec", name: "12U Rec" },
  { id: "12u-travel", name: "12U Travel" },
  { id: "14u-travel", name: "14U Travel" },
];

const players = [
  { id: 1, name: "Jake Thompson", team: "10u-travel", age: 10, position: "SS/P", bats: "R", throws: "R", jerseyNumber: "12", parentName: "Mike Thompson", parentEmail: "mike.t@email.com", parentPhone: "(512) 555-1111", status: "active" },
  { id: 2, name: "Mia Rodriguez", team: "12u-rec", age: 12, position: "1B/OF", bats: "L", throws: "R", jerseyNumber: "7", parentName: "Elena Rodriguez", parentEmail: "elena.r@email.com", parentPhone: "(512) 555-2222", status: "active" },
  { id: 3, name: "Caleb Davis", team: "14u-travel", age: 14, position: "C/3B", bats: "R", throws: "R", jerseyNumber: "22", parentName: "James Davis", parentEmail: "james.d@email.com", parentPhone: "(512) 555-3333", status: "active" },
  { id: 4, name: "Lily Chen", team: "8u", age: 8, position: "OF", bats: "R", throws: "R", jerseyNumber: "3", parentName: "Wei Chen", parentEmail: "wei.c@email.com", parentPhone: "(512) 555-4444", status: "active" },
  { id: 5, name: "Noah Williams", team: "10u-travel", age: 10, position: "P/2B", bats: "L", throws: "L", jerseyNumber: "18", parentName: "Sarah Williams", parentEmail: "sarah.w@email.com", parentPhone: "(512) 555-5555", status: "active" },
  { id: 6, name: "Emma Garcia", team: "12u-travel", age: 12, position: "SS/P", bats: "R", throws: "R", jerseyNumber: "5", parentName: "Carlos Garcia", parentEmail: "carlos.g@email.com", parentPhone: "(512) 555-6666", status: "active" },
  { id: 7, name: "Aiden Brown", team: "14u-travel", age: 14, position: "OF/P", bats: "L", throws: "L", jerseyNumber: "24", parentName: "Amanda Brown", parentEmail: "amanda.b@email.com", parentPhone: "(512) 555-7777", status: "inactive" },
  { id: 8, name: "Sophia Martinez", team: "8u", age: 7, position: "IF", bats: "R", throws: "R", jerseyNumber: "9", parentName: "Maria Martinez", parentEmail: "maria.m@email.com", parentPhone: "(512) 555-8888", status: "active" },
];

export default function BaseballPlayers() {
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = players.filter((p) => {
    const matchesTeam = selectedTeam === "all" || p.team === selectedTeam;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.parentName.toLowerCase().includes(search.toLowerCase());
    return matchesTeam && matchesSearch;
  });

  return (
    <BaseballDashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display">PLAYERS</h1>
            <p className="text-muted-foreground">View and manage your team rosters.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
            <Button className="bg-[hsl(150,45%,35%)] hover:bg-[hsl(150,45%,30%)] text-white"><Plus className="h-4 w-4 mr-2" />Add Player</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {teams.map((t) => (
            <button key={t.id} onClick={() => setSelectedTeam(t.id)}
              className={`p-3 rounded-lg text-left transition-colors border ${selectedTeam === t.id ? "bg-[hsl(150,45%,35%)]/10 border-[hsl(150,45%,35%)] text-foreground" : "bg-card border-border hover:bg-secondary/50"}`}>
              <p className="text-2xl font-bold">{t.id === "all" ? players.length : players.filter(p => p.team === t.id).length}</p>
              <p className="text-xs text-muted-foreground">{t.name}</p>
            </button>
          ))}
        </div>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by player or parent name..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-full sm:w-[200px]"><SelectValue /></SelectTrigger>
                <SelectContent>{teams.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-xl font-display flex items-center gap-2">
              <Users className="h-5 w-5 text-[hsl(150,45%,35%)]" /> ROSTER ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Bats/Throws</TableHead>
                    <TableHead>Parent Contact</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-bold text-[hsl(150,45%,35%)]">{p.jerseyNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[hsl(150,30%,12%)] flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{p.name.split(" ").map(n => n[0]).join("")}</span>
                          </div>
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-xs text-muted-foreground">Age {p.age}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="capitalize">{teams.find(t => t.id === p.team)?.name}</Badge></TableCell>
                      <TableCell className="font-mono text-sm">{p.position}</TableCell>
                      <TableCell className="text-sm">{p.bats}/{p.throws}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{p.parentName}</p>
                          <p className="text-xs text-muted-foreground">{p.parentEmail}</p>
                          <p className="text-xs text-muted-foreground">{p.parentPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={p.status === "active" ? "bg-[hsl(150,45%,35%)]/10 text-[hsl(150,45%,35%)] border-[hsl(150,45%,35%)]/20" : "bg-muted text-muted-foreground"}>{p.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseballDashboardLayout>
  );
}
