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

const paymentStats = [
  { label: "Total Revenue", value: "2.4M RWF", change: "+18%", trend: "up", icon: DollarSign },
  { label: "This Month", value: "450K RWF", change: "+12%", trend: "up", icon: TrendingUp },
  { label: "Pending", value: "85K RWF", change: "8 payments", trend: "neutral", icon: Clock },
  { label: "Internship Fees", value: "900K RWF", change: "+25%", trend: "up", icon: CreditCard },
];

const recentPayments = [
  {
    id: 1,
    student: "Jean Baptiste",
    type: "Course Enrollment",
    course: "Software Development",
    amount: "150,000 RWF",
    date: "Jan 30, 2026",
    status: "completed",
    method: "Mobile Money",
  },
  {
    id: 2,
    student: "Marie Uwase",
    type: "Course Enrollment",
    course: "Data Science & AI",
    amount: "180,000 RWF",
    date: "Jan 30, 2026",
    status: "completed",
    method: "Bank Transfer",
  },
  {
    id: 3,
    student: "Emmanuel K.",
    type: "Internship Fee",
    course: "N/A",
    amount: "20,000 RWF",
    date: "Jan 29, 2026",
    status: "completed",
    method: "Mobile Money",
  },
  {
    id: 4,
    student: "Grace M.",
    type: "Course Enrollment",
    course: "IoT Development",
    amount: "120,000 RWF",
    date: "Jan 28, 2026",
    status: "pending",
    method: "Pending",
  },
  {
    id: 5,
    student: "Patrick N.",
    type: "Internship Fee",
    course: "N/A",
    amount: "20,000 RWF",
    date: "Jan 27, 2026",
    status: "failed",
    method: "Mobile Money",
  },
];

const pendingPayments = [
  {
    id: 1,
    student: "Alice K.",
    type: "Internship Fee",
    amount: "20,000 RWF",
    dueDate: "Feb 1, 2026",
    daysOverdue: 0,
  },
  {
    id: 2,
    student: "Grace M.",
    type: "Course Enrollment",
    amount: "120,000 RWF",
    dueDate: "Jan 30, 2026",
    daysOverdue: 1,
  },
  {
    id: 3,
    student: "Robert M.",
    type: "Course Enrollment",
    amount: "150,000 RWF",
    dueDate: "Jan 25, 2026",
    daysOverdue: 6,
  },
];

const statusColors: Record<string, string> = {
  completed: "bg-green-500/20 text-green-400",
  pending: "bg-orange-500/20 text-orange-400",
  failed: "bg-red-500/20 text-red-400",
};

const statusIcons: Record<string, React.ElementType> = {
  completed: CheckCircle,
  pending: Clock,
  failed: XCircle,
};

export default function AdminPayments() {
  const [searchQuery, setSearchQuery] = useState("");

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
                    <div className={`flex items-center gap-1 mt-1 text-xs ${
                      stat.trend === "up" ? "text-green-400" : 
                      stat.trend === "down" ? "text-red-400" : "text-card-foreground/60"
                    }`}>
                      {stat.trend === "up" && <ArrowUpRight className="w-3 h-3" />}
                      {stat.trend === "down" && <ArrowDownRight className="w-3 h-3" />}
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
                          <th className="text-left p-4 text-sm font-medium text-card-foreground/70">Course</th>
                          <th className="text-right p-4 text-sm font-medium text-card-foreground/70">Amount</th>
                          <th className="text-center p-4 text-sm font-medium text-card-foreground/70">Date</th>
                          <th className="text-center p-4 text-sm font-medium text-card-foreground/70">Status</th>
                          <th className="text-center p-4 text-sm font-medium text-card-foreground/70">Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentPayments.map((payment) => {
                          const StatusIcon = statusIcons[payment.status];
                          return (
                            <tr key={payment.id} className="border-b border-border/30 hover:bg-background/50">
                              <td className="p-4">
                                <p className="font-medium text-card-foreground">{payment.student}</p>
                              </td>
                              <td className="p-4">
                                <Badge variant="secondary">{payment.type}</Badge>
                              </td>
                              <td className="p-4 text-sm text-card-foreground/70">{payment.course}</td>
                              <td className="p-4 text-right">
                                <span className="font-medium text-accent">{payment.amount}</span>
                              </td>
                              <td className="p-4 text-center text-sm text-card-foreground/70">{payment.date}</td>
                              <td className="p-4 text-center">
                                <Badge className={statusColors[payment.status]}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {payment.status}
                                </Badge>
                              </td>
                              <td className="p-4 text-center text-sm text-card-foreground/70">{payment.method}</td>
                            </tr>
                          );
                        })}
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
                  {pendingPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 bg-background/50 rounded-lg border border-border/30"
                    >
                      <div>
                        <h4 className="font-medium text-card-foreground">{payment.student}</h4>
                        <p className="text-sm text-card-foreground/60">{payment.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-accent">{payment.amount}</p>
                        <div className="flex items-center gap-1 text-xs mt-1">
                          <Calendar className="w-3 h-3" />
                          <span className={payment.daysOverdue > 0 ? "text-red-400" : "text-card-foreground/60"}>
                            {payment.daysOverdue > 0 
                              ? `${payment.daysOverdue} days overdue` 
                              : `Due: ${payment.dueDate}`
                            }
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Send Reminder</Button>
                        <Button variant="gold" size="sm">Mark Paid</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </PortalLayout>
  );
}
