import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Calendar, BookOpen, Shield, GraduationCap, UserCog } from "lucide-react";

interface ViewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any | null;
  onSendEmail?: (user: any) => void;
}

export function ViewUserDialog({ open, onOpenChange, user, onSendEmail }: ViewUserDialogProps) {
  if (!user) return null;

  const getInitials = (name: string) => (name || "").split(" ").map(n => n[0]).join("").toUpperCase();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student": return <GraduationCap className="w-4 h-4" />;
      case "trainer": return <UserCog className="w-4 h-4" />;
      case "admin": return <Shield className="w-4 h-4" />;
      case "super_admin": return <Shield className="w-4 h-4" />;
      default: return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student": return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "trainer": return "bg-accent/20 text-accent border-accent/30";
      case "admin": return "bg-purple-500/20 text-purple-400 border-purple-400/30";
      case "super_admin": return "bg-red-500/20 text-red-400 border-red-400/30";
      default: return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-4 pb-4 sm:px-6 sm:pb-6 overflow-y-auto">
          <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-accent/20 text-accent text-xl">
                {getInitials(user.username)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-card-foreground">{user.username}</h3>
              <p className="text-card-foreground/60 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-card-foreground/60 mb-1">Role</p>
              <Badge variant="outline" className={getRoleColor(user.role)}>
                {getRoleIcon(user.role)}
                <span className="ml-1 capitalize">{user.role?.replace('_', ' ')}</span>
              </Badge>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-card-foreground/60 mb-1">Status</p>
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-400/30">
                active
              </Badge>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="flex items-center gap-2 text-card-foreground/60 text-xs mb-1">
                <BookOpen className="w-3 h-3" />
                Courses
              </div>
              <p className="font-semibold text-card-foreground">0</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="flex items-center gap-2 text-card-foreground/60 text-xs mb-1">
                <Calendar className="w-3 h-3" />
                Joined
              </div>
              <p className="font-semibold text-card-foreground">Recently</p>
            </div>
          </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onSendEmail?.(user)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email
            </Button>

            <div className="space-y-2 pt-2 border-t border-border/50">
              <h4 className="text-sm font-medium text-card-foreground">Recent Activity</h4>
              <div className="space-y-1">
                {(user.activityLog || []).slice().reverse().slice(0, 5).map((log: any, i: number) => (
                  <div key={i} className="flex flex-col p-2 bg-background/30 rounded-md gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-card-foreground font-medium capitalize">{log.action.replace('_', ' ')}</span>
                      <span className="text-card-foreground/40">
                        {log.timestamp ? new Date(parseInt(log.timestamp) || log.timestamp).toLocaleTimeString() : 'Recently'}
                      </span>
                    </div>
                    {log.details && (
                      <p className="text-[10px] text-card-foreground/60 truncate">{log.details}</p>
                    )}
                  </div>
                ))}
                {(!user.activityLog || user.activityLog.length === 0) && (
                  <p className="text-xs text-card-foreground/40 italic">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
