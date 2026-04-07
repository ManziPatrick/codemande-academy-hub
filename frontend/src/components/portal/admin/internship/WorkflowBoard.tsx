import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ALL_INTERNSHIPS } from '@/lib/graphql/queries';
import { UPDATE_INTERNSHIP_STAGE } from '@/lib/graphql/mutations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { ViewInternshipDialog } from '@/components/portal/dialogs/ViewInternshipDialog';

const STAGES = [
  { id: 1, title: 'Stage 1: Orientation & Onboarding' },
  { id: 2, title: 'Stage 2: Foundation Skills Training' },
  { id: 3, title: 'Stage 3: Guided Practical Projects' },
  { id: 4, title: 'Stage 4: Industry Internship / Work Simulation' },
  { id: 5, title: 'Stage 5: Evaluation & Certification' },
  { id: 6, title: 'Stage 6: Career Transition & Placement Support' }
];

export default function WorkflowBoard() {
  const { data, loading, refetch } = useQuery(GET_ALL_INTERNSHIPS);
  const [updateStage] = useMutation(UPDATE_INTERNSHIP_STAGE, {
    onCompleted: () => {
      toast.success('Internship stage updated successfully');
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to update stage: ' + err.message);
    }
  });

  const [draggedInternshipId, setDraggedInternshipId] = useState<string | null>(null);
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  const internships = (data as any)?.internships || [];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedInternshipId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stageId: number, stageTitle: string) => {
    e.preventDefault();
    if (!draggedInternshipId) return;

    // Check if the internship is already in this stage
    const intern = internships.find((i: any) => i.id === draggedInternshipId);
    if (!intern || intern.currentStage === stageId) {
      setDraggedInternshipId(null);
      return;
    }

    updateStage({
      variables: {
        id: draggedInternshipId,
        currentStage: stageId,
        stage: stageTitle
      }
    });
    setDraggedInternshipId(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar h-[calc(100vh-250px)]">
      {STAGES.map((stage) => {
        // Filter interns by fallback logic if currentStage is missing
        const stageInterns = internships.filter((intern: any) =>
          intern.currentStage === stage.id ||
          (intern.stage === stage.title && !intern.currentStage) ||
          (!intern.currentStage && !intern.stage && stage.id === 1) // default to Stage 1
        );

        return (
          <div
            key={stage.id}
            className="flex-shrink-0 w-80 bg-muted/20 border border-border/50 rounded-xl flex flex-col h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id, stage.title)}
          >
            <div className="p-4 border-b border-border/50 bg-muted/10 rounded-t-xl flex justify-between items-center">
              <h3 className="font-bold text-sm tracking-tight">{stage.title}</h3>
              <Badge variant="secondary">{stageInterns.length}</Badge>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {stageInterns.map((intern: any) => (
                <Card
                  key={intern.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, intern.id)}
                  onClick={() => { setSelectedInternship(intern); setDialogOpen(true); }}
                  className="cursor-pointer hover:border-accent/50 transition-colors shadow-sm"
                >
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 ring-2 ring-accent/10">
                        <AvatarFallback className="text-xs uppercase bg-accent/20 text-accent font-bold">
                          {intern.user?.username?.substring(0, 2) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{intern.user?.username}</p>
                        <p className="text-xs text-muted-foreground truncate">{intern.title}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {intern.type}
                      </Badge>
                      <span className="text-accent font-bold">{intern.progress || 0}%</span>
                    </div>

                    {/* Visual indicator of tasks completion could go here */}
                    {intern.tasks && intern.tasks.length > 0 && (
                      <div className="text-[10px] text-muted-foreground">
                        Tasks: {intern.tasks.filter((t: any) => t.status === 'completed').length}/{intern.tasks.length}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {stageInterns.length === 0 && (
                <div className="h-24 flex items-center justify-center text-muted-foreground text-xs border-2 border-dashed border-border/40 rounded-lg">
                  Drop here
                </div>
              )}
            </div>
          </div>
        );
      })}

      <ViewInternshipDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        internship={selectedInternship}
        showTrainerActions={true}
      />
    </div>
  );
}
