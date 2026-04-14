import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  DollarSign, 
  TrendingUp,
  Users,
  CreditCard,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

type Payment = {
  id: string;
  description: string;
  amount: number;
  status: string;
  created_at: string;
  due_date: string | null;
  paid_at: string | null;
  parent_id: string | null;
  profiles?: { full_name: string; email: string } | null;
};

export default function Payments() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [newDescription, setNewDescription] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newStatus, setNewStatus] = useState<"pending" | "paid">("pending");

  useEffect(() => {
    if (profile?.club_id) loadPayments(profile.club_id);
  }, [profile]);

  async function loadPayments(clubId: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from('payments')
      .select('*, profiles(full_name, email)')
      .eq('club_id', clubId)
      .order('created_at', { ascending: false });

    if (!error) setPayments((data ?? []) as Payment[]);
    setLoading(false);
  }

  async function handleAddPayment() {
    if (!newDescription.trim() || !newAmount || !profile?.club_id) return;
    setSaving(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('payments')
        .insert({
          description: newDescription,
          amount: parseFloat(newAmount),
          status: newStatus,
          due_date: newDueDate || null,
          paid_at: newStatus === 'paid' ? new Date().toISOString() : null,
          club_id: profile.club_id,
          parent_id: null,
        });

      if (insertError) throw insertError;

      setAddOpen(false);
      resetForm();
      loadPayments(profile.club_id);
    } catch (err: any) {
      setError('Failed to add payment. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setNewDescription("");
    setNewAmount("");
    setNewDueDate("");
    setNewStatus("pending");
    setError(null);
  }

  // Compute stats from real data
  const totalRevenue = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const thisMonth = payments
    .filter(p => {
      if (p.status !== 'paid' || !p.paid_at) return false;
      const paid = new Date(p.paid_at);
      const now = new Date();
      return paid.getMonth() === now.getMonth() && paid.getFullYear() === now.getFullYear();
    })
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const outstanding = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const payingMembers = new Set(payments.filter(p => p.status === 'paid').map(p => p.parent_id)).size;

  const outstandingPayments = payments.filter(p => p.status === 'pending');
  const recentPayments = payments.slice(0, 10);

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display">PAYMENTS</h1>
            <p className="text-muted-foreground">Track dues, fees, and transactions</p>
          </div>
          <div className="flex gap-3">
            <Button variant="hero" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />Request Payment
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-wrestling-green/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-wrestling-green" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${thisMonth.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-wrestling-red/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-wrestling-red" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${outstanding.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Outstanding</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-navy" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{payingMembers}</p>
                  <p className="text-sm text-muted-foreground">Paying Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle className="text-xl font-display">RECENT TRANSACTIONS</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gold" />
                </div>
              ) : recentPayments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No transactions yet</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={() => setAddOpen(true)}>
                    Add first payment
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-3 font-medium text-muted-foreground">Description</th>
                        <th className="pb-3 font-medium text-muted-foreground">Amount</th>
                        <th className="pb-3 font-medium text-muted-foreground">Status</th>
                        <th className="pb-3 font-medium text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayments.map((p) => (
                        <tr key={p.id} className="border-b last:border-0">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                                <CreditCard className="h-5 w-5 text-gold" />
                              </div>
                              <div>
                                <p className="font-medium">{p.description}</p>
                                {p.profiles && (
                                  <p className="text-xs text-muted-foreground">{p.profiles.full_name}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 font-semibold">${Number(p.amount).toLocaleString()}</td>
                          <td className="py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              p.status === "paid"
                                ? "bg-wrestling-green/10 text-wrestling-green"
                                : p.status === "pending"
                                ? "bg-gold/10 text-gold"
                                : "bg-wrestling-red/10 text-wrestling-red"
                            }`}>
                              {p.status === "paid" && <CheckCircle className="h-3 w-3" />}
                              {p.status === "pending" && <Clock className="h-3 w-3" />}
                              {p.status === "failed" && <AlertCircle className="h-3 w-3" />}
                              {p.status}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">
                            {formatDate(p.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Outstanding Payments */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl font-display">OUTSTANDING</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {outstandingPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No outstanding payments</p>
                </div>
              ) : (
                outstandingPayments.slice(0, 5).map((p) => (
                  <div key={p.id} className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">
                        {p.profiles?.full_name ?? p.description}
                      </span>
                      <span className="text-lg font-bold text-wrestling-red">
                        ${Number(p.amount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{p.description}</span>
                      {p.due_date && <span>Due: {formatDate(p.due_date)}</span>}
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3">
                      Send Reminder
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Payment Setup Card */}
        <Card className="shadow-card bg-gradient-to-r from-navy to-navy-light text-white">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                  <CreditCard className="h-8 w-8 text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-display mb-1">CONNECT PAYMENT PROCESSOR</h3>
                  <p className="text-white/70">Accept online payments with Stripe integration</p>
                </div>
              </div>
              <Button variant="hero" size="lg" onClick={() => navigate("/wrestling/dashboard/payments/setup")}>
                Set Up Payments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Payment Dialog */}
      <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) resetForm(); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">REQUEST PAYMENT</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Description *</Label>
              <Input
                placeholder="e.g. Registration Fee, Monthly Dues"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Amount ($) *</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as "pending" | "paid")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
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
                onClick={handleAddPayment}
                disabled={saving || !newDescription.trim() || !newAmount}
              >
                {saving ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                ) : "Add Payment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
