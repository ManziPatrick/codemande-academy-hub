import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_INTERNSHIP_PROGRAMS, GET_MY_STUDENT_PROFILE } from "@/lib/graphql/queries";
import { APPLY_TO_INTERNSHIP_WITH_VALIDATION } from "@/lib/graphql/mutations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Send
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProgramCatalog() {
  const { data, loading, refetch } = useQuery(GET_INTERNSHIP_PROGRAMS);
  const { data: profileData } = useQuery(GET_MY_STUDENT_PROFILE);
  const [applyingTo, setApplyingTo] = useState<any>(null);

  const programs = (data as any)?.internshipPrograms || [];
  const profile = (profileData as any)?.myStudentProfile;

  const [applyToProgram] = useMutation(APPLY_TO_INTERNSHIP_WITH_VALIDATION, {
    onCompleted: () => {
      toast.success("Application submitted successfully! You'll hear back soon.");
      refetch();
      setApplyingTo(null);
    },
    onError: (err) => toast.error(err.message)
  });

  const handleApply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const skills = (formData.get("skills") as string).split(",").map(s => s.trim());

    applyToProgram({
      variables: {
        internshipProgramId: applyingTo.id,
        skills,
        availability: formData.get("availability"),
        portfolioUrl: formData.get("portfolioUrl") || null
      }
    });
  };

  const isDeadlinePassed = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  if (loading) return <div>Loading programs...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.filter((p: any) => p.status === 'active').map((program: any) => {
          const deadlinePassed = isDeadlinePassed(program.applicationDeadline);

          return (
            <Card
              key={program.id}
              className="group overflow-hidden border-border/50 hover:border-accent/40 transition-all hover:shadow-lg"
            >
              <CardHeader className="bg-gradient-to-br from-accent/10 to-accent/5 pb-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                      {program.duration}
                    </Badge>
                    {deadlinePassed && (
                      <Badge variant="secondary" className="bg-muted text-muted-foreground text-[10px]">
                        Closed
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-heading leading-tight">
                    {program.title}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-4">
                <div
                  className="text-sm text-muted-foreground line-clamp-4 min-h-[5.5rem] prose prose-sm dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: program.description }}
                />

                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    <span className="text-muted-foreground">
                      {program.startDate ? new Date(program.startDate).toLocaleDateString() : 'TBD'} - {program.endDate ? new Date(program.endDate).toLocaleDateString() : 'TBD'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="w-3.5 h-3.5 text-accent" />
                    <span className="text-muted-foreground">
                      Apply by: <strong className="text-foreground">{program.applicationDeadline ? new Date(program.applicationDeadline).toLocaleDateString() : 'TBD'}</strong>
                    </span>
                  </div>
                </div>

                {program.eligibility && program.eligibility.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Requirements</p>
                    <div className="flex flex-wrap gap-1">
                      {program.eligibility.map((req: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-muted px-2 py-1 rounded-md text-muted-foreground flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3 text-accent" />
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex gap-2">
                  <Button
                    variant="default"
                    className="w-full gap-2"
                    onClick={() => setApplyingTo(program)}
                    disabled={deadlinePassed}
                  >
                    <Send className="w-4 h-4" />
                    {deadlinePassed ? 'Applications Closed' : 'Apply Now'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Application Dialog */}
      <Dialog open={!!applyingTo} onOpenChange={() => setApplyingTo(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply to {applyingTo?.title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApply} className="space-y-4 py-4">
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-accent" />
                Application Guidelines
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
                <li>Ensure all information is accurate and up-to-date</li>
                <li>List your technical skills honestly</li>
                <li>Portfolio links help strengthen your application</li>
                <li>You'll receive a response within 5 business days</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Technical Skills (comma-separated) *</Label>
              <Input
                id="skills"
                name="skills"
                placeholder="e.g., JavaScript, React, Node.js, Python"
                defaultValue={profile?.skills?.join(", ") || ""}
                required
              />
              <p className="text-xs text-muted-foreground">List all relevant programming languages and frameworks</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="availability">Availability *</Label>
              <Input
                id="availability"
                name="availability"
                placeholder="e.g., Full-time, Part-time (20hrs/week)"
                defaultValue={profile?.availability || ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolioUrl">Portfolio / GitHub URL (Optional)</Label>
              <Input
                id="portfolioUrl"
                name="portfolioUrl"
                type="url"
                placeholder="https://github.com/yourusername"
                defaultValue={profile?.portfolioUrl || ""}
              />
              <p className="text-xs text-muted-foreground">Share your best work to stand out</p>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setApplyingTo(null)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
