import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  FileText, 
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Download,
  Copy,
  Send,
  Bell
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const registrations = [
  { 
    id: 1, 
    name: "Marcus Johnson", 
    program: "Youth Wrestling",
    parent: "David Johnson",
    status: "pending",
    waiver: false,
    payment: true,
    date: "Feb 3, 2024"
  },
  { 
    id: 2, 
    name: "Emily Chen", 
    program: "High School",
    parent: "Lisa Chen",
    status: "complete",
    waiver: true,
    payment: true,
    date: "Feb 2, 2024"
  },
  { 
    id: 3, 
    name: "Tyler Williams", 
    program: "Middle School",
    parent: "Sarah Williams",
    status: "pending",
    waiver: true,
    payment: false,
    date: "Feb 1, 2024"
  },
  { 
    id: 4, 
    name: "Olivia Brown", 
    program: "Youth Wrestling",
    parent: "Michael Brown",
    status: "complete",
    waiver: true,
    payment: true,
    date: "Jan 30, 2024"
  },
];

const programs = [
  { name: "Youth Wrestling", price: 150, spots: 24, filled: 18 },
  { name: "Middle School", price: 200, spots: 20, filled: 15 },
  { name: "High School", price: 250, spots: 25, filled: 22 },
  { name: "Summer Camp", price: 300, spots: 40, filled: 8 },
];

export default function Registration() {
  const [showWaiverPreview, setShowWaiverPreview] = useState(false);

  const stats = {
    total: registrations.length,
    complete: registrations.filter(r => r.status === "complete").length,
    pending: registrations.filter(r => r.status === "pending").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display">REGISTRATION</h1>
            <p className="text-muted-foreground">Manage wrestler registrations and waivers</p>
          </div>
           <div className="flex gap-3">
             <Button variant="outline" onClick={() => {
               const pendingCount = registrations.filter(r => r.status === "pending").length;
               toast.success(`Reminder sent to ${pendingCount} incomplete registrations`, {
                 description: "Parents will receive an email to complete their registration."
               });
             }}>
               <Bell className="h-4 w-4 mr-2" />
               Send All Reminders ({registrations.filter(r => r.status === "pending").length})
             </Button>
             <Button variant="outline">
               <Copy className="h-4 w-4 mr-2" />
               Copy Link
             </Button>
             <Button variant="hero">
               <Plus className="h-4 w-4 mr-2" />
               Add Wrestler
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
              <CardTitle className="text-xl font-display">RECENT REGISTRATIONS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Wrestler</th>
                      <th className="pb-3 font-medium text-muted-foreground">Program</th>
                      <th className="pb-3 font-medium text-muted-foreground">Waiver</th>
                      <th className="pb-3 font-medium text-muted-foreground">Payment</th>
                      <th className="pb-3 font-medium text-muted-foreground">Status</th>
                      <th className="pb-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg) => (
                      <tr key={reg.id} className="border-b last:border-0">
                        <td className="py-4">
                          <div>
                            <p className="font-medium">{reg.name}</p>
                            <p className="text-sm text-muted-foreground">{reg.parent}</p>
                          </div>
                        </td>
                        <td className="py-4 text-sm">{reg.program}</td>
                        <td className="py-4">
                          {reg.waiver ? (
                            <CheckCircle className="h-5 w-5 text-wrestling-green" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-gold" />
                          )}
                        </td>
                        <td className="py-4">
                          {reg.payment ? (
                            <CheckCircle className="h-5 w-5 text-wrestling-green" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-gold" />
                          )}
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            reg.status === "complete" 
                              ? "bg-wrestling-green/10 text-wrestling-green" 
                              : "bg-gold/10 text-gold"
                          }`}>
                            {reg.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <Button variant="ghost" size="sm">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                {programs.map((program) => (
                  <div key={program.name} className="p-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{program.name}</span>
                      <span className="text-sm font-bold text-gold">${program.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>{program.filled} / {program.spots} spots</span>
                      <span>{Math.round((program.filled / program.spots) * 100)}%</span>
                    </div>
                    <Progress value={(program.filled / program.spots) * 100} className="h-2" />
                  </div>
                ))}
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
                    <p className="text-sm text-muted-foreground">Last updated Feb 1, 2024</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex-1">Preview</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-display">LIABILITY WAIVER</DialogTitle>
                      </DialogHeader>
                      <div className="prose prose-sm">
                        <h3>Release and Waiver of Liability</h3>
                        <p>
                          In consideration of being permitted to participate in wrestling activities 
                          at Thunder Wrestling Club, I hereby agree to the following:
                        </p>
                        <h4>1. Assumption of Risk</h4>
                        <p>
                          I understand that wrestling involves inherent risks including but not limited to 
                          physical contact, falls, collisions, and the potential for serious injury.
                        </p>
                        <h4>2. Release of Liability</h4>
                        <p>
                          I release and hold harmless Thunder Wrestling Club, its coaches, volunteers, 
                          and affiliates from any claims, damages, or losses arising from participation.
                        </p>
                        <h4>3. Medical Authorization</h4>
                        <p>
                          I authorize club personnel to seek emergency medical treatment for the 
                          participant if necessary and agree to be responsible for all medical expenses.
                        </p>
                        <h4>4. Photo/Video Release</h4>
                        <p>
                          I grant permission for photos and videos taken during club activities to be 
                          used for promotional purposes.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <Button variant="hero" className="w-full">
                  Edit Waiver
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
