import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { CREATE_INTERNSHIP_TEAM_NEW } from '@/lib/graphql/mutations';
import { GET_INTERNSHIP_TEAMS, GET_INTERNSHIP_PROGRAMS, GET_INTERNSHIP_PROJECTS_NEW, GET_USERS } from '@/lib/graphql/queries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CreateInternshipTeamDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInternshipTeamDialog({ open, onOpenChange }: CreateInternshipTeamDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    internshipProjectId: '',
    internshipProgramId: '',
    mentorId: ''
  });

  const { data: programsData } = useQuery(GET_INTERNSHIP_PROGRAMS);
  const { data: projectsData } = useQuery(GET_INTERNSHIP_PROJECTS_NEW, {
    variables: { programId: formData.internshipProgramId },
    skip: !formData.internshipProgramId
  });
  const { data: usersData } = useQuery(GET_USERS);

  const mentors = (usersData as any)?.users?.filter((u: any) => ['trainer', 'admin', 'super_admin'].includes(u.role)) || [];
  const programs = (programsData as any)?.internshipPrograms || [];
  const projects = (projectsData as any)?.internshipProjects || [];

  const [createTeam, { loading }] = useMutation(CREATE_INTERNSHIP_TEAM_NEW, {
    refetchQueries: [{ query: GET_INTERNSHIP_TEAMS }],
    onCompleted: () => {
      toast.success('Internship team created successfully');
      onOpenChange(false);
      setFormData({
        name: '',
        internshipProjectId: '',
        internshipProgramId: '',
        mentorId: ''
      });
    },
    onError: (err) => toast.error(err.message)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.internshipProjectId || !formData.internshipProgramId) {
      toast.error('Please fill in all required fields');
      return;
    }
    createTeam({
      variables: formData
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Internship Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Phoenix Squad"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Internship Program</Label>
            <Select 
              value={formData.internshipProgramId} 
              onValueChange={(val) => setFormData({ ...formData, internshipProgramId: val, internshipProjectId: '' })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Assigned Project</Label>
            <Select 
              value={formData.internshipProjectId} 
              disabled={!formData.internshipProgramId}
              onValueChange={(val) => setFormData({ ...formData, internshipProjectId: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.internshipProgramId ? "Select a project" : "First select a program"} />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Mentor (Optional)</Label>
            <Select 
              value={formData.mentorId} 
              onValueChange={(val) => setFormData({ ...formData, mentorId: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a mentor" />
              </SelectTrigger>
              <SelectContent>
                {mentors.map((m: any) => (
                  <SelectItem key={m.id} value={m.id}>{m.fullName || m.username} ({m.role})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent/90">
              {loading ? 'Creating...' : 'Create Team'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
