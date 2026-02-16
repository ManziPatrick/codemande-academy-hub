import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Plus, Users, Edit, Trash2, ClipboardList, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { CreateInternshipTeamDialog } from '@/components/portal/dialogs';
import { TextEditor } from '@/components/ui/text-editor';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  GET_INTERNSHIP_TEAMS,
  GET_INTERNSHIP_PROGRAMS
} from '@/lib/graphql/queries';
import {
  CREATE_PROJECT,
  UPDATE_INTERNSHIP_TEAM_NEW
} from '@/lib/graphql/mutations';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function TeamManagement() {
  const [createOpen, setCreateOpen] = useState(false);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const { data: teamsData, loading: teamsLoading, refetch } = useQuery(GET_INTERNSHIP_TEAMS);
  const { data: coursesData } = useQuery(GET_INTERNSHIP_PROGRAMS); // Using internship programs as courses context

  const [newAssignment, setNewAssignment] = useState({
    title: "",
    course: "",
    description: "",
    deadline: "",
    tasks: [{ title: "", completed: false }],
    links: [{ title: "", url: "" }]
  });

  const [createProject, { loading: creatingProject }] = useMutation(CREATE_PROJECT);

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

  const handleGiveAssignment = async () => {
    if (!selectedTeam || !newAssignment.title || !newAssignment.course || !newAssignment.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const studentIds = selectedTeam.members?.map((m: any) => m.userId) || [];

      await createProject({
        variables: {
          title: newAssignment.title,
          course: newAssignment.course,
          type: 'Team Project',
          description: newAssignment.description,
          deadline: newAssignment.deadline || null,
          team: studentIds.map((id: string) => ({ userId: id, role: 'Member' })),
          tasks: newAssignment.tasks.filter(t => t.title.trim() !== ""),
          documentation: {
            links: newAssignment.links.filter(l => l.title.trim() !== "" && l.url.trim() !== "")
          }
        }
      });

      toast.success("Team assignment given successfully");
      setAssignmentOpen(false);
      setNewAssignment({
        title: "",
        course: "",
        description: "",
        deadline: "",
        tasks: [{ title: "", completed: false }],
        links: [{ title: "", url: "" }]
      });
      refetch();
    } catch (error: any) {
      console.error("Error giving team assignment:", error);
      toast.error(error.message || "Failed to give assignment");
    }
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
                <Button
                  variant="gold"
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => {
                    setSelectedTeam(team);
                    setAssignmentOpen(true);
                  }}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  Give Team Assignment
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

      <Dialog open={assignmentOpen} onOpenChange={setAssignmentOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Team Project: {selectedTeam?.name}</DialogTitle>
            <DialogDescription>
              Assign a collaborative project to all members of this team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                placeholder="e.g. E-commerce API Core"
              />
            </div>

            <div className="grid gap-2">
              <Label>Internship Context *</Label>
              <Select
                value={newAssignment.course}
                onValueChange={(val) => setNewAssignment({ ...newAssignment, course: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program..." />
                </SelectTrigger>
                <SelectContent>
                  {(coursesData as any)?.internshipPrograms?.map((p: any) => (
                    <SelectItem key={p.id} value={p.title}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Deadline (Optional)</Label>
              <Input
                type="date"
                value={newAssignment.deadline}
                onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label>Deliverables</Label>
              <div className="space-y-2">
                {newAssignment.tasks.map((task, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Task..."
                      value={task.title}
                      onChange={(e) => {
                        const updated = [...newAssignment.tasks];
                        updated[index].title = e.target.value;
                        setNewAssignment({ ...newAssignment, tasks: updated });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const updated = newAssignment.tasks.filter((_, i) => i !== index);
                        setNewAssignment({ ...newAssignment, tasks: updated.length ? updated : [{ title: "", completed: false }] });
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed"
                  onClick={() => setNewAssignment({ ...newAssignment, tasks: [...newAssignment.tasks, { title: "", completed: false }] })}
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Deliverable
                </Button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Instructions (Markdown/HTML Support)</Label>
              <TextEditor
                value={newAssignment.description}
                onChange={(content) => setNewAssignment({ ...newAssignment, description: content })}
                placeholder="Write detailed project instructions..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignmentOpen(false)}>Cancel</Button>
            <Button variant="gold" onClick={handleGiveAssignment} disabled={creatingProject}>
              {creatingProject ? "Assigning..." : "Assign Team Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
