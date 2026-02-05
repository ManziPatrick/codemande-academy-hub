import { useState } from 'react';
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_INTERNSHIP_TEAMS, GET_INTERNSHIP_PROGRAMS } from '@/lib/graphql/queries';
import { UPDATE_INTERNSHIP_TEAM_NEW } from '@/lib/graphql/mutations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { CreateInternshipTeamDialog } from '@/components/portal/dialogs';

export default function TeamManagement() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data: teamsData, loading: teamsLoading, refetch } = useQuery(GET_INTERNSHIP_TEAMS);
  
  const [updateTeamStatus] = useMutation(UPDATE_INTERNSHIP_TEAM_NEW, {
    onCompleted: () => {
      toast.success('Team status updated');
      refetch();
    },
    onError: (err) => toast.error(err.message)
  });

  if (teamsLoading) return <div>Loading teams...</div>;

  const teams = (teamsData as any)?.internshipTeams || [];

  const handleStatusUpdate = (id: string, currentStatus: string) => {
    const statuses = ['active', 'completed', 'on_hold'];
    const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];
    
    updateTeamStatus({
      variables: { id, status: nextStatus }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Team Management</h2>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </div>

      <CreateInternshipTeamDialog 
        open={createOpen} 
        onOpenChange={setCreateOpen} 
      />

      <div className="grid gap-6 md:grid-cols-2">
        {teams.map((team: any) => (
          <Card key={team.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  {team.name}
                </CardTitle>
                <Badge 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleStatusUpdate(team.id, team.status)}
                  title="Click to toggle status"
                >
                  {team.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Project: {team.internshipProject?.title || 'Unassigned'}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full gap-2"
                  onClick={() => handleStatusUpdate(team.id, team.status)}
                >
                  <Edit className="w-3.5 h-3.5" />
                  Update Team Status
                </Button>
                <div>
                  <h4 className="text-sm font-medium mb-2">Mentor</h4>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={team.mentor?.avatar} />
                      <AvatarFallback>M</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{team.mentor?.fullName || 'Unassigned'}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Members ({team.members?.length || 0})</h4>
                  <div className="flex flex-wrap gap-2">
                    {team.members?.map((member: any) => (
                      <div key={member.id} className="flex items-center gap-2 bg-muted p-1 px-2 rounded-full text-xs">
                         <Avatar className="w-4 h-4">
                           <AvatarFallback>{member.user?.username[0]}</AvatarFallback>
                         </Avatar>
                         {member.user?.username}
                      </div>
                    ))}
                    {(!team.members || team.members.length === 0) && <span className="text-sm text-muted-foreground">No members</span>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
