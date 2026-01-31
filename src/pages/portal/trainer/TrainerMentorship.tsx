import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  MessageSquare,
  Calendar,
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  Video,
  Send,
  Briefcase,
  Star,
} from "lucide-react";
import { AddFeedbackDialog, ViewProgressDialog } from "@/components/portal/dialogs";
import { toast } from "sonner";

const mentees = [
  {
    id: 1,
    name: "Jean Baptiste",
    email: "jean@example.com",
    avatar: "",
    course: "Software Development",
    progress: 68,
    internshipStatus: "eligible",
    lastSession: "3 days ago",
    nextSession: "Tomorrow, 3:00 PM",
    goals: ["Complete React project", "Prepare for internship"],
    notes: "Strong in frontend, needs help with backend concepts",
  },
  {
    id: 2,
    name: "Marie Uwase",
    email: "marie@example.com",
    avatar: "",
    course: "Data Science",
    progress: 45,
    internshipStatus: "in_progress",
    lastSession: "1 week ago",
    nextSession: "Friday, 4:00 PM",
    goals: ["Master Python", "Complete ML project"],
    notes: "Quick learner, enthusiastic about AI",
  },
  {
    id: 3,
    name: "Emmanuel K.",
    email: "emmanuel@example.com",
    avatar: "",
    course: "Software Development",
    progress: 82,
    internshipStatus: "placed",
    lastSession: "Yesterday",
    nextSession: null,
    goals: ["Excel at internship", "Learn cloud deployment"],
    notes: "Currently interning at TechCorp, doing great",
  },
];

const internshipStudents = [
  {
    id: 1,
    name: "Emmanuel K.",
    company: "TechCorp Rwanda",
    position: "Junior Developer",
    startDate: "Jan 15, 2026",
    progress: 40,
    mentor: "You",
    weeklyCheck: "Completed",
  },
  {
    id: 2,
    name: "Grace M.",
    company: "DataFlow Inc.",
    position: "Data Analyst Intern",
    startDate: "Jan 8, 2026",
    progress: 60,
    mentor: "You",
    weeklyCheck: "Pending",
  },
];

