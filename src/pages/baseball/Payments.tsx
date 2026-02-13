import BaseballDashboardLayout from "@/components/layout/BaseballDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, CreditCard } from "lucide-react";

const payments = [
  { id: 1, description: "10U Travel Registration", amount: 350, date: "Jan 10, 2024", status: "paid" },
  { id: 2, description: "12U Rec Registration", amount: 200, date: "Jan 12, 2024", status: "paid" },
  { id: 3, description: "Spring Tournament Fee", amount: 75, date: "Feb 1, 2024", status: "pending" },
  { id: 4, description: "Uniform Package", amount: 120, date: "Jan 15, 2024", status: "paid" },
  { id: 5, description: "14U Travel Registration", amount: 400, date: "Feb 5, 2024", status: "pending" },
];

export default function BaseballPayments() {
  const totalPending = payments.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  return (
    <BaseballDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-display">PAYMENTS</h1><p className="text-muted-foreground">Track revenue and outstanding balances.</p></div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="shadow-card"><CardContent className="p-6 text-center"><p className="text-3xl font-bold text-[hsl(150,45%,35%)]">${payments.filter(p => p.status === "paid").reduce((s,p) => s+p.amount, 0)}</p><p className="text-sm text-muted-foreground mt-1">Total Collected</p></CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-6 text-center"><p className="text-3xl font-bold text-amber-500">${totalPending}</p><p className="text-sm text-muted-foreground mt-1">Outstanding</p></CardContent></Card>
          <Card className="shadow-card"><CardContent className="p-6 text-center"><p className="text-3xl font-bold">{payments.length}</p><p className="text-sm text-muted-foreground mt-1">Transactions</p></CardContent></Card>
        </div>
        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-xl font-display">PAYMENT HISTORY</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  {p.status === "paid" ? <CheckCircle className="h-5 w-5 text-[hsl(150,45%,35%)]" /> : <Clock className="h-5 w-5 text-amber-500" />}
                  <div><p className="font-medium">{p.description}</p><p className="text-sm text-muted-foreground">{p.date}</p></div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${p.amount}</p>
                  <Badge variant={p.status === "paid" ? "secondary" : "outline"} className={p.status === "pending" ? "border-amber-500 text-amber-500" : ""}>{p.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </BaseballDashboardLayout>
  );
}
