import React, { useState } from 'react';
import { useQuery, useMutation } from "@apollo/client/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Users, X, UserPlus, CheckCircle, Trash2, Loader2 } from 'lucide-react';
import { GET_INTERNSHIP_APPLICATIONS, GET_INTERNSHIP_TEAMS } from '@/lib/graphql/queries';
import { ADD_INTERN_TO_TEAM_NEW, REMOVE_INTERN_FROM_TEAM_NEW } from '@/lib/graphql/mutations';

interface ManageTeamMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team: any | null;
}

export function ManageTeamMembersDialog({ open, onOpenChange, team }: ManageTeamMembersDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState("");

  const { data: applicationsData, loading: appsLoading } = useQuery(GET_INTERNSHIP_APPLICATIONS, {
    variables: { programId: team?.internshipProgramId, status: "approved" },
    skip: !open || !team?.internshipProgramId,
    fetchPolicy: 'network-only'
  });

  const [addIntern, { loading: adding }] = useMutation(ADD_INTERN_TO_TEAM_NEW, {
    onCompleted: () => {
      toast.success("Member added to team");
      setSelectedUserId("");
    },
    onError: (err) => toast.error(err.message),
    refetchQueries: [{ query: GET_INTERNSHIP_TEAMS }]
  });

  const [removeIntern, { loading: removing }] = useMutation(REMOVE_INTERN_FROM_TEAM_NEW, {
    onCompleted: () => {
      toast.success("Member removed from team");
    },
    onError: (err) => toast.error(err.message),
    refetchQueries: [{ query: GET_INTERNSHIP_TEAMS }]
  });

  const applications = (applicationsData as any)?.internshipApplications?.items || (applicationsData as any)?.internshipApplications || [];
  const uniqueStudentsMap = new Map();
  applications.forEach((app: any) => {
    if (app.user) uniqueStudentsMap.set(app.user.id, app.user);
  });
  const allApprovedStudents = Array.from(uniqueStudentsMap.values());

  const currentMemberIds = team?.members?.map((m: any) => m.userId) || [];
  const availableStudents = allApprovedStudents.filter((s: any) => !currentMemberIds.includes(s.id));

  const handleAddMember = () => {
    if (!selectedUserId || !team) return;
    addIntern({ variables: { teamId: team.id, userId: selectedUserId, role: 'member' } });
  };

  const handleRemoveMember = (teamMemberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    removeIntern({ variables: { teamMemberId } });
  };

  if (!team) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-[32px] border-border/50 shadow-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-accent/20 via-background to-background p-8 pb-4">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
               <div className="w-10 h-10 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center shadow-premium">
                  <Users className="w-5 h-5" />
               </div>
               <div>
                  <DialogTitle className="text-xl font-black tracking-tight leading-none">Manage Team</DialogTitle>
                  <DialogDescription className="text-xs font-medium mt-1">{team.name}</DialogDescription>
               </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-8 pt-4 space-y-6">
          <div className="space-y-3">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Current Members ({team.members?.length || 0})</h4>
             <div className="bg-muted/10 border border-border/50 rounded-2xl p-2 max-h-[200px] overflow-y-auto">
               {!team.members || team.members.length === 0 ? (
                 <p className="text-xs text-muted-foreground italic text-center p-4">No members assigned yet.</p>
               ) : (
                 team.members.map((m: any) => (
                   <div key={m.id} className="flex flex-row items-center justify-between p-2 rounded-xl hover:bg-muted/20">
                     <div className="flex items-center gap-3">
                       <Avatar className="w-8 h-8 rounded-lg">
                         <AvatarImage src={m.user?.avatar} />
                         <AvatarFallback className="text-[10px]">{m.user?.username?.[0]?.toUpperCase()}</AvatarFallback>
                       </Avatar>
                       <div>
                         <p className="text-sm font-bold">{m.user?.fullName || m.user?.username}</p>
                         <p className="text-[9px] uppercase tracking-widest text-muted-foreground">{m.role}</p>
                       </div>
                     </div>
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                       onClick={() => handleRemoveMember(m.id)}
                       disabled={removing}
                     >
                       <Trash2 className="w-4 h-4" />
                     </Button>
                   </div>
                 ))
               )}
             </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Add New Member</h4>
            <div className="flex gap-2">
              <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={appsLoading || availableStudents.length === 0}>
                <SelectTrigger className="h-12 bg-muted/30 border-border/50 rounded-xl px-4 flex-1">
                  <SelectValue placeholder={
                    appsLoading ? "Loading..." : 
                    availableStudents.length === 0 ? "No more approved students" : "Select student..."
                  } />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/50">
                  {availableStudents.map((s: any) => (
                    <SelectItem key={s.id} value={s.id} className="rounded-lg">
                      {s.fullName || s.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                className="h-12 w-12 rounded-xl bg-accent text-accent-foreground shadow-gold" 
                disabled={!selectedUserId || adding} 
                onClick={handleAddMember}
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
