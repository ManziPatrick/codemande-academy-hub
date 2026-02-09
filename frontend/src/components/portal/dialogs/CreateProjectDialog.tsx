import { useState } from 'react';
import { useQuery, useMutation } from "@apollo/client/react";
import { CREATE_PROJECT } from '@/lib/graphql/mutations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { GET_ALL_PROJECTS, GET_USERS, GET_COURSES } from '@/lib/graphql/queries';
import { Link as LinkIcon, Plus, Trash2, Book, Box, Layout } from 'lucide-react';

interface CreateProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    refetch?: () => void;
}

export function CreateProjectDialog({ open, onOpenChange, refetch }: CreateProjectDialogProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        course: '',
        type: 'Individual',
        userId: '',
        deadline: '',
    });
    const [toolboxLinks, setToolboxLinks] = useState<{ title: string; url: string }[]>([]);

    const { data: usersData } = useQuery(GET_USERS);
    const { data: projectsData } = useQuery(GET_ALL_PROJECTS);
    const { data: coursesData } = useQuery(GET_COURSES);

    const users = (usersData as any)?.users || [];
    const allProjects = (projectsData as any)?.projects || [];
    const courses = (coursesData as any)?.courses || [];

    const students = users.filter((u: any) => u.role === 'student' || u.role === 'user' || u.role === 'intern');
    const trainers = users.filter((u: any) => u.role === 'trainer' || u.role === 'admin' || u.role === 'super_admin');

    const courseTemplates = formData.course
        ? allProjects.filter((p: any) => p.course === formData.course)
            .filter((p: any, index: number, self: any[]) =>
                index === self.findIndex((t) => t.title === p.title) // Unique by title
            )
        : [];

    const [createProject, { loading }] = useMutation(CREATE_PROJECT, {
        onCompleted: () => {
            toast.success('Project assigned successfully');
            onOpenChange(false);
            refetch?.();
            setFormData({
                title: '',
                description: '',
                course: '',
                type: 'Individual',
                userId: '',
                deadline: '',
            });
            setToolboxLinks([]);
        },
        onError: (err) => toast.error(err.message)
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.userId || !formData.course) {
            toast.error('Title, Student, and Course are required');
            return;
        }

        createProject({
            variables: {
                ...formData,
                mentorIds: trainers.slice(0, 1).map(t => t.id), // Default to first trainer for now
                documentation: {
                    links: toolboxLinks
                }
            }
        });
    };

    const handleAddLink = () => {
        setToolboxLinks([...toolboxLinks, { title: '', url: '' }]);
    };

    const handleRemoveLink = (index: number) => {
        setToolboxLinks(toolboxLinks.filter((_, i) => i !== index));
    };

    const handleLinkChange = (index: number, field: 'title' | 'url', value: string) => {
        const newLinks = [...toolboxLinks];
        newLinks[index][field] = value;
        setToolboxLinks(newLinks);
    };

    const handleSelectTemplate = (templateId: string) => {
        const template = allProjects.find((p: any) => p.id === templateId);
        if (template) {
            setFormData({
                ...formData,
                title: template.title,
                description: template.description
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign New Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="userId">Assign To Student</Label>
                        <Select
                            value={formData.userId}
                            onValueChange={(val) => setFormData({ ...formData, userId: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a student" />
                            </SelectTrigger>
                            <SelectContent>
                                {students.map((s: any) => (
                                    <SelectItem key={s.id} value={s.id}>{s.fullName || s.username} ({s.email})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Project Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Portfolio Website"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Course Name / Context</Label>
                        <Select
                            value={formData.course}
                            onValueChange={(val) => setFormData({ ...formData, course: val })}
                        >
                            <SelectTrigger className="bg-muted/10">
                                <SelectValue placeholder="Select a course context" />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map((c: any) => (
                                    <SelectItem key={c.id} value={c.title}>{c.title}</SelectItem>
                                ))}
                                <SelectItem value="Internship">Internship Program</SelectItem>
                                <SelectItem value="Custom">Other / Custom Context</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {formData.course && courseTemplates.length > 0 && (
                        <div className="space-y-2 p-3 rounded-lg border border-accent/20 bg-accent/5">
                            <Label className="flex items-center gap-2 text-accent">
                                <Layout className="w-3.5 h-3.5" />
                                Project Templates for this Course
                            </Label>
                            <Select onValueChange={handleSelectTemplate}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Choose a project template..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {courseTemplates.map((t: any) => (
                                        <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="type">Project Type</Label>
                        <Select
                            value={formData.type}
                            onValueChange={(val) => setFormData({ ...formData, type: val })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Individual">Individual</SelectItem>
                                <SelectItem value="Team Project">Team Project</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Project goals and requirements..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="deadline">Deadline</Label>
                        <Input
                            id="deadline"
                            type="date"
                            value={formData.deadline}
                            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        />
                    </div>

                    {/* Toolbox Section */}
                    <div className="space-y-3 pt-2 border-t border-border/50">
                        <div className="flex items-center justify-between">
                            <Label className="flex items-center gap-2">
                                <Box className="w-4 h-4 text-accent" />
                                Project Toolbox (Resources)
                            </Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 text-[10px] font-bold uppercase gap-1"
                                onClick={handleAddLink}
                            >
                                <Plus className="w-3 h-3" /> Add Link
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {toolboxLinks.map((link, idx) => (
                                <div key={idx} className="flex gap-2 items-start animate-in slide-in-from-left-2 duration-200">
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            placeholder="Resource Title (e.g. Figma File)"
                                            value={link.title}
                                            onChange={(e) => handleLinkChange(idx, 'title', e.target.value)}
                                            className="h-8 text-xs"
                                        />
                                        <Input
                                            placeholder="URL (https://...)"
                                            value={link.url}
                                            onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                                        onClick={() => handleRemoveLink(idx)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            ))}
                            {toolboxLinks.length === 0 && (
                                <p className="text-[10px] text-muted-foreground italic text-center py-2">
                                    No resources added to this project's toolbox.
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent/90">
                            {loading ? 'Assigning...' : 'Assign Project'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
