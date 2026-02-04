import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_INTERNSHIP_PROGRAMS } from '@/lib/graphql/queries';
import { UPDATE_INTERNSHIP_PROGRAM_NEW } from '@/lib/graphql/mutations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { CreateInternshipProgramDialog } from '@/components/portal/dialogs';

export default function ProgramList() {
  const [createOpen, setCreateOpen] = useState(false);
  const { data, loading, error, refetch } = useQuery(GET_INTERNSHIP_PROGRAMS);
  
  const [updateProgramStatus] = useMutation(UPDATE_INTERNSHIP_PROGRAM_NEW, {
    onCompleted: () => {
      toast.success('Program status updated');
      refetch();
    },
    onError: (err) => toast.error(err.message)
  });

  if (loading) return <div>Loading programs...</div>;
  if (error) return <div>Error loading programs</div>;

  const programs = (data as any)?.internshipPrograms || [];

  const handleStatusUpdate = (id: string, currentStatus: string) => {
    const statuses = ['active', 'inactive', 'closed'];
    const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];
    
    updateProgramStatus({
      variables: { id, status: nextStatus }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Internship Programs</h2>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Program
        </Button>
      </div>

      <CreateInternshipProgramDialog 
        open={createOpen} 
        onOpenChange={setCreateOpen} 
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {programs.map((program: any) => (
          <Card key={program.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{program.title}</CardTitle>
                  <CardDescription>{program.duration}</CardDescription>
                </div>
                <Badge 
                  variant={program.status === 'active' ? 'default' : 'secondary'}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleStatusUpdate(program.id, program.status)}
                  title="Click to toggle status"
                >
                  {program.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">
                    {program.price === 0 ? 'Free' : `${(program.price || 0).toLocaleString()} ${program.currency || 'RWF'}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Deadline:</span>
                  <span>{program.applicationDeadline ? new Date(program.applicationDeadline).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleStatusUpdate(program.id, program.status)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Update Status
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
