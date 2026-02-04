import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  Users,
  Target,
  MessageSquare,
  CreditCard,
  FileText,
  Star,
  ArrowRight,
  AlertCircle,
  Lock,
  Layers,
  FileCode,
  Award,
  Loader2,
} from "lucide-react";
import { ApplyInternshipDialog, BookCallDialog, TeamChatDialog, ProjectDetailsDialog } from "@/components/portal/dialogs";
import { toast } from "sonner";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_MY_INTERNSHIP } from "@/lib/graphql/queries";
import { UPDATE_INTERNSHIP_PAYMENT } from "@/lib/graphql/mutations";

export default function StudentInternship() {
  const { data, loading, error, refetch } = useQuery(GET_MY_INTERNSHIP);
  const internship = (data as any)?.myInternship;

  const [updatePayment, { loading: isPaying }] = useMutation(UPDATE_INTERNSHIP_PAYMENT, {
    onCompleted: () => {
      toast.success("Payment successful! Your internship is now active.");
      refetch();
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const handlePay = () => {
    if (!internship) return;
    updatePayment({
      variables: {
        id: internship.id,
        status: "paid",
        paidAt: new Date().toISOString()
      }
    });
  };
  
  const [applyOpen, setApplyOpen] = useState(false);
  const [bookCallOpen, setBookCallOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<any>(null);
  const [projectDetailsOpen, setProjectDetailsOpen] = useState(false);

  if (loading) return (
    <PortalLayout>
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    </PortalLayout>
  );

  if (error) return (
    <PortalLayout>
      <div className="p-8 text-destructive bg-destructive/5 rounded-lg border border-destructive/20">
        Error: {error.message}
      </div>
    </PortalLayout>
  );

  const status = internship?.status || "not_eligible";
  const stages = [
    "Stage 1: Foundation",
    "Stage 2: Intermediate",
    "Stage 3: Advanced",
    "Stage 4: Professional",
    "Graduated"
  ];
  const currentStageIndex = stages.indexOf(internship?.stage || "");

  return (
    <PortalLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl lg:text-3xl font-medium text-foreground">
              Your Internship Journey
            </h1>
            <p className="text-muted-foreground mt-1">
              Master professional skills through real-world academy projects
            </p>
          </div>
          {internship && (
            <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20 px-3 py-1">
              <Layers className="w-3.5 h-3.5 mr-2" />
              {internship.stage}
            </Badge>
          )}
        </div>

        {!internship ? (
          <Card className="border-border/50 border-accent/30 overflow-hidden">
            <CardContent className="p-8 lg:p-12 text-center max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-10 h-10 text-accent" />
              </div>
              <h2 className="font-heading text-2xl font-bold mb-4">Start Your Professional Career</h2>
              <p className="text-muted-foreground mb-8">
                Our internal internship program is designed to bridge the gap between learning and employment. 
                You'll work on production-level projects, receive 1:1 mentorship, and move through 
                different stages until you're industry-ready.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="space-y-1">
                  <div className="font-bold text-accent text-xl">1:1</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">Mentorship</div>
                </div>
                <div className="space-y-1 border-x border-border/50">
                  <div className="font-bold text-accent text-xl">4 Stages</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">Progression</div>
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-accent text-xl">Live</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">Projects</div>
                </div>
              </div>
              <Button variant="gold" size="lg" onClick={() => setApplyOpen(true)} className="px-8 shadow-xl shadow-gold/20">
                Enroll in Program <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column: Progression & Projects */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Alert for Eligible Status */}
              {(internship.status === 'eligible' || internship.payment?.status === 'pending') && (
                <Card className="border-accent/40 bg-accent/5 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                        <CreditCard className="w-8 h-8 text-accent" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="text-lg font-bold mb-1">Activation Required</h3>
                        <p className="text-sm text-muted-foreground mb-4 md:mb-0">
                          Your application is registered! Please pay the one-time application fee of 20,000 RWF to activate your internship and start Stage 1.
                        </p>
                      </div>
                      <Button 
                        variant="gold" 
                        size="lg" 
                        className="shrink-0 shadow-lg shadow-gold/20"
                        onClick={handlePay}
                        disabled={isPaying}
                      >
                        {isPaying ? (
                           <>
                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                             Processing...
                           </>
                        ) : (
                          <>
                            Pay Now <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stages Visualizer */}
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-6 flex items-center gap-2">
                    <Target className="w-4 h-4 text-accent" />
                    Progression Roadmap
                  </h3>
                  <div className="relative pt-2">
                    <div className="flex justify-between items-start">
                      {stages.map((st, idx) => (
                        <div key={st} className="flex flex-col items-center gap-3 relative z-10 flex-1">
                          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                            idx <= currentStageIndex 
                              ? "bg-accent border-accent text-accent-foreground shadow-lg shadow-accent/20" 
                              : "bg-muted border-border text-muted-foreground"
                          }`}>
                            {idx < currentStageIndex ? <CheckCircle className="w-5 h-5" /> : idx === currentStageIndex ? <Star className="w-5 h-5 animate-pulse" /> : <Lock className="w-4 h-4" />}
                          </div>
                          <span className={`text-[10px] text-center font-bold uppercase transition-colors ${
                            idx === currentStageIndex ? "text-accent" : "text-muted-foreground"
                          }`}>
                            {st.split(": ")[1] || st}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Line behind */}
                    <div className="absolute top-7 left-[10%] right-[10%] h-0.5 bg-muted -z-0" />
                    <div 
                      className="absolute top-7 left-[10%] h-0.5 bg-accent transition-all duration-1000 -z-0" 
                      style={{ width: `${(currentStageIndex / (stages.length - 1)) * 80}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Assigned Projects */}
              <div className="space-y-4">
                <h3 className="font-bold flex items-center gap-2 px-2">
                  <FileCode className="w-4 h-4 text-accent" />
                  Assigned Stage Projects
                </h3>
                {internship.projects?.length > 0 ? (
                  internship.projects.map((proj: any) => (
                    <Card key={proj.id} className="border-border/50 hover:border-accent/40 transition-colors group">
                      <CardContent className="p-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6 text-accent" />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{proj.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tighter">
                                {proj.status}
                              </Badge>
                              {proj.grade && (
                                <Badge className="bg-green-500/20 text-green-400 border-none text-[10px]">
                                  Grade: {proj.grade}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => { setActiveProject(proj); setChatOpen(true); }}
                            className="bg-accent/5 hover:bg-accent/10 border-accent/20"
                          >
                            <MessageSquare className="w-4 h-4 mr-2 text-accent" />
                            Team Chat
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => { setActiveProject(proj); setProjectDetailsOpen(true); }}
                          >
                            Full Info & Progress
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="p-12 text-center bg-muted/20 border border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground italic">No projects assigned to this stage yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Mentor & Tasks */}
            <div className="space-y-6">
              <Card className="border-border/50 overflow-hidden">
                <div className="h-2 bg-accent" />
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" />
                    Your Mentor
                  </h3>
                  {internship.mentor ? (
                    <>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center ring-4 ring-accent/5">
                          <span className="text-xl font-bold text-accent">
                            {internship.mentor.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{internship.mentor.username}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest">Industry Expert</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button variant="gold" className="w-full shadow-lg shadow-gold/10" onClick={() => setChatOpen(true)}>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Community Chat
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => setBookCallOpen(true)}>
                          <Calendar className="w-4 h-4 mr-2" />
                          Book 1:1 Review
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-14 h-14 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3">
                        <Users className="w-7 h-7 text-muted-foreground/50" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Mentor Assignment Pending</p>
                      <p className="text-xs text-muted-foreground/70">
                        An industry expert will be assigned to guide you soon
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tasks Card */}
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-accent" />
                    My Tasks
                    <Badge variant="outline" className="ml-auto text-[10px]">
                      {internship.tasks?.filter((t: any) => t.status === "completed").length || 0}/{internship.tasks?.length || 0}
                    </Badge>
                  </h3>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {internship.tasks?.map((task: any) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-2 bg-muted/20 rounded border border-border/50"
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            task.status === "completed"
                              ? "bg-green-500 border-green-500"
                              : "border-muted-foreground/30"
                          }`}
                        >
                          {task.status === "completed" && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <span
                          className={`text-sm flex-1 ${
                            task.status === "completed"
                              ? "line-through text-muted-foreground"
                              : "text-foreground font-medium"
                          }`}
                        >
                          {task.title}
                        </span>
                        <Badge variant="outline" className="text-[9px] uppercase opacity-50">
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                    {!internship.tasks?.length && (
                      <div className="py-8 text-center">
                        <FileCode className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground italic">No tasks assigned yet</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Internship Details */}
              <Card className="border-border/50">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold border-b border-border/50 pb-2">Program Details</h3>
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Organization</p>
                      <p>{internship.organization}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Duration</p>
                      <p>{internship.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Award className="w-4 h-4 text-accent" />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Type</p>
                      <p>{internship.type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Existing Dialogs (unchanged but passing real data) */}
      <ApplyInternshipDialog
        open={applyOpen}
        onOpenChange={setApplyOpen}
        onApply={() => {
          toast.success("Enrollment request sent!");
          setApplyOpen(false);
        }}
      />
      {internship?.mentor && (
        <BookCallDialog
          open={bookCallOpen}
          onOpenChange={setBookCallOpen}
          mentorName={internship.mentor.username}
          purpose="internship_review"
        />
      )}
      <TeamChatDialog
        open={chatOpen}
        onOpenChange={setChatOpen}
        projectId={activeProject?.id || ""}
        conversationId={activeProject?.conversationId}
        projectTitle={activeProject?.title || ((internship?.projects && internship?.projects.length > 0) ? internship.projects[0].title : "Internship") + " Discussion"}
        teamMembers={activeProject?.team || []}
      />
      <ProjectDetailsDialog
        open={projectDetailsOpen}
        onOpenChange={setProjectDetailsOpen}
        project={activeProject}
        refetch={refetch}
      />
    </PortalLayout>
  );
}

// Missing icon used
function GraduationCap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function Building2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4c0-.5.2-1 .6-1.4C7 2.2 7.5 2 8 2h8c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v18" />
      <path d="M6 18h12" />
      <path d="M6 14h12" />
      <path d="M6 10h12" />
      <path d="M6 6h12" />
      <path d="M9 22V18h6v4" />
    </svg>
  );
}
