import { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Award, Check, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { GET_BADGES } from "@/lib/graphql/queries";
import { AWARD_BADGE } from "@/lib/graphql/mutations";

interface BadgeAwardDialogProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

export function BadgeAwardDialog({ isOpen, onClose, user }: BadgeAwardDialogProps) {
    const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data, loading } = useQuery(GET_BADGES);
    const [awardBadge, { loading: awarding }] = useMutation(AWARD_BADGE, {
        onCompleted: () => {
            toast.success(`Badge awarded to ${user?.username} successfully!`);
            onClose();
        },
        onError: (err) => {
            toast.error(err.message);
        }
    });

    const badges = data?.badges || [];
    const filteredBadges = badges.filter((b: any) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAward = async () => {
        if (!selectedBadgeId) return;
        await awardBadge({
            variables: {
                userId: user.id,
                badgeId: selectedBadgeId
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Award Badge to {user?.username}</DialogTitle>
                </DialogHeader>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search badges..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <ScrollArea className="h-[300px] pr-4">
                    {loading ? (
                        <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
                    ) : filteredBadges.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">No badges found.</div>
                    ) : (
                        <div className="space-y-2">
                            {filteredBadges.map((badge: any) => (
                                <div
                                    key={badge.id}
                                    onClick={() => setSelectedBadgeId(badge.id)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${selectedBadgeId === badge.id
                                        ? "bg-accent/10 border-accent"
                                        : "border-border/50 hover:border-accent/50 hover:bg-muted/50"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedBadgeId === badge.id ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                                            }`}>
                                            <Award className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{badge.title}</p>
                                            <p className="text-xs text-muted-foreground line-clamp-1">{badge.description}</p>
                                        </div>
                                    </div>
                                    {selectedBadgeId === badge.id && <Check className="w-5 h-5 text-accent" />}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleAward} disabled={!selectedBadgeId || awarding} className="bg-accent hover:bg-accent/90">
                        {awarding && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Award Badge
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
