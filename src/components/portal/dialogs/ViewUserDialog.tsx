import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Calendar, BookOpen, Shield, GraduationCap, UserCog } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  courses: number;
  joinedAt: string;
}

interface ViewUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSendEmail?: (user: User) => void;
}

export function ViewUserDialog({ open, onOpenChange, user, onSendEmail }: ViewUserDialogProps) {
  if (!user) return null;

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").toUpperCase();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "student": return <GraduationCap className="w-4 h-4" />;
      case "trainer": return <UserCog className="w-4 h-4" />;
      case "admin": return <Shield className="w-4 h-4" />;
      default: return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "student": return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "trainer": return "bg-accent/20 text-accent border-accent/30";
      case "admin": return "bg-purple-500/20 text-purple-400 border-purple-400/30";
      default: return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-accent/20 text-accent text-xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg text-card-foreground">{user.name}</h3>
              <p className="text-card-foreground/60 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-card-foreground/60 mb-1">Role</p>
              <Badge variant="outline" className={getRoleColor(user.role)}>
                {getRoleIcon(user.role)}
                <span className="ml-1 capitalize">{user.role}</span>
              </Badge>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="text-xs text-card-foreground/60 mb-1">Status</p>
              <Badge variant="outline" className={
                user.status === "active"
                  ? "bg-green-500/20 text-green-400 border-green-400/30"
                  : "bg-muted text-muted-foreground"
              }>
                {user.status}
              </Badge>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="flex items-center gap-2 text-card-foreground/60 text-xs mb-1">
                <BookOpen className="w-3 h-3" />
                Courses
              </div>
              <p className="font-semibold text-card-foreground">{user.courses}</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <div className="flex items-center gap-2 text-card-foreground/60 text-xs mb-1">
                <Calendar className="w-3 h-3" />
                Joined
              </div>
              <p className="font-semibold text-card-foreground">{user.joinedAt}</p>
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
