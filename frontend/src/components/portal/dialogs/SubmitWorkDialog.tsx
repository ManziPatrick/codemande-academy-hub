import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, CheckCircle, Link as LinkIcon } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { SUBMIT_INTERNSHIP_WORK } from "@/lib/graphql/mutations";
import { toast } from "sonner";

interface SubmitWorkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    teamId: string;
    milestoneId?: string;
    milestoneTitle?: string;
}

export function SubmitWorkDialog({ open, onOpenChange, teamId, milestoneId, milestoneTitle }: SubmitWorkDialogProps) {
    const [workUrl, setWorkUrl] = useState("");
    const [description, setDescription] = useState("");

    const [submitWork, { loading }] = useMutation(SUBMIT_INTERNSHIP_WORK, {
        onCompleted: () => {
            toast.success("Work submitted successfully!");
            onOpenChange(false);
            setWorkUrl("");
            setDescription("");
        },
        onError: (err) => {
            toast.error(err.message || "Failed to submit work");
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!workUrl || !description || !milestoneId) {
            toast.error("Please fill in all fields");
            return;
        }

        await submitWork({
            variables: {
                teamId,
                milestoneId,
                workUrl,
                description
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-accent" />
                        Submit Work {milestoneTitle ? `- ${milestoneTitle}` : ""}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="workUrl">Submission URL (GitHub / Demo)</Label>
                        <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="workUrl"
                                className="pl-9"
                                placeholder="https://github.com/..."
                                value={workUrl}
                                onChange={(e) => setWorkUrl(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Submission Notes</Label>
                        <Textarea
                            id="description"
                            placeholder="Describe what you've accomplished..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            required
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="gold"
                            className="flex-1"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Submit Work
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
