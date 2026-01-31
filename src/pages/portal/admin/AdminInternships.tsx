import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Users,
  Building2,
  Plus,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { ViewInternshipDialog, AddCompanyDialog } from "@/components/portal/dialogs";
import { toast } from "sonner";

const internshipStats = [
  { label: "Active Internships", value: "45", icon: Briefcase },
  { label: "Partner Companies", value: "12", icon: Building2 },
  { label: "Eligible Students", value: "128", icon: Users },
  { label: "Completion Rate", value: "92%", icon: TrendingUp },
];

interface Internship {
  id: number;
  student: string;
  company: string;
  position: string;
  mentor: string;
  startDate: string;
  endDate: string;
  progress: number;
  paymentStatus: string;
}

const initialActiveInternships: Internship[] = [
  {
    id: 1,
    student: "Emmanuel K.",
    company: "TechCorp Rwanda",
    position: "Junior Developer",
    mentor: "Marie Claire",
    startDate: "Jan 15, 2026",
    endDate: "Apr 15, 2026",
    progress: 40,
    paymentStatus: "paid",
  },
  {
    id: 2,
    student: "Grace M.",
    company: "DataFlow Inc.",
    position: "Data Analyst Intern",
    mentor: "Emmanuel Kwizera",
    startDate: "Jan 8, 2026",
    endDate: "Apr 8, 2026",
    progress: 60,
    paymentStatus: "paid",
  },
  {
    id: 3,
    student: "Jean Baptiste",
    company: "IoT Solutions Ltd.",
    position: "IoT Developer",
    mentor: "Jean Pierre",
    startDate: "Jan 20, 2026",
    endDate: "Apr 20, 2026",
    progress: 25,
    paymentStatus: "pending",
  },
];

const eligibleStudents = [
  { id: 1, name: "Marie Uwase", course: "Data Science", progress: 85, paymentStatus: "pending" },
  { id: 2, name: "Patrick N.", course: "Software Development", progress: 82, paymentStatus: "paid" },
  { id: 3, name: "Alice K.", course: "Software Development", progress: 80, paymentStatus: "pending" },
];

const partnerCompanies = [
  { id: 1, name: "TechCorp Rwanda", industry: "Software", positions: 5, active: 3 },
  { id: 2, name: "DataFlow Inc.", industry: "Data & AI", positions: 3, active: 2 },
  { id: 3, name: "IoT Solutions Ltd.", industry: "IoT", positions: 4, active: 1 },
  { id: 4, name: "Kigali Tech Hub", industry: "Various", positions: 8, active: 4 },
];

