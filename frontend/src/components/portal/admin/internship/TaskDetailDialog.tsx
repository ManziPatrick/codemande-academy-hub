import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_INTERNSHIP_TASKS, GET_USERS, GET_INTERNSHIP_ACTIVITY_LOGS } from '@/lib/graphql/queries';
import {
    UPDATE_INTERNSHIP_TASK,
    MOVE_INTERNSHIP_TASK_STATUS,
    ADD_TASK_ATTACHMENT,
    REMOVE_TASK_ATTACHMENT,
    APPROVE_INTERNSHIP_TASK,
    REJECT_INTERNSHIP_TASK,
    ADD_INTERNSHIP_COMMENT
} from '@/lib/graphql/mutations';
import { toast } from 'sonner';
import {
    X, Link2, Image, File, Plus, Trash2, ExternalLink,
    CheckCircle, AlertTriangle, Clock, Zap, Target, Eye,
    Rocket, User, Flag, Calendar, ChevronDown, Save, Loader2,
    MessageSquare, Send, Paperclip, MoreVertical, Trash, Edit2,
    ArrowUpCircle, Activity, History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
    low: { label: 'Low', color: 'text-slate-400', bg: 'bg-slate-400/10', icon: ChevronDown },
    medium: { label: 'Medium', color: 'text-blue-400', bg: 'bg-blue-400/10', icon: Clock },
    high: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-400/10', icon: ArrowUpCircle },
    critical: { label: 'Critical', color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertTriangle },
};

const TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
    task: { label: 'Task', icon: CheckCircle, color: 'text-blue-500' },
    bug: { label: 'Bug', icon: AlertTriangle, color: 'text-destructive' },
    feature: { label: 'Feature', icon: Zap, color: 'text-purple-500' },
    improvement: { label: 'Improvement', icon: Target, color: 'text-emerald-500' },
};

interface TaskDetailDialogProps {
    task: any;
    projectId: string;
    teamId: string;
    isAdminOrTrainer: boolean;
    members: any[];
    sprints: any[];
    workflow?: any[];
    onClose: () => void;
    onUpdated: () => void;
    onApprove?: () => void;
    onReject?: () => void;
}

