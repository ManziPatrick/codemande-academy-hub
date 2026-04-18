import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import {
  CREATE_INTERNSHIP_SPRINT,
  UPDATE_INTERNSHIP_SPRINT,
  DELETE_INTERNSHIP_SPRINT
} from '@/lib/graphql/mutations';
import { toast } from 'sonner';
import {
  X, Plus, Trash2, Edit, Save, Loader2, Rocket,
  Calendar, ChevronRight, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  planning: { label: 'Planning', color: 'bg-slate-500/10 text-slate-500 border-slate-500/20', icon: Clock },
  active: { label: 'Active', color: 'bg-green-500/10 text-green-600 border-green-500/20', icon: CheckCircle },
  completed: { label: 'Completed', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', icon: Rocket },
};

interface SprintPlanningPanelProps {
  projectId: string;
  teamId: string;
  sprints: any[];
  onClose: () => void;
  onUpdated: () => void;
}

const emptyForm = { title: '', goal: '', startDate: '', endDate: '' };

export function SprintPlanningPanel({
  projectId, teamId, sprints, onClose, onUpdated
}: SprintPlanningPanelProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [editingSprint, setEditingSprint] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

  const [createSprint, { loading: creating }] = useMutation(CREATE_INTERNSHIP_SPRINT, {
    onCompleted: () => {
      toast.success('Sprint created!');
      setShowCreate(false);
      setForm(emptyForm);
      onUpdated();
    },
    onError: e => toast.error(e.message)
  });

  const [updateSprint, { loading: updating }] = useMutation(UPDATE_INTERNSHIP_SPRINT, {
    onCompleted: () => {
      toast.success('Sprint updated');
      setEditingSprint(null);
      onUpdated();
    },
    onError: e => toast.error(e.message)
  });

  const [deleteSprint] = useMutation(DELETE_INTERNSHIP_SPRINT, {
    onCompleted: () => { toast.success('Sprint deleted'); onUpdated(); },
    onError: e => toast.error(e.message)
  });

  const handleCreate = () => {
    if (!form.title || !form.startDate || !form.endDate) {
      toast.error('Title, start date, and end date are required');
      return;
    }
    createSprint({ variables: { projectId, teamId, ...form } });
  };

  const handleUpdate = () => {
    if (!editingSprint) return;
    updateSprint({ variables: { id: editingSprint.id, ...editForm } });
  };

  const startEdit = (sprint: any) => {
    setEditingSprint(sprint);
    setEditForm({
      title: sprint.title,
      goal: sprint.goal || '',
      startDate: sprint.startDate ? sprint.startDate.split('T')[0] : '',
      endDate: sprint.endDate ? sprint.endDate.split('T')[0] : ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="h-full w-full max-w-md bg-background border-l border-border/50 flex flex-col shadow-2xl animate-in slide-in-from-right-full duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-accent/10 text-accent flex items-center justify-center">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black tracking-tight text-lg">Sprint Planner</h2>
              <p className="text-[10px] text-muted-foreground font-medium">{sprints.length} sprint{sprints.length !== 1 ? 's' : ''} total</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl h-9 w-9">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Sprints list */}
          {sprints.length === 0 && !showCreate && (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-muted/30 flex items-center justify-center mx-auto">
                <Rocket className="w-7 h-7 text-muted-foreground/30" />
              </div>
              <p className="font-black text-foreground">No Sprints Yet</p>
              <p className="text-sm text-muted-foreground">Create sprints to organize tasks into time-boxed cycles.</p>
            </div>
          )}

          {sprints.map((sprint: any) => {
            const StatusIcon = STATUS_CONFIG[sprint.status]?.icon || Clock;
            const isEditing = editingSprint?.id === sprint.id;

            return (
              <div key={sprint.id} className="rounded-3xl border border-border/50 bg-muted/5 overflow-hidden">
                {/* Sprint header */}
                <div className="p-5">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} placeholder="Sprint title" className="h-10 bg-background border-border/50 rounded-xl font-bold" />
                      <Input value={editForm.goal} onChange={e => setEditForm({ ...editForm, goal: e.target.value })} placeholder="Sprint goal (optional)" className="h-10 bg-background border-border/50 rounded-xl text-sm" />
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Start Date</Label>
                          <Input type="date" value={editForm.startDate} onChange={e => setEditForm({ ...editForm, startDate: e.target.value })} className="h-9 bg-background border-border/50 rounded-xl text-sm" />
                        </div>
                        <div>
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">End Date</Label>
                          <Input type="date" value={editForm.endDate} onChange={e => setEditForm({ ...editForm, endDate: e.target.value })} className="h-9 bg-background border-border/50 rounded-xl text-sm" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 h-9 rounded-xl font-bold text-xs border-border/50" onClick={() => setEditingSprint(null)}>Cancel</Button>
                        <Button size="sm" className="flex-1 h-9 rounded-xl bg-accent text-accent-foreground font-bold text-xs gap-1.5" onClick={handleUpdate} disabled={updating}>
                          {updating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
                        </Button>
                      </div>

                      {/* Status change inline */}
                      <Select value={sprint.status} onValueChange={v => updateSprint({ variables: { id: sprint.id, status: v } })}>
                        <SelectTrigger className="h-9 bg-muted/30 border-border/50 rounded-xl text-xs font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="planning" className="text-xs font-medium">Planning</SelectItem>
                          <SelectItem value="active" className="text-xs font-medium">Active</SelectItem>
                          <SelectItem value="completed" className="text-xs font-medium">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-black text-base text-foreground">{sprint.title}</p>
                          {sprint.goal && <p className="text-xs text-muted-foreground mt-0.5">{sprint.goal}</p>}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className={`text-[9px] font-black uppercase ${STATUS_CONFIG[sprint.status]?.color}`}>
                            {STATUS_CONFIG[sprint.status]?.label}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                          {new Date(!isNaN(Number(sprint.startDate)) ? Number(sprint.startDate) : sprint.startDate).toLocaleDateString()}
                        </div>
                        <ChevronRight className="w-3 h-3" />
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
                          {new Date(!isNaN(Number(sprint.endDate)) ? Number(sprint.endDate) : sprint.endDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1 h-8 rounded-xl text-[10px] font-black uppercase gap-1.5 border-border/50" onClick={() => startEdit(sprint)}>
                          <Edit className="w-3 h-3" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10" onClick={() => {
                          if (confirm('Delete this sprint? Tasks will remain but lose their sprint assignment.')) {
                            deleteSprint({ variables: { id: sprint.id } });
                          }
                        }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* Create form */}
          {showCreate && (
            <div className="rounded-3xl border border-accent/20 bg-accent/5 p-5 space-y-3">
              <p className="font-black text-sm uppercase tracking-widest text-accent">New Sprint</p>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Sprint title" className="h-10 bg-background border-border/50 rounded-xl font-bold" />
              <Input value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} placeholder="Sprint goal (optional)" className="h-10 bg-background border-border/50 rounded-xl text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">Start Date</Label>
                  <Input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="h-9 bg-background border-border/50 rounded-xl text-sm" />
                </div>
                <div>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1 block">End Date</Label>
                  <Input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="h-9 bg-background border-border/50 rounded-xl text-sm" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 h-9 rounded-xl font-bold text-xs border-border/50" onClick={() => { setShowCreate(false); setForm(emptyForm); }}>Cancel</Button>
                <Button size="sm" className="flex-1 h-9 rounded-xl bg-accent text-accent-foreground font-bold text-xs gap-1.5" onClick={handleCreate} disabled={creating}>
                  {creating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />} Create Sprint
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border/50 shrink-0">
          <Button className="w-full h-12 rounded-2xl bg-accent text-accent-foreground font-black gap-2 shadow-premium" onClick={() => setShowCreate(true)}>
            <Plus className="w-5 h-5" /> New Sprint
          </Button>
        </div>
      </div>
    </div>
  );
}
