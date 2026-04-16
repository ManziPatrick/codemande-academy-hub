import { useState } from 'react';
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_INTERNSHIP_TEAMS } from '@/lib/graphql/queries';
import { ASSIGN_PROJECT_TO_TEAM } from '@/lib/graphql/mutations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Users, Code, CheckCircle, Search, Rocket } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AssignProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  refetch?: () => void;
}

export function AssignProjectDialog({ open, onOpenChange, project, refetch }: AssignProjectDialogProps) {
  const [search, setSearch] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const { data: teamsData, loading: teamsLoading } = useQuery(GET_INTERNSHIP_TEAMS, {
    variables: { 
      programId: project?.internshipProgramId || project?.internshipProgram?.id,
      limit: 100 // Fetch a larger batch for assignment
    },
    skip: !open || !project,
    fetchPolicy: 'network-only'
  });

  const [assignProject, { loading: assigning }] = useMutation(ASSIGN_PROJECT_TO_TEAM, {
    onCompleted: () => {
      toast.success(`Project assigned to team successfully!`);
      onOpenChange(false);
      refetch?.();
    },
    refetchQueries: [{ query: GET_INTERNSHIP_TEAMS, variables: { programId: project?.internshipProgramId || project?.internshipProgram?.id } }],
    onError: (err) => toast.error(err.message)
  });

  const teams = (teamsData as any)?.internshipTeams?.items || [];
  const filteredTeams = teams.filter((t: any) => 
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssign = () => {
    if (!selectedTeamId) return;
    assignProject({
      variables: {
        teamId: selectedTeamId,
        projectId: project.id
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-[32px] border-border/40 shadow-2xl">
        <div className="bg-gradient-to-br from-accent/10 via-background to-background p-8 border-b border-border/40">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-accent text-accent-foreground flex items-center justify-center shadow-lg shadow-accent/20">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight">Deploy Blueprint</DialogTitle>
                <DialogDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">Assigning: {project?.title}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
            <Input 
              placeholder="Search eligible teams..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 pl-11 bg-background border-border/40 rounded-2xl shadow-inner focus-visible:ring-accent/20"
            />
          </div>
        </div>

        <ScrollArea className="max-h-[350px] px-2 py-4">
          <div className="px-6 space-y-3">
            {teamsLoading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Scanning for ready teams...</p>
              </div>
            ) : filteredTeams.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <Users className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">No eligible teams found</p>
                  <p className="text-xs text-muted-foreground px-10">Only teams without an active project assignment in this track are shown.</p>
                </div>
              </div>
            ) : (
              filteredTeams.map((team: any) => (
                <div 
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={cn(
                    "group p-5 rounded-[24px] border-2 transition-all cursor-pointer flex items-center justify-between",
                    selectedTeamId === team.id 
                      ? "bg-accent/5 border-accent shadow-lg shadow-accent/5 scale-[1.02]" 
                      : "bg-muted/5 border-transparent hover:border-border/60 hover:bg-muted/10"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      selectedTeamId === team.id ? "bg-accent text-accent-foreground" : "bg-background border border-border/40 text-muted-foreground group-hover:text-accent"
                    )}>
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-sm tracking-tight">{team.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{team.members?.length || 0} Members</p>
                        {team.internshipProjectId && (
                          <Badge variant="outline" className="h-4 px-1.5 text-[8px] font-black uppercase bg-accent/10 border-accent/20 text-accent">
                            Active: {team.internshipProject?.title || 'Another Project'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  {selectedTeamId === team.id && (
                    <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center animate-in zoom-in-50 duration-300">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-8 bg-muted/20 border-t border-border/40 gap-3">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="h-12 px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAssign}
            disabled={!selectedTeamId || assigning}
            className="h-12 px-8 rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-accent/20 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 min-w-[160px]"
          >
            {assigning ? (
              <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Rocket className="w-4 h-4" /> Initialize Deployment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
