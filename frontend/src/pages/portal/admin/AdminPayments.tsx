import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Search,
  Download,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";
import { useQuery } from "@apollo/client/react"; // Assuming Apollo Client
import { GET_PAYMENTS } from "@/lib/graphql/queries";
import { VerifyPaymentDialog } from "@/components/portal/dialogs";



const statusColors: Record<string, string> = {
  completed: "bg-green-500/20 text-green-400",
  pending: "bg-orange-500/20 text-orange-400",
  failed: "bg-red-500/20 text-red-400",
  paid: "bg-green-500/20 text-green-400", // Add 'paid' mapping if needed
};

const statusIcons: Record<string, React.ElementType> = {
  completed: CheckCircle,
  paid: CheckCircle,
  pending: Clock,
  failed: XCircle,
};

export default function AdminPayments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [verifyingPayment, setVerifyingPayment] = useState<any | null>(null);
  const { data, loading } = useQuery(GET_PAYMENTS);


  const payments = (data as any)?.payments || [];

  // Calculate stats
  const totalRevenue = payments
    .filter((p: any) => p.status === 'completed' || p.status === 'paid')
    .reduce((acc: number, curr: any) => acc + curr.amount, 0);

  const now = new Date();
  const thisMonthRevenue = payments
    .filter((p: any) => {
      const pDate = new Date(p.date);
      return (p.status === 'completed' || p.status === 'paid') &&
        pDate.getMonth() === now.getMonth() &&
        pDate.getFullYear() === now.getFullYear();
    })
    .reduce((acc: number, curr: any) => acc + curr.amount, 0);

  const pendingPayments = payments.filter((p: any) => p.status === 'pending');
  const pendingValue = pendingPayments.reduce((acc: number, curr: any) => acc + curr.amount, 0);

  const internshipRevenue = payments
    .filter((p: any) => (p.status === 'completed' || p.status === 'paid') && p.type === 'Internship Fee')
    .reduce((acc: number, curr: any) => acc + curr.amount, 0);

  const paymentStats = [
    { label: "Total Revenue", value: `${totalRevenue.toLocaleString()} RWF`, change: "Overall", trend: "up", icon: DollarSign },
    { label: "This Month", value: `${thisMonthRevenue.toLocaleString()} RWF`, change: "Current Period", trend: "up", icon: TrendingUp },
    { label: "Pending", value: `${pendingValue.toLocaleString()} RWF`, change: `${pendingPayments.length} payments`, trend: "neutral", icon: Clock },
    { label: "Internship Fees", value: `${internshipRevenue.toLocaleString()} RWF`, change: "Total", trend: "up", icon: CreditCard },
  ];

  const filteredPayments = payments.filter((payment: any) =>
    (payment.studentName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (payment.itemTitle?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-medium text-foreground">
              Payments
            </h1>
            <p className="text-muted-foreground mt-1">
              Track course enrollments and internship fee payments
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {paymentStats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-card-foreground/60 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                    <div className={`flex items-center gap-1 mt-1 text-xs text-card-foreground/60`}>
                      {stat.change}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* All Transactions */}
          <TabsContent value="all">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left p-4 text-sm font-medium text-card-foreground/70">Student</th>
                          <th className="text-left p-4 text-sm font-medium text-card-foreground/70">Type</th>
                          <th className="text-left p-4 text-sm font-medium text-card-foreground/70">Item</th>
                          <th className="text-right p-4 text-sm font-medium text-card-foreground/70">Amount</th>
                          <th className="text-center p-4 text-sm font-medium text-card-foreground/70">Date</th>
                          <th className="text-center p-4 text-sm font-medium text-card-foreground/70">Status</th>
                          <th className="text-center p-4 text-sm font-medium text-card-foreground/70">Method</th>
                          <th className="text-right p-4 text-sm font-medium text-card-foreground/70">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayments.length === 0 ? (
                          <tr><td colSpan={7} className="p-4 text-center text-muted-foreground">No payments found.</td></tr>
                        ) : (
                          filteredPayments.map((payment: any) => {
                            const StatusIcon = statusIcons[payment.status] || Clock;
                            return (
                              <tr key={payment.id} className="border-b border-border/30 hover:bg-background/50">
                                <td className="p-4">
                                  <p className="font-medium text-card-foreground">{payment.studentName}</p>
                                </td>
                                <td className="p-4">
                                  <Badge variant="secondary">{payment.type}</Badge>
                                </td>
                                <td className="p-4 text-sm text-card-foreground/70">{payment.itemTitle}</td>
                                <td className="p-4 text-right">
                                  <span className="font-medium text-accent">{payment.amount.toLocaleString()} {payment.currency}</span>
                                </td>
                                <td className="p-4 text-center text-sm text-card-foreground/70">{new Date(payment.date).toLocaleDateString()}</td>
                                <td className="p-4 text-center">
                                  <Badge className={statusColors[payment.status] || "bg-gray-500/20 text-gray-400"}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {payment.status}
                                  </Badge>
                                </td>
                                <td className="p-4 text-center text-sm text-card-foreground/70">{payment.method}</td>
                                <td className="p-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    {payment.status === 'pending' && (
                                      <Button
                                        variant="gold"
                                        size="sm"
                                        className="h-8 text-xs font-bold"
                                        onClick={() => setVerifyingPayment(payment)}
                                      >
                                        Verify
                                      </Button>
                                    )}
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>

                            );
                          }))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Pending Payments */}
          <TabsContent value="pending">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Clock className="w-5 h-5 text-accent" />
                    Pending Payments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {payments.filter((p: any) => p.status === 'pending').length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">No pending payments.</div>
                  ) : (
                    payments.filter((p: any) => p.status === 'pending').map((payment: any) => (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/30"
                      >
                        <div>
                          <h4 className="font-medium text-card-foreground">{payment.studentName}</h4>
                          <p className="text-sm text-card-foreground/60">{payment.type} - {payment.itemTitle}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-accent">{payment.amount.toLocaleString()} {payment.currency}</p>
                          <div className="flex items-center gap-1 text-xs mt-1 text-card-foreground/60">
                            <Calendar className="w-3 h-3" />
                            <span>Date: {new Date(payment.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Send Reminder</Button>
                          <Button
                            variant="gold"
                            size="sm"
                            onClick={() => setVerifyingPayment(payment)}
                          >
                            Verify Payment
                          </Button>
                        </div>
                      </div>
                    )))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>

        <VerifyPaymentDialog
          open={!!verifyingPayment}
          onOpenChange={(open) => !open && setVerifyingPayment(null)}
          payment={verifyingPayment}
        />
      </div>

    </PortalLayout>
  );
}