export default function AdminInternships() {
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [activeInternships, setActiveInternships] = useState<Internship[]>(initialActiveInternships);
  
  // Dialog states
  const [viewInternship, setViewInternship] = useState<Internship | null>(null);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);

  // Assign form state
  const [assignForm, setAssignForm] = useState({
    student: "",
    company: "",
    mentor: "",
  });

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase();

  const handleAssignInternship = () => {
    if (!assignForm.student || !assignForm.company || !assignForm.mentor) {
      toast.error("Please fill in all fields");
      return;
    }

    const student = eligibleStudents.find(s => s.id.toString() === assignForm.student);
    const company = partnerCompanies.find(c => c.id.toString() === assignForm.company);

    const newInternship: Internship = {
      id: Date.now(),
      student: student?.name || "",
      company: company?.name || "",
      position: "Intern",
      mentor: assignForm.mentor === "marie" ? "Marie Claire" : assignForm.mentor === "emmanuel" ? "Emmanuel Kwizera" : "Jean Pierre",
      startDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      progress: 0,
      paymentStatus: "pending",
    };

    setActiveInternships([...activeInternships, newInternship]);
    toast.success(`${student?.name} assigned to ${company?.name}!`);
    setAssignForm({ student: "", company: "", mentor: "" });
    setIsAssignOpen(false);
  };

  const handleQuickAssign = (studentId: number) => {
    const student = eligibleStudents.find(s => s.id === studentId);
    if (student) {
      setAssignForm({ ...assignForm, student: studentId.toString() });
      setIsAssignOpen(true);
    }
  };

  const handleManageCompany = (companyName: string) => {
    toast.info(`Managing ${companyName}...`);
  };

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
              Internship Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Assign students to internships and track their progress
            </p>
          </div>
          <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
            <DialogTrigger asChild>
              <Button variant="gold">
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Internship
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Student to Internship</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Student *</label>
                  <Select
                    value={assignForm.student}
                    onValueChange={(value) => setAssignForm({ ...assignForm, student: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {eligibleStudents.map(s => (
                        <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Partner Company *</label>
                  <Select
                    value={assignForm.company}
                    onValueChange={(value) => setAssignForm({ ...assignForm, company: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a company" />
                    </SelectTrigger>
                    <SelectContent>
                      {partnerCompanies.map(c => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Assign Mentor *</label>
                  <Select
                    value={assignForm.mentor}
                    onValueChange={(value) => setAssignForm({ ...assignForm, mentor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a mentor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marie">Marie Claire</SelectItem>
                      <SelectItem value="emmanuel">Emmanuel Kwizera</SelectItem>
                      <SelectItem value="jean">Jean Pierre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-sm font-medium">Internship Fee: 20,000 RWF</p>
                    <p className="text-xs text-muted-foreground">Payment required before start</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setIsAssignOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="gold" className="flex-1" onClick={handleAssignInternship}>
                    Assign
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {internshipStats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
                    <p className="text-xs text-card-foreground/60">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Active Internships ({activeInternships.length})</TabsTrigger>
            <TabsTrigger value="eligible">Eligible Students ({eligibleStudents.length})</TabsTrigger>
            <TabsTrigger value="companies">Partner Companies ({partnerCompanies.length})</TabsTrigger>
          </TabsList>

          {/* Active Internships */}
          <TabsContent value="active">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {activeInternships.map((internship) => (
                <Card key={internship.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-accent/20 text-accent">
                            {getInitials(internship.student)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-card-foreground">{internship.student}</h4>
                          <p className="text-sm text-card-foreground/60">
                            {internship.position} at {internship.company}
                          </p>
                          <p className="text-xs text-card-foreground/50 mt-1">
                            Mentor: {internship.mentor}
                          </p>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-card-foreground/60">Progress</span>
                          <span className="text-accent font-medium">{internship.progress}%</span>
                        </div>
                        <Progress value={internship.progress} className="h-2" />
                        <div className="flex items-center justify-between text-xs mt-1 text-card-foreground/50">
                          <span>{internship.startDate}</span>
                          <span>{internship.endDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={
                          internship.paymentStatus === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-orange-500/20 text-orange-400"
                        }>
                          {internship.paymentStatus === "paid" ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Paid</>
                          ) : (
                            <><Clock className="w-3 h-3 mr-1" /> Pending</>
                          )}
                        </Badge>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setViewInternship(internship)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          {/* Eligible Students */}
          <TabsContent value="eligible">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-heading">Students Ready for Internship</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {eligibleStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 bg-background/50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-accent/20 text-accent">
                            {getInitials(student.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-card-foreground">{student.name}</h4>
                          <p className="text-sm text-card-foreground/60">{student.course}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-accent">{student.progress}%</p>
                          <p className="text-xs text-card-foreground/60">Course Complete</p>
                        </div>
                        <Badge className={
                          student.paymentStatus === "paid"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-orange-500/20 text-orange-400"
                        }>
                          {student.paymentStatus === "paid" ? "Fee Paid" : "Fee Pending"}
                        </Badge>
                        <Button 
                          variant="gold" 
                          size="sm"
                          onClick={() => handleQuickAssign(student.id)}
                        >
                          <UserPlus className="w-4 h-4 mr-1" /> Assign
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Partner Companies */}
          <TabsContent value="companies">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 gap-4"
            >
              {partnerCompanies.map((company) => (
                <Card key={company.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-medium text-card-foreground">{company.name}</h4>
                          <p className="text-sm text-card-foreground/60">{company.industry}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleManageCompany(company.name)}
                      >
                        Manage
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-card-foreground/70">
                        <Briefcase className="w-4 h-4" />
                        {company.positions} positions
                      </div>
                      <div className="flex items-center gap-1 text-accent">
                        <Users className="w-4 h-4" />
                        {company.active} active
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Card className="border-border/50 border-dashed">
                <CardContent className="p-4 flex items-center justify-center h-full">
                  <Button variant="ghost" onClick={() => setIsAddCompanyOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Partner Company
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <ViewInternshipDialog
        open={!!viewInternship}
        onOpenChange={(open) => !open && setViewInternship(null)}
        internship={viewInternship}
      />
      <AddCompanyDialog
        open={isAddCompanyOpen}
        onOpenChange={setIsAddCompanyOpen}
      />
    </PortalLayout>
  );
}
