import { useQuery } from "@apollo/client/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Clock,
    Activity,
    Users,
    TrendingUp,
    BarChart3,
    Calendar as CalendarIcon,
    Search
} from "lucide-react";
import { format } from "date-fns";
import { GET_INTERNSHIP_TIME_LOGS, GET_INTERNSHIP_ACTIVITY_LOGS } from "@/lib/graphql/queries";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function EngagementDashboard() {
    const [searchTerm, setSearchTerm] = useState("");

    const { data: timeData, loading: timeLoading } = useQuery(GET_INTERNSHIP_TIME_LOGS);
    const { data: activityData, loading: activityLoading } = useQuery(GET_INTERNSHIP_ACTIVITY_LOGS);

    const timeLogs = timeData?.internshipTimeLogs || [];
    const activityLogs = activityData?.internshipActivityLogs || [];

    const totalMinutes = timeLogs.reduce((acc: number, log: any) => acc + log.minutes, 0);
    const totalHours = (totalMinutes / 60).toFixed(0);
    const uniqueStudents = new Set(timeLogs.map((log: any) => log.user?.id)).size;

    const filteredLogs = timeLogs.filter((log: any) =>
        log.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-border/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                                <Clock className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Work Hours</p>
                                <h3 className="text-2xl font-bold">{totalHours}h</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                <Users className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Students</p>
                                <h3 className="text-2xl font-bold">{uniqueStudents}</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                                <Activity className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg Hours / Student</p>
                                <h3 className="text-2xl font-bold">{uniqueStudents > 0 ? (parseInt(totalHours) / uniqueStudents).toFixed(1) : 0}h</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-gold/10 border border-gold/20">
                                <TrendingUp className="w-6 h-6 text-gold" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Logs</p>
                                <h3 className="text-2xl font-bold">{timeLogs.length}</h3>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Time Logs Table */}
                <Card className="lg:col-span-2 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                        <div className="space-y-1">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-accent" />
                                Work Hour Logs
                            </CardTitle>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Filter by student..."
                                className="pl-9 h-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-muted/30">
                                <TableRow className="border-border/50">
                                    <TableHead>Student</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Minutes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {timeLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground italic">
                                            Loading data...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredLogs.length > 0 ? (
                                    filteredLogs.map((log: any) => (
                                        <TableRow key={log.id} className="border-border/50 hover:bg-muted/10 transition-colors">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-[10px] uppercase">
                                                        {log.user?.username?.charAt(0)}
                                                    </div>
                                                    {log.user?.username}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs whitespace-nowrap">
                                                {format(new Date(log.date), "MMM dd, yyyy")}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground max-w-[300px] truncate">
                                                {log.description}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant="outline" className="font-bold text-accent border-accent/20 bg-accent/5">
                                                    {log.minutes}m
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                            No matching logs found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Real-time Activity Stream */}
                <Card className="border-border/50">
                    <CardHeader className="border-b border-border/50 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="w-5 h-5 text-green-500" />
                            Live Activity Feed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[600px] p-4">
                            <div className="space-y-4">
                                {activityLoading ? (
                                    <div className="p-4 text-center text-muted-foreground text-sm italic">Tracking activity...</div>
                                ) : activityLogs.length > 0 ? (
                                    activityLogs.map((activity: any) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            key={activity.id}
                                            className="flex gap-4 items-start p-3 rounded-lg border border-border/40 bg-card hover:bg-muted/20 transition-all group"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-accent/5 flex items-center justify-center shrink-0 border border-border/50 group-hover:bg-accent/10 group-hover:border-accent/20 transition-colors">
                                                <Activity className="w-4 h-4 text-accent/60 group-hover:text-accent" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold">{activity.user?.username}</span>
                                                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter h-4 px-1 leading-none py-0">
                                                        {activity.action}
                                                    </Badge>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground leading-relaxed italic line-clamp-2">
                                                    "{activity.details}"
                                                </p>
                                                <p className="text-[9px] text-muted-foreground/50 flex items-center gap-1 mt-1">
                                                    <CalendarIcon className="w-2.5 h-2.5" />
                                                    {format(new Date(activity.createdAt), "MMM dd, HH:mm")}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center text-muted-foreground text-xs">No activity captured.</div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
