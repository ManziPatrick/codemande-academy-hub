import { useState } from 'react';
import { useQuery, useMutation } from "@apollo/client/react";
import { CREATE_INTERNSHIP_PROJECT_NEW } from '@/lib/graphql/mutations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { GET_INTERNSHIP_PROJECTS_NEW, GET_INTERNSHIP_PROGRAMS } from '@/lib/graphql/queries';
import { Link as LinkIcon, Plus, Trash2, Code, Users } from 'lucide-react';

interface CreateInternshipProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    refetch?: () => void;
}

export function CreateInternshipProjectDialog({ open, onOpenChange, refetch }: CreateInternshipProjectDialogProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        internshipProgramId: '',
        requiredSkills: '',
        minTeamSize: 1,
        maxTeamSize: 5,
    });
    const [links, setLinks] = useState<{ title: string; url: string }[]>([]);

    const { data: programsData } = useQuery(GET_INTERNSHIP_PROGRAMS);
    const programs = (programsData as any)?.internshipPrograms || [];

    const [createProject, { loading }] = useMutation(CREATE_INTERNSHIP_PROJECT_NEW, {
        onCompleted: () => {
            toast.success('Internship project created successfully');
            onOpenChange(false);
            refetch?.();
            setFormData({
                title: '',
                description: '',
                internshipProgramId: '',
                requiredSkills: '',
                minTeamSize: 1,
                maxTeamSize: 5,
            });
            setLinks([]);
        },
        onError: (err) => toast.error(err.message)
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.internshipProgramId) {
            toast.error('Title and Program are required');
            return;
        }

        createProject({
            variables: {
                ...formData,
                requiredSkills: formData.requiredSkills.split(',').map(s => s.trim()).filter(s => s),
                minTeamSize: parseInt(formData.minTeamSize as any),
                maxTeamSize: parseInt(formData.maxTeamSize as any),
                documentation: {
                    links: links.filter(l => l.title && l.url)
                }
            }
        });
    };

    const handleAddLink = () => {
        setLinks([...links, { title: '', url: '' }]);
    };

    const handleRemoveLink = (index: number) => {
        setLinks(links.filter((_, i) => i !== index));
    };

    const handleLinkChange = (index: number, field: 'title' | 'url', value: string) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        setLinks(newLinks);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-primary" />
                        Create Internship Project
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="program">Internship Program</Label>
                            <Select
                                value={formData.internshipProgramId}
                                onValueChange={(val) => setFormData({ ...formData, internshipProgramId: val })}
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
                            <Label htmlFor="title">Project Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g. E-Commerce Platform API"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Markdown supported)</Label>
                            <Textarea
                                id="description"
                                placeholder="Detailed project overview, requirements, and objectives..."
                                className="min-h-[150px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="skills">Required Skills (comma separated)</Label>
                            <Input
                                id="skills"
                                placeholder="React, Node.js, TypeScript, PostgreSQL"
                                value={formData.requiredSkills}
                                onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="minTeamSize">Min Team Size</Label>
                                <Input
                                    id="minTeamSize"
                                    type="number"
                                    min="1"
                                    value={formData.minTeamSize}
                                    onChange={(e) => setFormData({ ...formData, minTeamSize: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxTeamSize">Max Team Size</Label>
                                <Input
                                    id="maxTeamSize"
                                    type="number"
                                    min="1"
                                    value={formData.maxTeamSize}
                                    onChange={(e) => setFormData({ ...formData, maxTeamSize: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold flex items-center gap-2">
                                <LinkIcon className="w-4 h-4" />
                                External Documentation Links
                            </Label>
                            <Button type="button" variant="outline" size="sm" onClick={handleAddLink} className="h-8 gap-1">
                                <Plus className="w-3 h-3" /> Add Link
                            </Button>
                        </div>

                        {links.length === 0 && (
                            <p className="text-sm text-muted-foreground italic">No external links added yet.</p>
                        )}

                        <div className="space-y-3">
                            {links.map((link, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    <div className="grid grid-cols-2 gap-2 flex-1">
                                        <Input
                                            placeholder="Link Title (e.g. Figma Design)"
                                            value={link.title}
                                            onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                                            className="h-9"
                                        />
                                        <Input
                                            placeholder="URL (https://...)"
                                            value={link.url}
                                            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                            className="h-9"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveLink(index)}
                                        className="h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Project'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
