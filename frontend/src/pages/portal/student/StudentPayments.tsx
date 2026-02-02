import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Receipt,
  Search,
} from "lucide-react";
import { useQuery } from "@apollo/client/react";
import { GET_MY_PAYMENTS } from "@/lib/graphql/queries";
import { Input } from "@/components/ui/input";

const statusColors: Record<string, string> = {
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  pending: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30",
};

const statusIcons: Record<string, React.ElementType> = {
  completed: CheckCircle,
  pending: Clock,
  failed: XCircle,
};

export default function StudentPayments() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, loading } = useQuery(GET_MY_PAYMENTS);

  const payments = (data as any)?.myPayments || [];

  const filteredPayments = payments.filter((payment: any) => 
    payment.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.type.toLowerCase().includes(searchQuery.toLowerCase())
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
              Billing & Payments
            </h1>
            <p className="text-muted-foreground mt-1">
              View your transaction history and download receipts
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-48 bg-background/50"
              />
            </div>
          </div>
        </motion.div>

        {/* Payment History */}
        <div className="grid gap-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/20 pb-4">
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <Receipt className="w-5 h-5 text-accent" />
                Transaction History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/20">
                      <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Service</th>
                      <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Type</th>
                      <th className="text-right p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</th>
                      <th className="text-center p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                      <th className="text-center p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                      <th className="text-right p-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-muted-foreground">
                          <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
                            <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredPayments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-12 text-center text-muted-foreground">
                          No transactions found.
                        </td>
                      </tr>
                    ) : (
                      filteredPayments.map((payment: any) => {
                        const StatusIcon = statusIcons[payment.status] || Clock;
                        return (
                          <tr key={payment.id} className="hover:bg-accent/5 transition-colors group">
                            <td className="p-4">
                              <p className="font-bold text-foreground group-hover:text-accent transition-colors">
                                {payment.itemTitle}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">ID: {payment.id}</p>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className="text-[10px] font-bold border-border/50 uppercase tracking-tighter">
                                {payment.type}
                              </Badge>
                            </td>
                            <td className="p-4 text-right">
                              <span className="font-bold text-foreground">
                                {payment.amount.toLocaleString()} {payment.currency}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex flex-col items-center">
                                <span className="text-sm font-medium">{new Date(payment.date).toLocaleDateString()}</span>
                                <span className="text-[10px] text-muted-foreground">{new Date(payment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <Badge className={`${statusColors[payment.status]} flex items-center gap-1 mx-auto w-fit px-2`}>
                                <StatusIcon className="w-3 h-3" />
                                <span className="capitalize text-[10px] font-bold">{payment.status}</span>
                              </Badge>
                            </td>
                            <td className="p-4 text-right">
                              <Button variant="ghost" size="sm" className="h-8 text-xs font-bold hover:bg-gold/10 hover:text-gold">
                                <Download className="w-3.5 h-3.5 mr-1.5" />
                                Receipt
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-accent" />
                  Primary Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 rounded-xl border border-accent/20 bg-accent/5">
                  <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center border border-border/50">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/93/MTN_Logo.svg" alt="MTN" className="w-8" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">MTN Mobile Money</p>
                    <p className="text-xs text-muted-foreground">**** **** **08</p>
                  </div>
                  <Badge variant="outline" className="border-accent/30 text-accent font-bold text-[10px]">Active</Badge>
                </div>
                <Button variant="outline" className="w-full mt-4 h-10 font-bold border-dashed hover:border-accent">
                   Update Payment Method
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-heading flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-accent" />
                        Next Billing
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Upcoming Installment</span>
                            <span className="font-bold">None</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Current Outstanding</span>
                            <span className="font-bold text-accent">0 RWF</span>
                        </div>
                        <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border/30 italic">
                            You're all caught up! No pending payments for your current enrollments.
                        </p>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
