import { useParams } from "react-router-dom";
import ParentDashboardLayout from "@/components/layout/ParentDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, CreditCard } from "lucide-react";

const payments = [
  { id: 1, description: "Middle School Registration", amount: 225, date: "Jan 15, 2024", status: "paid" },
  { id: 2, description: "Youth Wrestling Registration", amount: 175, date: "Jan 15, 2024", status: "paid" },
  { id: 3, description: "Tournament Fee - Austin Youth", amount: 35, date: "Feb 1, 2024", status: "pending" },
  { id: 4, description: "Equipment Fee", amount: 50, date: "Dec 10, 2023", status: "paid" },
  { id: 5, description: "Summer Camp Deposit", amount: 100, date: "Feb 5, 2024", status: "pending" },
];

export default function ClubParentPayments() {
  const totalPending = payments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);

  return (
    <ParentDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display">PAYMENTS</h1>
            <p className="text-muted-foreground">View payment history and outstanding balances.</p>
          </div>
          {totalPending > 0 && (
            <Button variant="hero"><CreditCard className="h-4 w-4 mr-2" />Pay ${totalPending} Balance</Button>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-wrestling-green">${payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0)}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Paid</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-gold">${totalPending}</p>
              <p className="text-sm text-muted-foreground mt-1">Outstanding</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold">{payments.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Transactions</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader><CardTitle className="text-xl font-display">PAYMENT HISTORY</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  {p.status === "paid" ? <CheckCircle className="h-5 w-5 text-wrestling-green" /> : <Clock className="h-5 w-5 text-gold" />}
                  <div>
                    <p className="font-medium">{p.description}</p>
                    <p className="text-sm text-muted-foreground">{p.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${p.amount}</p>
                  <Badge variant={p.status === "paid" ? "secondary" : "outline"} className={p.status === "pending" ? "border-gold text-gold" : ""}>{p.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </ParentDashboardLayout>
  );
}
