import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_INTERNSHIP_SUBMISSIONS } from "@/lib/graphql/queries";
import { REVIEW_INTERNSHIP_SUBMISSION_NEW } from "@/lib/graphql/mutations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    CheckCircle, 
    Clock, 
    AlertCircle, 
    ExternalLink, 
    MessageSquare, 
    User, 
    FileText,
    Loader2,
    RefreshCw,
    Search
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function InternshipSubmissionReview() {
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [reviewStatus, setReviewStatus] = useState("approved");
    const [feedback, setFeedback] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const { data, loading, refetch } = useQuery(GET_INTERNSHIP_SUBMISSIONS, {
        fetchPolicy: "network-only"
    });

    const [reviewSubmission, { loading: reviewing }] = useMutation(REVIEW_INTERNSHIP_SUBMISSION_NEW, {
        onCompleted: () => {
            toast.success("Submission reviewed successfully!");
            setSelectedSubmission(null);
            setFeedback("");
            refetch();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to review submission");
        }
    });

    const handleReview = async () => {
        if (!selectedSubmission) return;
        await reviewSubmission({
            variables: {
                id: selectedSubmission.id,
                status: reviewStatus,
                feedback
            }
        });
    };

    const submissions = (data as any)?.internshipSubmissions || [];
    
    const filteredSubmissions = submissions.filter((s: any) => 
        (s.user?.fullName || s.user?.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.milestone?.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case 'revision_requested': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved': return <CheckCircle className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'rejected': return <AlertCircle className="w-4 h-4" />;
            case 'revision_requested': return <RefreshCw className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by student name or milestone..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-muted/20 border-border/50 rounded-xl"
                    />
                </div>
                <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-2 rounded-xl border-accent/20">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </Button>
            </div>

            {/* List */}
            <ScrollArea className="h-[calc(100vh-300px)] custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
                    {filteredSubmissions.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-muted/5 rounded-3xl border border-dashed border-border/50">
                            <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-muted-foreground">No submissions found</p>
                        </div>
                    ) : (
                        filteredSubmissions.map((submission: any) => (
                            <Card 
                                key={submission.id} 
                                className="group relative overflow-hidden bg-background/50 backdrop-blur-sm border-border/20 hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5 transition-all duration-500 cursor-pointer rounded-3xl"
                                onClick={() => {
                                    setSelectedSubmission(submission);
                                    setReviewStatus(submission.status === 'pending' ? 'approved' : submission.status);
                                    setFeedback(submission.feedback || "");
                                }}
                            >
                                <div className="absolute top-0 right-0 p-4">
                                    <Badge variant="outline" className={cn("text-[10px] font-black uppercase tracking-widest", getStatusColor(submission.status))}>
                                        {getStatusIcon(submission.status)}
                                        <span className="ml-1">{submission.status}</span>
                                    </Badge>
                                </div>
                                <CardHeader className="pt-8 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shadow-gold/10">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-sm font-black uppercase tracking-tight truncate">
                                                {submission.user?.fullName || submission.user?.username || "Unknown Student"}
                                            </CardTitle>
                                            <CardDescription className="text-[10px] uppercase font-bold text-accent/70">
                                                {submission.milestone?.title || "Project Milestone"}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-3 rounded-2xl bg-muted/20 border border-border/10">
                                        <p className="text-xs text-muted-foreground line-clamp-2 italic">
                                            "{submission.description || "No description provided"}"
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium border-t border-border/10 pt-4">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3 text-gold" />
                                            {format(new Date(!isNaN(Number(submission.createdAt)) ? Number(submission.createdAt) : submission.createdAt), "MMM dd, yyyy")}
                                        </div>
                                        <div className="text-gold uppercase font-black cursor-pointer hover:underline flex items-center gap-1">
                                            Review Work <RefreshCw className="w-3 h-3" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </ScrollArea>

            {/* Review Dialog */}
            <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
                <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border-accent/20 rounded-3xl p-0 overflow-hidden">
                    <DialogHeader className="p-8 border-b border-border/10 bg-muted/20">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent shadow-gold">
                                <FileText className="w-7 h-7" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-black uppercase tracking-tight">Review Work</DialogTitle>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline" className="text-[10px] bg-accent/10 text-accent border-accent/20">
                                        MILESTONE: {selectedSubmission?.milestone?.title}
                                    </Badge>
                                    <Badge variant="outline" className="text-[10px]">
                                        STUDENT: {selectedSubmission?.user?.username}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-accent/70">Submission Link</label>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-accent/10">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <ExternalLink className="w-5 h-5 text-accent shrink-0" />
                                        <span className="text-sm font-medium truncate font-mono text-muted-foreground">{selectedSubmission?.workUrl}</span>
                                    </div>
                                    <a 
                                        href={selectedSubmission?.workUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="shrink-0 ml-4 px-4 py-2 bg-accent text-accent-foreground text-[10px] font-black uppercase rounded-xl shadow-gold hover:opacity-90 transition-all flex items-center gap-2"
                                    >
                                        Inspect <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-accent/70">Student Description</label>
                                <div className="p-5 rounded-2xl bg-muted/10 border border-border/10">
                                    <p className="text-sm leading-relaxed text-foreground/80">{selectedSubmission?.description || "No notes provided by student."}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="grid gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-accent/70">Decision</label>
                                    <Select value={reviewStatus} onValueChange={setReviewStatus}>
                                        <SelectTrigger className="h-12 rounded-2xl border-accent/10 bg-muted/5 font-bold">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="approved">Approve & Complete</SelectItem>
                                            <SelectItem value="revision_requested">Request Revision</SelectItem>
                                            <SelectItem value="rejected">Reject Submission</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-accent/70">Current Status</label>
                                    <div className="h-12 flex items-center px-4 rounded-2xl bg-muted/5 border border-border/10">
                                         <Badge className={cn("text-[9px] font-black uppercase", getStatusColor(selectedSubmission?.status || ""))}>
                                            {selectedSubmission?.status}
                                         </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-accent/70 flex items-center gap-2">
                                    <MessageSquare className="w-3 h-3" /> Feedback & Directions
                                </label>
                                <Textarea 
                                    placeholder="Provide detailed feedback to help the student improve or confirm their success..." 
                                    className="min-h-[120px] rounded-2xl border-accent/10 bg-muted/5 p-4 text-sm"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="p-8 border-t border-border/10 bg-muted/20">
                        <Button 
                            variant="ghost" 
                            className="h-12 rounded-2xl px-8 font-black uppercase tracking-widest text-[10px]"
                            onClick={() => setSelectedSubmission(null)}
                        >
                            Back to List
                        </Button>
                        <Button 
                            variant="gold" 
                            className="h-12 rounded-2xl px-12 font-black uppercase tracking-widest text-[10px] shadow-gold-sm"
                            disabled={reviewing}
                            onClick={handleReview}
                        >
                            {reviewing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                            Publish Review
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
