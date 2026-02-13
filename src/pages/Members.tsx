import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Users, Search, Download, Plus } from "lucide-react";

const programs = [
  { id: "all", name: "All Programs" },
  { id: "youth", name: "Youth Wrestling" },
  { id: "middle", name: "Middle School" },
  { id: "high", name: "High School" },
  { id: "summer", name: "Summer Camp" },
];

const members = [
  { id: 1, name: "Marcus Johnson", program: "middle", age: 12, grade: "7th", weight: "105", parentName: "David Johnson", parentEmail: "david.johnson@email.com", parentPhone: "(512) 555-1234", usaWrestling: "TX-98765", status: "active" },
  { id: 2, name: "Emma Johnson", program: "youth", age: 8, grade: "3rd", weight: "62", parentName: "David Johnson", parentEmail: "david.johnson@email.com", parentPhone: "(512) 555-1234", usaWrestling: "TX-98766", status: "active" },
  { id: 3, name: "Tyler Williams", program: "middle", age: 13, grade: "8th", weight: "120", parentName: "Sarah Williams", parentEmail: "sarah.w@email.com", parentPhone: "(512) 555-2345", usaWrestling: "TX-87654", status: "active" },
  { id: 4, name: "Sophia Martinez", program: "youth", age: 9, grade: "4th", weight: "70", parentName: "Carlos Martinez", parentEmail: "carlos.m@email.com", parentPhone: "(512) 555-3456", usaWrestling: "TX-76543", status: "active" },
  { id: 5, name: "Liam Chen", program: "high", age: 16, grade: "11th", weight: "152", parentName: "Wei Chen", parentEmail: "wei.chen@email.com", parentPhone: "(512) 555-4567", usaWrestling: "TX-65432", status: "active" },
  { id: 6, name: "Olivia Brown", program: "high", age: 15, grade: "10th", weight: "130", parentName: "James Brown", parentEmail: "james.b@email.com", parentPhone: "(512) 555-5678", usaWrestling: "TX-54321", status: "active" },
  { id: 7, name: "Noah Davis", program: "youth", age: 7, grade: "2nd", weight: "55", parentName: "Amanda Davis", parentEmail: "amanda.d@email.com", parentPhone: "(512) 555-6789", usaWrestling: "TX-43210", status: "inactive" },
  { id: 8, name: "Ethan Garcia", program: "middle", age: 14, grade: "8th", weight: "135", parentName: "Maria Garcia", parentEmail: "maria.g@email.com", parentPhone: "(512) 555-7890", usaWrestling: "TX-32109", status: "active" },
  { id: 9, name: "Ava Wilson", program: "high", age: 17, grade: "12th", weight: "140", parentName: "Robert Wilson", parentEmail: "robert.w@email.com", parentPhone: "(512) 555-8901", usaWrestling: "TX-21098", status: "active" },
  { id: 10, name: "Jackson Lee", program: "summer", age: 10, grade: "5th", weight: "80", parentName: "Jenny Lee", parentEmail: "jenny.l@email.com", parentPhone: "(512) 555-9012", usaWrestling: "TX-10987", status: "active" },
];

export default function Members() {
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [search, setSearch] = useState("");
  const [weights, setWeights] = useState<Record<number, string>>(
    Object.fromEntries(members.map((m) => [m.id, m.weight]))
  );

  const filtered = members.filter((m) => {
    const matchesProgram = selectedProgram === "all" || m.program === selectedProgram;
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.parentName.toLowerCase().includes(search.toLowerCase());
    return matchesProgram && matchesSearch;
  });

  const programCounts = programs.map((p) => ({
    ...p,
    count: p.id === "all" ? members.length : members.filter((m) => m.program === p.id).length,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display">MEMBERS</h1>
            <p className="text-muted-foreground">View and manage your club roster.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
            <Button variant="hero"><Plus className="h-4 w-4 mr-2" />Add Member</Button>
          </div>
        </div>

        {/* Program quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {programCounts.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProgram(p.id)}
              className={`p-3 rounded-lg text-left transition-colors border ${
                selectedProgram === p.id
                  ? "bg-gold/10 border-gold text-foreground"
                  : "bg-card border-border hover:bg-secondary/50"
              }`}
            >
              <p className="text-2xl font-bold">{p.count}</p>
              <p className="text-xs text-muted-foreground">{p.name}</p>
            </button>
          ))}
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
                  {programs.map((p) => (
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Wrestler</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Weight (lbs)</TableHead>
                    <TableHead>Parent Contact</TableHead>
                    <TableHead>USA Wrestling #</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center">
                            <span className="text-xs font-bold text-white">{m.name.split(" ").map((n) => n[0]).join("")}</span>
                          </div>
                          <div>
                            <p className="font-medium">{m.name}</p>
                            <p className="text-xs text-muted-foreground">Age {m.age}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {programs.find((p) => p.id === m.program)?.name || m.program}
                        </Badge>
                      </TableCell>
                      <TableCell>{m.grade}</TableCell>
                      <TableCell>
                        <Input
                          className="w-20 h-8 text-center"
                          value={weights[m.id] || ""}
                          onChange={(e) => setWeights((prev) => ({ ...prev, [m.id]: e.target.value }))}
                          placeholder="—"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{m.parentName}</p>
                          <p className="text-xs text-muted-foreground">{m.parentEmail}</p>
                          <p className="text-xs text-muted-foreground">{m.parentPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-mono">{m.usaWrestling}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={m.status === "active" ? "bg-wrestling-green/10 text-wrestling-green border-wrestling-green/20" : "bg-muted text-muted-foreground"}
                        >
                          {m.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
