import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ALL_INTERNSHIPS } from '@/lib/graphql/queries';
import { UPDATE_INTERNSHIP_STAGE } from '@/lib/graphql/mutations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { ViewInternshipDialog } from '@/components/portal/dialogs/ViewInternshipDialog';

const STAGES = [
  { id: 1, title: 'Stage 1: Orientation & Onboarding', theme: 'sky' },
  { id: 2, title: 'Stage 2: Foundation Skills Training', theme: 'cyan' },
  { id: 3, title: 'Stage 3: Guided Practical Projects', theme: 'purple' },
  { id: 4, title: 'Stage 4: Industry Internship / Work Simulation', theme: 'amber' },
  { id: 5, title: 'Stage 5: Evaluation & Certification', theme: 'emerald' },
  { id: 6, title: 'Stage 6: Career Transition & Placement Support', theme: 'gold' }
];

const THEMES: Record<string, { bg: string, border: string, text: string, shadow: string, indicator: string }> = {
  sky: { bg: 'bg-sky-500/5', border: 'border-sky-500/20', text: 'text-sky-500', shadow: 'shadow-sky-500/5', indicator: 'bg-sky-500' },
  cyan: { bg: 'bg-cyan-500/5', border: 'border-cyan-500/20', text: 'text-cyan-500', shadow: 'shadow-cyan-500/5', indicator: 'bg-cyan-500' },
  purple: { bg: 'bg-purple-500/5', border: 'border-purple-500/20', text: 'text-purple-500', shadow: 'shadow-purple-500/5', indicator: 'bg-purple-500' },
  amber: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', text: 'text-amber-500', shadow: 'shadow-amber-500/5', indicator: 'bg-amber-500' },
  emerald: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-500', shadow: 'shadow-emerald-500/5', indicator: 'bg-emerald-500' },
  gold: { bg: 'bg-gold/5', border: 'border-gold/20', text: 'text-gold', shadow: 'shadow-gold/5', indicator: 'bg-gold' },
};

export default function WorkflowBoard() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50; // Larger page size for Kanban board usually
  const { data, loading, refetch } = useQuery(GET_ALL_INTERNSHIPS, {
    variables: { page: currentPage, limit: pageSize }
  });
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

  const internships = (data as any)?.internships?.items || [];
  const pagination = (data as any)?.internships?.pagination;

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
    <div className="space-y-6">
      {/* Workflow Summary Report */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAGES.map((stage) => {
          const count = internships.filter((i: any) => 
            i.currentStage === stage.id || 
            (i.stage === stage.title && !i.currentStage) ||
            (!i.currentStage && !i.stage && stage.id === 1)
          ).length;
          const theme = THEMES[stage.theme];
          
          return (
            <Card key={stage.id} className={`border-border/50 ${theme.bg} overflow-hidden group hover:border-accent/30 transition-all duration-300`}>
              <div className={`h-1 w-full ${theme.indicator}`} />
              <CardContent className="p-3">
                <div className="flex flex-col items-center">
                  <span className={`text-lg font-black ${theme.text}`}>{count}</span>
                  <p className="text-[9px] uppercase font-black text-muted-foreground tracking-tighter text-center line-clamp-1">
                    {stage.title.split(': ')[1]}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar h-[calc(100vh-320px)]">
      {STAGES.map((stage) => {
        // Filter interns by fallback logic if currentStage is missing
        const stageInterns = internships.filter((intern: any) =>
          intern.currentStage === stage.id ||
          (intern.stage === stage.title && !intern.currentStage) ||
          (!intern.currentStage && !intern.stage && stage.id === 1) // default to Stage 1
        );

        const theme = THEMES[stage.theme];

        return (
          <div
            key={stage.id}
            className={`flex-shrink-0 w-80 ${theme.bg} border-t-4 ${theme.border} rounded-xl flex flex-col h-full`}
            style={{ borderTopColor: theme.indicator.startsWith('bg-') ? undefined : theme.indicator }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.id, stage.title)}
          >
            <div className="p-4 border-b border-border/50 bg-muted/10 rounded-t-xl flex justify-between items-center">
              <h3 className={`font-bold text-sm tracking-tight ${theme.text}`}>{stage.title}</h3>
              <Badge variant="secondary" className={`${theme.bg} ${theme.text}`}>{stageInterns.length}</Badge>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {stageInterns.map((intern: any) => (
                <Card
                  key={intern.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, intern.id)}
                  onClick={() => { setSelectedInternship(intern); setDialogOpen(true); }}
                  className={`cursor-pointer transition-all duration-300 shadow-sm relative overflow-hidden group border-l-4 ${theme.border} hover:shadow-lg ${theme.shadow}`}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full ${theme.indicator}`} />
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

      {/* Pagination Mini-Controls for Kanban */}
      {pagination && pagination.totalPages > 1 && (
        <div className="fixed bottom-4 right-8 bg-card border border-border/50 p-2 rounded-2xl shadow-xl flex items-center gap-4 z-50">
          <p className="text-[10px] font-black uppercase text-muted-foreground pl-2">
            Page {pagination.currentPage} of {pagination.totalPages}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={!pagination.hasPreviousPage}
              className="h-8 w-8 p-0"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={!pagination.hasNextPage}
              className="h-8 w-8 p-0"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <ViewInternshipDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        internship={selectedInternship}
        showTrainerActions={true}
      />
      </div>
    </div>
  );
}
