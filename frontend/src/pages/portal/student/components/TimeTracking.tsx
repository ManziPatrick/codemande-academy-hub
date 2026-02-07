import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Clock,
    Plus,
    Calendar as CalendarIcon,
    Trash2,
    CheckCircle2,
    AlertCircle,
    History,
    Timer
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { GET_INTERNSHIP_TIME_LOGS } from "@/lib/graphql/queries";
import { LOG_INTERNSHIP_TIME } from "@/lib/graphql/mutations";
import { motion, AnimatePresence } from "framer-motion";

interface TimeTrackingProps {
    teamId: string;
}

export function TimeTracking({ teamId }: TimeTrackingProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [minutes, setMinutes] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

    const { data, loading, refetch } = useQuery(GET_INTERNSHIP_TIME_LOGS, {
        variables: { teamId },
        skip: !teamId,
    });

    const [logTime, { loading: isLogging }] = useMutation(LOG_INTERNSHIP_TIME, {
        onCompleted: () => {
            toast.success("Time logged successfully!");
            setIsDialogOpen(false);
            setMinutes("");
            setDescription("");
            refetch();
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!minutes || !description || !date) {
            toast.error("Please fill in all fields");
            return;
        }

        logTime({
            variables: {
                teamId,
                minutes: parseInt(minutes),
                description,
                date,
            },
        });
    };

    const logs = data?.internshipTimeLogs || [];
    const totalMinutes = logs.reduce((acc: number, log: any) => acc + log.minutes, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="border-border/50 bg-gradient-to-br from-card to-accent/5">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Time Logged</p>
                                    <h3 className="text-3xl font-bold mt-1">{totalHours} <span className="text-lg font-medium text-muted-foreground">Hours</span></h3>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                                    <Clock className="text-accent" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <Card className="border-border/50">
                        <CardContent className="p-6 h-full flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Session Capacity</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <h3 className="text-2xl font-bold">Active</h3>
                                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                        Ready to track
                                    </Badge>
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Timer className="text-green-500 w-6 h-6" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="md:col-span-2 lg:col-span-1"
                >
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="gold" className="w-full h-full min-h-[100px] text-lg shadow-lg shadow-gold/20 flex flex-col gap-2">
                                <Plus className="w-6 h-6" />
                                Log Daily Activity
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] border-border/50">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-accent" />
                                    Log Your Progress
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Work Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="bg-muted/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="minutes">Minutes Worked</Label>
                                    <Input
                                        id="minutes"
                                        type="number"
                                        placeholder="e.g. 60"
                                        value={minutes}
                                        onChange={(e) => setMinutes(e.target.value)}
                                        className="bg-muted/50"
                                    />
                                    <p className="text-[10px] text-muted-foreground">Tip: Enter time in minutes (60 = 1 hr)</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">What did you work on?</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe your achievements today..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="bg-muted/50 min-h-[100px]"
                                    />
                                </div>
                                <Button type="submit" variant="gold" className="w-full shadow-lg" disabled={isLogging}>
                                    {isLogging ? "Logging..." : "Confirm & Save Log"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </motion.div>
            </div>

            {/* History Table */}
            <Card className="border-border/50">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <History className="w-5 h-5 text-accent" />
                        Activity History
                    </CardTitle>
                    <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20">
                        {logs.length} Total Logs
                    </Badge>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="border-border/50">
                                    <TableHead className="w-[150px]">Date</TableHead>
                                    <TableHead>Activity Description</TableHead>
                                    <TableHead className="text-right">Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="popLayout">
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-24 text-center">
                                                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Fetching records...
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : logs.length > 0 ? (
                                        logs.map((log: any, index: number) => (
                                            <motion.tr
                                                key={log.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="border-border/50 hover:bg-muted/20"
                                            >
                                                <TableCell className="font-medium">
                                                    {format(new Date(log.date), "MMM dd, yyyy")}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {log.description}
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-accent">
                                                    {log.minutes}m
                                                </TableCell>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-32 text-center">
                                                <div className="flex flex-col items-center gap-2 text-muted-foreground opacity-50">
                                                    <AlertCircle className="w-8 h-8" />
                                                    <p>No activity logged yet.</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
