import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2, User, Calendar, CheckCircle, Clock } from "lucide-react";

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

interface ViewInternshipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  internship: Internship | null;
}

export function ViewInternshipDialog({ open, onOpenChange, internship }: ViewInternshipDialogProps) {
  if (!internship) return null;

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle>Internship Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="space-y-4 py-4">
          <div className="flex items-center gap-4 p-4 bg-background/50 rounded-lg">
            <Avatar className="w-14 h-14">
              <AvatarFallback className="bg-accent/20 text-accent text-lg">
                {getInitials(internship.student)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-card-foreground">{internship.student}</h3>
              <p className="text-sm text-card-foreground/60">{internship.position}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="flex items-center gap-2 text-card-foreground/60 text-xs mb-1">
                <Building2 className="w-4 h-4" />
                Company
              </div>
              <p className="font-medium text-card-foreground">{internship.company}</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="flex items-center gap-2 text-card-foreground/60 text-xs mb-1">
                <User className="w-4 h-4" />
                Mentor
              </div>
              <p className="font-medium text-card-foreground">{internship.mentor}</p>
            </div>
          </div>

          <div className="p-4 bg-background/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-card-foreground/70">Progress</span>
              <span className="font-medium text-accent">{internship.progress}%</span>
            </div>
            <Progress value={internship.progress} className="h-2 mb-2" />
            <div className="flex items-center justify-between text-xs text-card-foreground/60">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {internship.startDate}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {internship.endDate}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <span className="text-sm text-card-foreground/70">Payment Status</span>
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
          </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