export function TaskDetailDialog({
    task: initialTask,
    projectId,
    teamId,
    isAdminOrTrainer,
    members,
    sprints,
    workflow = [],
    onClose,
    onUpdated,
    onApprove,
    onReject
}: TaskDetailDialogProps) {
    const [task, setTask] = useState(initialTask);
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDesc, setEditDesc] = useState(task.description || '');
    const [editPriority, setEditPriority] = useState(task.priority || 'medium');
    const [editType, setEditType] = useState(task.taskType || 'task');
    const [editAssignee, setEditAssignee] = useState(task.assigneeId || '');
    const [editSprint, setEditSprint] = useState(task.sprintId || '');
    const [editLabels, setEditLabels] = useState((task.labels || []).join(', '));
    const [comment, setComment] = useState('');
    const [showAddAttach, setShowAddAttach] = useState(false);
    const [attachmentName, setAttachmentName] = useState('');
    const [attachmentUrl, setAttachmentUrl] = useState('');
    const [attachmentType, setAttachmentType] = useState('link');
    const [activeTab, setActiveTab] = useState<'comments' | 'activity'>('comments');

    useEffect(() => {
        setEditTitle(task.title);
        setEditDesc(task.description || '');
        setEditPriority(task.priority || 'medium');
        setEditType(task.taskType || 'task');
        setEditAssignee(task.assigneeId || '');
        setEditSprint(task.sprintId || '');
        setEditLabels((task.labels || []).join(', '));
    }, [task]);

    const { data: activityLogsData, refetch: refetchLogs } = useQuery(GET_INTERNSHIP_ACTIVITY_LOGS, {
        variables: { targetType: 'InternshipTask', targetId: task.id },
        skip: activeTab !== 'activity'
    });
    const activityLogs = (activityLogsData as any)?.internshipActivityLogs || [];

    const [updateTask, { loading: updating }] = useMutation(UPDATE_INTERNSHIP_TASK, {
        onCompleted: data => {
            setTask((data as any).updateInternshipTask);
            setEditing(false);
            onUpdated();
            refetchLogs();
            toast.success('Task updated');
        },
        onError: e => toast.error(e.message)
    });

    const [addTaskAttachment, { loading: addingAttachment }] = useMutation(ADD_TASK_ATTACHMENT, {
        onCompleted: data => {
            setTask({ ...task, attachments: (data as any).addTaskAttachment.attachments });
            setShowAddAttach(false);
            setAttachmentName('');
            setAttachmentUrl('');
            setAttachmentType('link');
            toast.success('Asset tracked successfully');
            onUpdated();
        },
        onError: e => toast.error(e.message)
    });

    const [addComment, { loading: addingComment }] = useMutation(ADD_INTERNSHIP_COMMENT, {
        onCompleted: () => {
            setComment('');
            onUpdated(); // Refetch task to get new comments
            refetchLogs();
        },
        onError: e => toast.error(e.message)
    });

    const handleSave = () => {
        updateTask({
            variables: {
                id: task.id,
                title: editTitle,
                description: editDesc,
                priority: editPriority,
                taskType: editType,
                assigneeId: editAssignee === 'unassigned' ? null : editAssignee,
                sprintId: (!editSprint || editSprint === 'backlog') ? null : editSprint,
                labels: editLabels ? editLabels.split(',').map((l: string) => l.trim()).filter(Boolean) : []
            }
        });
    };

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        addComment({
            variables: {
                taskId: task.id,
                content: comment.trim()
            }
        });
    };

    const currentStatus = workflow.find(s => s.id === task.status);
    const typeInfo = TYPE_CONFIG[task.taskType || 'task'];

    const handleAddAssetSubmit = () => {
        if (!attachmentName.trim() || !attachmentUrl.trim()) {
            toast.error('Name and proper URL link are required');
            return;
        }
        addTaskAttachment({
            variables: {
                taskId: task.id,
                name: attachmentName,
                url: attachmentUrl,
                type: attachmentType
            }
        });
    };

    const priorityInfo = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="h-full w-full max-w-3xl bg-background border-l border-border/50 flex flex-col shadow-2xl animate-in slide-in-from-right-full duration-300 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-border/50 bg-background/80 backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={cn("p-2 rounded-xl bg-muted/20", typeInfo.color)}>
                            <typeInfo.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">TICKET-{task.id?.slice(-4).toUpperCase()}</span>
                                <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-widest px-2", currentStatus?.color)}>
                                    {currentStatus?.label || 'TODO'}
                                </Badge>
                            </div>
                            <h1 className="text-lg font-black tracking-tight leading-none">Task Details</h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isAdminOrTrainer && (
                            !editing ? (
                                <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="h-9 rounded-xl font-bold border-border/50 gap-1.5 px-4 shadow-sm">
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </Button>
                            ) : (
                                <Button size="sm" onClick={handleSave} disabled={updating} className="h-9 rounded-xl bg-accent text-accent-foreground font-bold px-4 shadow-sm gap-1.5 focus:ring-0">
                                    {updating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Changes
                                </Button>
                            )
                        )}
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-9 w-9 rounded-xl hover:bg-muted/50">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Combined Scrollable Area */}
                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                    {/* Left Content (Details) */}
                    <ScrollArea className="flex-1 border-r border-border/40">
                        <div className="p-8 space-y-8">
                            {/* Title Section */}
                            <div className="space-y-4">
                                {editing ? (
                                    <Input
                                        value={editTitle}
                                        onChange={e => setEditTitle(e.target.value)}
                                        className="text-2xl font-black border-0 border-b border-border/50 rounded-none pb-2 px-0 h-auto bg-transparent focus-visible:ring-0 shadow-none"
                                    />
                                ) : (
                                    <h2 className="text-3xl font-black text-foreground tracking-tight leading-tight">{task.title}</h2>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    {task.labels?.map((l: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="bg-accent/5 text-accent border-accent/20 font-black uppercase text-[9px] px-2.5 py-0.5 rounded-full">
                                            {l}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6 bg-muted/5 p-6 rounded-3xl border border-border/40">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Activity className="w-3 h-3" /> Status
                                    </Label>
                                    <Badge className={cn("px-3 py-1 rounded-lg font-bold text-xs border-0", currentStatus?.color)}>
                                        {currentStatus?.label}
                                    </Badge>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Flag className="w-3 h-3" /> Priority
                                    </Label>
                                    {editing ? (
                                        <Select value={editPriority} onValueChange={setEditPriority}>
                                            <SelectTrigger className="h-8 w-32 border-none bg-muted/20 rounded-md text-xs font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="critical" className="text-red-500 font-bold">CRITICAL</SelectItem>
                                                <SelectItem value="high" className="text-orange-500 font-bold">HIGH</SelectItem>
                                                <SelectItem value="medium">MEDIUM</SelectItem>
                                                <SelectItem value="low">LOW</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className={cn("flex items-center gap-1.5 font-bold text-sm", priorityInfo.color)}>
                                            <priorityInfo.icon className="w-4 h-4" />
                                            {priorityInfo.label}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <User className="w-3 h-3" /> Assignee
                                    </Label>
                                    {editing ? (
                                        <Select value={editAssignee || 'unassigned'} onValueChange={setEditAssignee}>
                                            <SelectTrigger className="h-8 border-none bg-muted/20 rounded-md text-xs font-bold">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="unassigned" className="font-bold text-muted-foreground">Unassigned</SelectItem>
                                                {members.map((m: any) => {
                                                    const uId = m.userId || m.id;
                                                    const name = m.user?.fullName || m.user?.username || m.fullName || m.username;
                                                    return (
                                                        <SelectItem key={uId} value={uId} className="font-bold">{name}</SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-6 h-6 border-0 bg-muted">
                                                <AvatarImage src={task.assignee?.avatar} />
                                                <AvatarFallback className="text-[10px] font-black">{task.assignee?.username?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-bold">{task.assignee?.fullName || task.assignee?.username || 'Unassigned'}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Rocket className="w-3 h-3" /> Sprint
                                    </Label>
                                    {editing ? (
                                        <Select value={editSprint || 'backlog'} onValueChange={setEditSprint}>
                                            <SelectTrigger className="h-8 border-none bg-muted/20 rounded-md text-xs font-bold max-w-full">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="backlog" className="font-bold text-muted-foreground">Product Backlog</SelectItem>
                                                {sprints.map((s: any) => {
                                                    const formattedDate = s.startDate && s.endDate
                                                        ? ` (${new Date(Number(s.startDate) || s.startDate).toLocaleDateString()} - ${new Date(Number(s.endDate) || s.endDate).toLocaleDateString()})`
                                                        : '';
                                                    return (
                                                        <SelectItem key={s.id} value={s.id} className="font-bold">
                                                            {s.title}{formattedDate}
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <p className="text-sm font-bold text-foreground/80">
                                            {(() => {
                                                const s = sprints.find(sp => sp.id === task.sprintId);
                                                if (!s) return 'No Active Sprint';
                                                const formattedDate = s.startDate && s.endDate
                                                    ? ` \u2022 ${new Date(Number(s.startDate) || s.startDate).toLocaleDateString()} - ${new Date(Number(s.endDate) || s.endDate).toLocaleDateString()}`
                                                    : '';
                                                return <>{s.title} <span className="opacity-60 font-medium text-xs ml-1">{formattedDate}</span></>;
                                            })()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Description & Specs</Label>
                                    {!editing && (
                                        <Button variant="ghost" size="sm" onClick={() => setEditing(true)} className="h-7 px-3 text-[10px] font-black uppercase text-accent hover:bg-accent/5 gap-1.5">
                                            <Edit2 className="w-3 h-3" /> Edit Overview
                                        </Button>
                                    )}
                                </div>
                                {editing ? (
                                    <div className="rounded-[24px] border border-border/50 overflow-hidden bg-background shadow-inner">
                                        <RichTextEditor
                                            value={editDesc}
                                            onChange={setEditDesc}
                                            placeholder="Define the technical requirements..."
                                        />
                                    </div>
                                ) : (
                                    <div className="p-6 rounded-[24px] border border-border/40 bg-muted/5 min-h-[120px] prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed">
                                        {task.description ? (
                                            <div dangerouslySetInnerHTML={{ __html: task.description }} />
                                        ) : (
                                            <p className="text-muted-foreground italic font-medium">No detailed specification provided for this ticket.</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Attachments */}
                            <div className="space-y-4 pt-4 border-t border-border/40">
                                <div className="flex items-center justify-between">
                                    <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Resources & Assets ({task.attachments?.length || 0})</Label>
                                    <Button onClick={() => setShowAddAttach(!showAddAttach)} variant="outline" size="sm" className={cn("h-7 rounded-lg text-[9px] font-black uppercase gap-1.5 border-border/40 transition-colors", showAddAttach && "bg-accent text-accent-foreground border-accent")}>
                                        {showAddAttach ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />} {showAddAttach ? 'Cancel' : 'New Asset'}
                                    </Button>
                                </div>

                                {showAddAttach && (
                                    <div className="p-4 rounded-2xl border border-border/50 bg-background/50 space-y-3 animate-in slide-in-from-top-2">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] uppercase font-black tracking-widest">Asset Name</Label>
                                                <Input
                                                    placeholder="e.g. Figma Prototype"
                                                    value={attachmentName}
                                                    onChange={e => setAttachmentName(e.target.value)}
                                                    className="h-8 text-xs font-medium"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] uppercase font-black tracking-widest">Asset URL</Label>
                                                <Input
                                                    placeholder="https://..."
                                                    value={attachmentUrl}
                                                    onChange={e => setAttachmentUrl(e.target.value)}
                                                    className="h-8 text-xs font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-end gap-3">
                                            <div className="flex-1 space-y-1.5">
                                                <Label className="text-[10px] uppercase font-black tracking-widest">Type</Label>
                                                <Select value={attachmentType} onValueChange={setAttachmentType}>
                                                    <SelectTrigger className="h-8 text-xs font-medium">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="link">Reference Link</SelectItem>
                                                        <SelectItem value="figma">Figma/Design</SelectItem>
                                                        <SelectItem value="github">GitHub PR/Repo</SelectItem>
                                                        <SelectItem value="document">Document (Google Doc, PDF)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Button onClick={handleAddAssetSubmit} disabled={addingAttachment} size="sm" className="h-8 px-4 font-bold rounded-lg shrink-0">
                                                {addingAttachment ? <Loader2 className="w-3 h-3 animate-spin mr-1.5" /> : <Plus className="w-3 h-3 mr-1.5" />} Add
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {task.attachments?.map((att: any, idx: number) => (
                                        <a key={idx} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-2xl border border-border/40 bg-muted/10 hover:bg-muted/20 transition-all hover:border-accent/40 group">
                                            <div className="w-9 h-9 rounded-xl bg-background border border-border/50 flex items-center justify-center shrink-0 shadow-sm text-accent">
                                                <Link2 className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold truncate group-hover:text-accent transition-colors">{att.name}</p>
                                                <p className="text-[9px] text-muted-foreground truncate uppercase font-black opacity-60">{att.type}</p>
                                            </div>
                                            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-30" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    {/* Right Side (Collaboration) */}
                    <div className="w-full lg:w-[350px] flex flex-col bg-muted/[0.02] border-l border-border/10">
                        <div className="px-6 py-4 border-b border-border/40 flex items-center gap-4 bg-muted/5">
                            <button
                                onClick={() => setActiveTab('comments')}
                                className={cn("text-xs font-black uppercase tracking-widest transition-all relative pb-2 pt-2", activeTab === 'comments' ? "text-accent" : "text-muted-foreground/40")}
                            >
                                Comments
                                {activeTab === 'comments' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full" />}
                            </button>
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={cn("text-xs font-black uppercase tracking-widest transition-all relative pb-2 pt-2", activeTab === 'activity' ? "text-accent" : "text-muted-foreground/40")}
                            >
                                Timeline
                                {activeTab === 'activity' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full" />}
                            </button>
                        </div>

                        <ScrollArea className="flex-1">
                            <div className="p-6 space-y-6">
                                {activeTab === 'comments' ? (
                                    <div className="space-y-6">
                                        {task.comments?.length > 0 ? task.comments.map((c: any) => (
                                            <div key={c.id} className="space-y-2 animate-in fade-in slide-in-from-left-2 transition-all">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="w-5 h-5 border-0">
                                                            <AvatarImage src={c.author?.avatar} />
                                                            <AvatarFallback className="text-[8px] font-black">{c.author?.username?.[0]}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="text-[10px] font-black uppercase text-foreground">{c.author?.username}</span>
                                                    </div>
                                                    <span className="text-[9px] text-muted-foreground/60 font-bold">{formatDistanceToNow(new Date(isNaN(Number(c.createdAt)) ? c.createdAt : Number(c.createdAt)))} ago</span>
                                                </div>
                                                <div className="p-4 rounded-2xl rounded-tl-none bg-muted/10 border border-border/20 text-xs leading-relaxed text-foreground/80">
                                                    {c.content}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-12 space-y-3">
                                                <MessageSquare className="w-8 h-8 text-muted-foreground/20 mx-auto" />
                                                <p className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest">No discussions started.</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-6 py-4">
                                        {activityLogs.length > 0 ? activityLogs.map((log: any) => (
                                            <div key={log.id} className="flex gap-4 relative">
                                                <div className="w-px h-full bg-border absolute left-3 top-6" />
                                                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 z-10 border border-background">
                                                    <History className="w-3 h-3 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1 pb-6">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-[10px] font-black uppercase text-accent">{log.action.replace(/_/g, ' ')}</span>
                                                        <span className="text-[9px] text-muted-foreground/60 font-bold">{formatDistanceToNow(new Date(isNaN(Number(log.createdAt)) ? log.createdAt : Number(log.createdAt)))} ago</span>
                                                    </div>
                                                    <p className="text-xs text-foreground/70 leading-tight">{log.details}</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-12 space-y-3">
                                                <Activity className="w-8 h-8 text-muted-foreground/20 mx-auto" />
                                                <p className="text-[10px] font-black uppercase text-muted-foreground/40 tracking-widest">No history recorded yet.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        <div className="p-4 bg-muted/10 border-t border-border/40">
                            <form onSubmit={handleAddComment} className="relative">
                                <Textarea
                                    placeholder="Add a comment..."
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    className="pr-12 min-h-[80px] text-xs bg-background border-border/40 rounded-2xl resize-none py-3 focus-visible:ring-offset-0 focus-visible:ring-accent/20"
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAddComment(e);
                                        }
                                    }}
                                />
                                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/40 rounded-xl">
                                        <Paperclip className="w-4 h-4" />
                                    </Button>
                                    <Button type="submit" size="icon" disabled={addingComment || !comment.trim()} className="h-8 w-8 bg-accent text-accent-foreground rounded-xl shadow-lg shadow-accent/20">
                                        {addingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </form>
                            <p className="text-[9px] text-muted-foreground/50 mt-2 px-2 font-medium">Press Enter to send, Shift+Enter for new line.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