export default function TrainerMentorship() {
  const [selectedMentee, setSelectedMentee] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  
  // Dialog states
  const [feedbackStudent, setFeedbackStudent] = useState<{ name: string; type: "mentorship" | "internship" } | null>(null);
  const [progressStudent, setProgressStudent] = useState<{ name: string; progress: number; type: "mentorship" | "internship" } | null>(null);

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedMentee) return;
    
    const mentee = mentees.find(m => m.id === selectedMentee);
    toast.success(`Message sent to ${mentee?.name}`);
    setMessage("");
  };

  const handleScheduleSession = (menteeName: string) => {
    toast.info(`Opening scheduler for ${menteeName}...`);
  };

  const handleStartCall = (menteeName: string) => {
    toast.success(`Starting video call with ${menteeName}...`);
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
              Mentorship
            </h1>
            <p className="text-muted-foreground mt-1">
              Guide your mentees and track their journey to internship
            </p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-accent/20 text-accent border-0">
              <Users className="w-3 h-3 mr-1" />
              {mentees.length} Mentees
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-0">
              <Briefcase className="w-3 h-3 mr-1" />
              {internshipStudents.length} in Internship
            </Badge>
          </div>
        </motion.div>

        <Tabs defaultValue="mentees" className="space-y-6">
          <TabsList>
            <TabsTrigger value="mentees">My Mentees</TabsTrigger>
            <TabsTrigger value="internships">Internship Tracking</TabsTrigger>
          </TabsList>

          {/* Mentees Tab */}
          <TabsContent value="mentees">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Mentees List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2 space-y-4"
              >
                {mentees.map((mentee) => (
                  <Card
                    key={mentee.id}
                    className={`border-border/50 cursor-pointer transition-all hover:shadow-card-hover ${
                      selectedMentee === mentee.id ? "ring-2 ring-accent" : ""
                    }`}
                    onClick={() => setSelectedMentee(mentee.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={mentee.avatar} />
                          <AvatarFallback className="bg-accent/20 text-accent">
                            {getInitials(mentee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-card-foreground">
                                {mentee.name}
                              </h4>
                              <p className="text-sm text-card-foreground/60">
                                {mentee.course}
                              </p>
                            </div>
                            <Badge
                              className={
                                mentee.internshipStatus === "placed"
                                  ? "bg-green-500/20 text-green-400"
                                  : mentee.internshipStatus === "eligible"
                                  ? "bg-accent/20 text-accent"
                                  : "bg-blue-500/20 text-blue-400"
                              }
                            >
                              {mentee.internshipStatus === "placed"
                                ? "Interning"
                                : mentee.internshipStatus === "eligible"
                                ? "Eligible"
                                : "In Progress"}
                            </Badge>
                          </div>
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-card-foreground/60">Course Progress</span>
                              <span className="text-accent font-medium">{mentee.progress}%</span>
                            </div>
                            <Progress value={mentee.progress} className="h-2" />
                          </div>
                          <div className="flex items-center justify-between text-xs text-card-foreground/60">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Last session: {mentee.lastSession}
                            </span>
                            {mentee.nextSession && (
                              <span className="flex items-center gap-1 text-accent">
                                <Calendar className="w-3 h-3" />
                                Next: {mentee.nextSession}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>

              {/* Mentee Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {selectedMentee ? (
                  <Card className="border-border/50 sticky top-20">
                    <CardHeader>
                      <CardTitle className="text-lg font-heading">Mentee Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(() => {
                        const mentee = mentees.find(m => m.id === selectedMentee);
                        if (!mentee) return null;
                        return (
                          <>
                            <div className="text-center mb-4">
                              <Avatar className="w-16 h-16 mx-auto mb-2">
                                <AvatarFallback className="bg-accent/20 text-accent text-lg">
                                  {getInitials(mentee.name)}
                                </AvatarFallback>
                              </Avatar>
                              <h4 className="font-medium text-card-foreground">{mentee.name}</h4>
                              <p className="text-sm text-card-foreground/60">{mentee.email}</p>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <h5 className="text-sm font-medium text-card-foreground mb-2 flex items-center gap-2">
                                  <Target className="w-4 h-4 text-accent" />
                                  Current Goals
                                </h5>
                                <ul className="space-y-1">
                                  {mentee.goals.map((goal, i) => (
                                    <li key={i} className="text-sm text-card-foreground/70 flex items-center gap-2">
                                      <CheckCircle className="w-3 h-3 text-accent" />
                                      {goal}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h5 className="text-sm font-medium text-card-foreground mb-2">Notes</h5>
                                <p className="text-sm text-card-foreground/70 p-2 bg-background/50 rounded">
                                  {mentee.notes}
                                </p>
                              </div>

                              <div>
                                <h5 className="text-sm font-medium text-card-foreground mb-2">Quick Message</h5>
                                <Textarea
                                  placeholder="Send a message..."
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                  rows={3}
                                />
                                <Button 
                                  variant="gold" 
                                  size="sm" 
                                  className="w-full mt-2"
                                  onClick={handleSendMessage}
                                >
                                  <Send className="w-4 h-4 mr-1" />
                                  Send Message
                                </Button>
                              </div>

                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1"
                                  onClick={() => handleScheduleSession(mentee.name)}
                                >
                                  <Calendar className="w-4 h-4 mr-1" />
                                  Schedule
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1"
                                  onClick={() => handleStartCall(mentee.name)}
                                >
                                  <Video className="w-4 h-4 mr-1" />
                                  Call
                                </Button>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-border/50">
                    <CardContent className="py-12 text-center">
                      <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">
                        Select a mentee to view details
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>
          </TabsContent>

          {/* Internship Tracking Tab */}
          <TabsContent value="internships">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-accent" />
                    Students in Internship
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {internshipStudents.map((student) => (
                    <div
                      key={student.id}
                      className="p-4 bg-background/50 rounded-lg border border-border/30"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-card-foreground">{student.name}</h4>
                          <p className="text-sm text-card-foreground/60">
                            {student.position} at {student.company}
                          </p>
                        </div>
                        <Badge
                          className={
                            student.weeklyCheck === "Completed"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-orange-500/20 text-orange-400"
                          }
                        >
                          Weekly Check: {student.weeklyCheck}
                        </Badge>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-card-foreground/60">Internship Progress</span>
                          <span className="text-accent font-medium">{student.progress}%</span>
                        </div>
                        <Progress value={student.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-card-foreground/60">
                          Started: {student.startDate}
                        </span>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setProgressStudent({ 
                              name: student.name, 
                              progress: student.progress, 
                              type: "internship" 
                            })}
                          >
                            <TrendingUp className="w-4 h-4 mr-1" />
                            View Progress
                          </Button>
                          <Button 
                            variant="gold" 
                            size="sm"
                            onClick={() => setFeedbackStudent({ 
                              name: student.name, 
                              type: "internship" 
                            })}
                          >
                            <Star className="w-4 h-4 mr-1" />
                            Add Feedback
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <AddFeedbackDialog
        open={!!feedbackStudent}
        onOpenChange={(open) => !open && setFeedbackStudent(null)}
        studentName={feedbackStudent?.name || ""}
        type={feedbackStudent?.type || "mentorship"}
      />
      <ViewProgressDialog
        open={!!progressStudent}
        onOpenChange={(open) => !open && setProgressStudent(null)}
        studentName={progressStudent?.name || ""}
        progress={progressStudent?.progress || 0}
        type={progressStudent?.type || "mentorship"}
      />
    </PortalLayout>
  );
}
