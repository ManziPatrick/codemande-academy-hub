import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { UPDATE_PROJECT_WORKFLOW } from '@/lib/graphql/mutations';
import { toast } from 'sonner';
import {
  X, Plus, Trash2, GripVertical, CheckCircle, Clock,
  Zap, Target, Eye, Rocket, Save, Loader2, Info
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STAGE_TYPES = [
  { value: 'todo', label: 'To Do', icon: Clock },
  { value: 'progress', label: 'In Progress', icon: Zap },
  { value: 'testing', label: 'Testing', icon: Target },
  { value: 'review', label: 'In Review', icon: Eye },
  { value: 'done', label: 'Done (Needs Approval)', icon: Clock },
  { value: 'staged', label: 'Staged', icon: Rocket },
  { value: 'completed', label: 'Completed', icon: CheckCircle },
];

const STAGE_COLORS = [
  { value: 'bg-slate-500/10 border-slate-500/20 text-slate-500', label: 'Slate' },
  { value: 'bg-blue-500/10 border-blue-500/20 text-blue-500', label: 'Blue' },
  { value: 'bg-orange-500/10 border-orange-500/20 text-orange-500', label: 'Orange' },
  { value: 'bg-purple-500/10 border-purple-500/20 text-purple-500', label: 'Purple' },
  { value: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600', label: 'Yellow' },
  { value: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-600', label: 'Cyan' },
  { value: 'bg-green-500/10 border-green-500/20 text-green-600', label: 'Green' },
];

interface WorkflowSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  currentWorkflow: any[];
  onUpdated: () => void;
}

export function WorkflowSettingsDialog({
  open, onOpenChange, projectId, currentWorkflow, onUpdated
}: WorkflowSettingsDialogProps) {
  const [stages, setStages] = useState<any[]>(
    currentWorkflow.map(s => ({ ...s, __typename: undefined }))
  );

  const [updateWorkflow, { loading }] = useMutation(UPDATE_PROJECT_WORKFLOW, {
    onCompleted: () => {
      toast.success('Workflow updated successfully');
      onUpdated();
      onOpenChange(false);
    },
    onError: e => toast.error(e.message)
  });

  const handleLevelChange = (index: number, field: string, value: any) => {
    const newStages = [...stages];
    newStages[index][field] = value;
    setStages(newStages);
  };

  const addStage = () => {
    const id = `stage_${Date.now()}`;
    setStages([...stages, {
      id,
      label: 'New Stage',
      color: STAGE_COLORS[0].value,
      order: stages.length,
      type: 'progress'
    }]);
  };

  const removeStage = (index: number) => {
    if (stages.length <= 1) {
      toast.error('Workflow must have at least one stage');
      return;
    }
    const newStages = stages.filter((_, i) => i !== index);
    setStages(newStages.map((s, i) => ({ ...s, order: i })));
  };

  const moveStage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= stages.length) return;
    
    const newStages = [...stages];
    [newStages[index], newStages[newIndex]] = [newStages[newIndex], newStages[index]];
    
    setStages(newStages.map((s, i) => ({ ...s, order: i })));
  };

  const handleSave = () => {
    // Validate: must have at least one stage of each critical type? 
    // Usually project boards are flexible, but we should suggest done/staged for the gate.
    const cleanStages = stages.map(({ id, label, color, order, type }) => ({
      id, label, color, order, type
    }));
    updateWorkflow({ variables: { projectId, workflow: cleanStages } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl border-border/50 max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-black tracking-tight">Project Workflow Board</DialogTitle>
          <DialogDescription>
            Customize the stages (columns) of your project board. Use types to map your custom stages to system rules like the approval gate.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 py-4 space-y-4">
          <div className="p-4 rounded-2xl bg-accent/5 border border-accent/10 flex items-start gap-3">
            <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Why map to a Type?</strong> Some types have special rules. 
              <ul className="list-disc ml-4 mt-1 space-y-1">
                <li><span className="font-bold">Done</span>: Triggers the trainer approval gate.</li>
                <li><span className="font-bold">Staged/Completed</span>: Only trainers can move tasks here.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center gap-3 p-4 rounded-2xl border border-border/50 bg-muted/20">
                <div className="flex flex-col gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveStage(index, 'up')} disabled={index === 0}>
                    <GripVertical className="rotate-90 w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveStage(index, 'down')} disabled={index === stages.length - 1}>
                    <GripVertical className="rotate-90 w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1 grid grid-cols-6 gap-3">
                  <div className="col-span-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground mb-1 block">Column Name</Label>
                    <Input 
                      value={stage.label} 
                      onChange={e => handleLevelChange(index, 'label', e.target.value)}
                      className="h-9 bg-background rounded-xl font-bold"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground mb-1 block">System Type</Label>
                    <Select value={stage.type} onValueChange={v => handleLevelChange(index, 'type', v)}>
                      <SelectTrigger className="h-9 bg-background rounded-xl text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {STAGE_TYPES.map(t => (
                          <SelectItem key={t.value} value={t.value} className="text-xs">{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground mb-1 block">Color</Label>
                    <Select value={stage.color} onValueChange={v => handleLevelChange(index, 'color', v)}>
                      <SelectTrigger className="h-9 bg-background rounded-xl text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {STAGE_COLORS.map(c => (
                          <SelectItem key={c.value} value={c.value} className="text-xs">
                             <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${c.value}`} />
                                {c.label}
                             </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button variant="ghost" size="icon" onClick={() => removeStage(index)} className="rounded-xl text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full h-12 rounded-2xl border-dashed border-accent/40 text-accent font-bold gap-2" onClick={addStage}>
            <Plus className="w-4 h-4" /> Add New Stage
          </Button>
        </div>

        <DialogFooter className="p-8 pt-4 border-t border-border/50">
           <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl">Cancel</Button>
           <Button className="rounded-xl bg-accent text-accent-foreground font-bold gap-2 px-8" onClick={handleSave} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Workflow
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
