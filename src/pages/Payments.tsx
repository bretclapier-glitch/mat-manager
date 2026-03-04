import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  TrendingUp,
  Users,
  CreditCard,
  ArrowRight,
  Download,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

const transactions = [
  { 
    id: "TXN-001", 
    name: "Sarah Johnson", 
    type: "Registration Fee",
    amount: 150,
    status: "completed",
    date: "Feb 3, 2024"
  },
  { 
    id: "TXN-002", 
    name: "Mike Chen", 
    type: "Monthly Dues",
    amount: 75,
    status: "completed",
    date: "Feb 2, 2024"
  },
  { 
    id: "TXN-003", 
    name: "Lisa Williams", 
    type: "Merch Purchase",
    amount: 45,
    status: "pending",
    date: "Feb 2, 2024"
  },
  { 
    id: "TXN-004", 
    name: "David Brown", 
    type: "Registration Fee",
    amount: 150,
    status: "failed",
    date: "Feb 1, 2024"
  },
  { 
    id: "TXN-005", 
    name: "Emily Davis", 
    type: "Monthly Dues",
    amount: 75,
    status: "completed",
    date: "Feb 1, 2024"
  },
];

const outstandingPayments = [
  { name: "Marcus Johnson", amount: 150, dueDate: "Feb 10, 2024", type: "Registration" },
  { name: "Tyler Williams", amount: 75, dueDate: "Feb 15, 2024", type: "Monthly Dues" },
  { name: "Olivia Brown", amount: 45, dueDate: "Feb 18, 2024", type: "Equipment" },
];

export default function Payments() {
  const stats = {
    totalRevenue: 8420,
    thisMonth: 2340,
    outstanding: 270,
    members: 156,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display">PAYMENTS</h1>
            <p className="text-muted-foreground">Track dues, fees, and transactions</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="hero">
              <Plus className="h-4 w-4 mr-2" />
              Request Payment
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
                  <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
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
                  <p className="text-2xl font-bold">${stats.thisMonth.toLocaleString()}</p>
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
                  <p className="text-2xl font-bold">${stats.outstanding}</p>
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
                  <p className="text-2xl font-bold">{stats.members}</p>
                  <p className="text-sm text-muted-foreground">Paying Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-display">RECENT TRANSACTIONS</CardTitle>
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Transaction</th>
                      <th className="pb-3 font-medium text-muted-foreground">Type</th>
                      <th className="pb-3 font-medium text-muted-foreground">Amount</th>
                      <th className="pb-3 font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn) => (
                      <tr key={txn.id} className="border-b last:border-0">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-gold" />
                            </div>
                            <div>
                              <p className="font-medium">{txn.name}</p>
                              <p className="text-xs text-muted-foreground">{txn.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-sm">{txn.type}</td>
                        <td className="py-4 font-semibold">${txn.amount}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            txn.status === "completed" 
                              ? "bg-wrestling-green/10 text-wrestling-green" 
                              : txn.status === "pending"
                              ? "bg-gold/10 text-gold"
                              : "bg-wrestling-red/10 text-wrestling-red"
                          }`}>
                            {txn.status === "completed" && <CheckCircle className="h-3 w-3" />}
                            {txn.status === "pending" && <Clock className="h-3 w-3" />}
                            {txn.status === "failed" && <AlertCircle className="h-3 w-3" />}
                            {txn.status}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">{txn.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Outstanding Payments */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl font-display">OUTSTANDING</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {outstandingPayments.map((payment, index) => (
                <div key={index} className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{payment.name}</span>
                    <span className="text-lg font-bold text-wrestling-red">${payment.amount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{payment.type}</span>
                    <span>Due: {payment.dueDate}</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Send Reminder
                  </Button>
                </div>
              ))}
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
    </DashboardLayout>
  );
}
