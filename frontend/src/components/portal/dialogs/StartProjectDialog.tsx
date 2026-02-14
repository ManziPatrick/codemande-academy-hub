import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMutation, useQuery } from "@apollo/client/react";
import { REQUEST_PROJECT_START } from "@/lib/graphql/mutations";
import { GET_USERS, GET_MY_PROJECTS } from "@/lib/graphql/queries";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Users, User, AlertCircle } from "lucide-react";

interface StartProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    template: any;
}

export function StartProjectDialog({ open, onOpenChange, template }: StartProjectDialogProps) {
    const [projectType, setProjectType] = useState<"Individual" | "Team Project">("Individual");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    // Fetch users for team selection
    const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);
    const users = (usersData as any)?.users || [];

    const [requestProjectStart, { loading: submitting }] = useMutation(REQUEST_PROJECT_START, {
        refetchQueries: [{ query: GET_MY_PROJECTS }],
        onCompleted: () => {
            toast.success("Project request submitted successfully!");
            onOpenChange(false);
            setSelectedMembers([]);
            setProjectType("Individual");
        },
        onError: (error) => {
            toast.error(`Failed to submit request: ${error.message}`);
        },
    });

    const handleSubmit = () => {
        if (projectType === "Team Project" && selectedMembers.length === 0) {
            toast.error("Please select at least one team member.");
            return;
        }

        requestProjectStart({
            variables: {
                templateId: template.id,
                type: projectType,
                teamMembers: projectType === "Team Project" ? selectedMembers : [],
            },
        });
    };

    const toggleMember = (userId: string) => {
        setSelectedMembers((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    if (!template) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Start Project: {template.title}</DialogTitle>
                    <DialogDescription>
                        You are about to request to start this project.
                        {template.visibility === 'public' ? " Use a public template to build your portfolio." : ""}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-3">
                        <Label>Project Type</Label>
                        <RadioGroup
                            value={projectType}
                            onValueChange={(value) => setProjectType(value as "Individual" | "Team Project")}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <RadioGroupItem value="Individual" id="individual" className="peer sr-only" />
                                <Label
                                    htmlFor="individual"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                                >
                                    <User className="mb-3 h-6 w-6" />
                                    Individual
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="Team Project" id="team" className="peer sr-only" />
                                <Label
                                    htmlFor="team"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                                >
                                    <Users className="mb-3 h-6 w-6" />
                                    Team Project
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {projectType === "Team Project" && (
                        <div className="space-y-3">
                            <Label>Select Team Members</Label>
                            <div className="border rounded-md p-4 bg-muted/20">
                                <ScrollArea className="h-[200px]">
                                    {usersLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {users.filter((u: any) => u.role === 'student').map((user: any) => (
                                                <div key={user.id} className="flex items-center space-x-2 p-2 hover:bg-accent/10 rounded-md transition-colors">
                                                    <Checkbox
                                                        id={user.id}
                                                        checked={selectedMembers.includes(user.id)}
                                                        onCheckedChange={() => toggleMember(user.id)}
                                                    />
                                                    <Label htmlFor={user.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full">
                                                        {user.username} <span className="text-muted-foreground text-xs ml-1">({user.email})</span>
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ScrollArea>
                            </div>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                You will be automatically added as the Team Leader.
                            </p>
                        </div>
                    )}

                    <div className="rounded-md bg-yellow-500/10 p-3 border border-yellow-500/20">
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Your request will be sent to trainers for approval.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Request
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
