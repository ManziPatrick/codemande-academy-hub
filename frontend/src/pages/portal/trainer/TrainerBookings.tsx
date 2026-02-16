import { useState } from "react";
import { motion } from "framer-motion";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_MY_BOOKINGS } from "@/lib/graphql/queries";
// Assuming an update status mutation exists or will be added, otherwise placeholder
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, Check, X, MessageSquare, User } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

// Define Booking interface based on schema
interface Booking {
    id: string;
    date: string;
    time: string;
    status: string; // 'pending', 'confirmed', 'cancelled', 'completed'
    meetingLink?: string;
    topic?: string;
    notes?: string;
    user: {
        id: string;
        username: string;
        fullName: string;
        avatar?: string;
        email: string;
    };
}

export default function TrainerBookings() {
    const { user } = useAuth();
    const { data, loading, error, refetch } = useQuery(GET_MY_BOOKINGS);

    // Placeholder for mutation - implementing UI logic first
    // const [updateBookingStatus] = useMutation(UPDATE_BOOKING_STATUS);

    const handleStatusUpdate = async (id: string, status: string) => {
        // Implement mutation call here
        toast.info(`Updated booking ${id} to ${status} (Functionality pending implementation)`);
        // await updateBookingStatus({ variables: { id, status } });
        // refetch();
    };

    if (!user || user.role !== 'trainer') {
        return (
            <PortalLayout>
                <div className="flex items-center justify-center h-[50vh]">
                    <Alert variant="destructive" className="max-w-md">
                        <AlertTitle>Access Denied</AlertTitle>
                        <AlertDescription>
                            You must be a trainer to view this page.
                        </AlertDescription>
                    </Alert>
                </div>
            </PortalLayout>
        );
    }

    const bookings = (data as any)?.myBookings || [];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed': return <Badge className="bg-green-500">Confirmed</Badge>;
            case 'completed': return <Badge variant="secondary">Completed</Badge>;
            case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>;
            default: return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
        }
    };

    return (
        <PortalLayout>
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="font-heading text-2xl lg:text-3xl font-medium">Mentorship Bookings</h1>
                    <p className="text-muted-foreground mt-1">Manage your upcoming mentorship sessions and requests.</p>
                </motion.div>

                {loading ? (
                    <div className="text-center py-12">Loading bookings...</div>
                ) : error ? (
                    <div className="text-center py-12 text-red-500">Error loading bookings</div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-16 bg-muted/30 rounded-lg border-2 border-dashed">
                        <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No Bookings Found</h3>
                        <p className="text-muted-foreground">You don't have any mentorship sessions scheduled.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {bookings.map((booking: Booking) => (
                            <Card key={booking.id} className="overflow-hidden">
                                <CardHeader className="bg-muted/30 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={booking.user.avatar} />
                                                <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-base">{booking.user.fullName || booking.user.username}</CardTitle>
                                                <CardDescription className="text-xs">{booking.user.email}</CardDescription>
                                            </div>
                                        </div>
                                        {getStatusBadge(booking.status)}
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        <span>{format(new Date(booking.date), 'PPPP')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-muted-foreground" />
                                        <span>{booking.time}</span>
                                    </div>
                                    {booking.meetingLink && (
                                        <div className="flex items-center gap-2 text-sm text-blue-600">
                                            <Video className="w-4 h-4" />
                                            <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                Join Meeting
                                            </a>
                                        </div>
                                    )}
                                    {booking.topic && (
                                        <div className="bg-muted p-2 rounded text-sm mt-2">
                                            <span className="font-semibold block text-xs uppercase text-muted-foreground mb-1">Topic</span>
                                            {booking.topic}
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="flex gap-2 justify-end bg-muted/10 border-t p-3">
                                    {booking.status === 'pending' && (
                                        <>
                                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleStatusUpdate(booking.id, 'cancelled')}>
                                                Reject
                                            </Button>
                                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(booking.id, 'confirmed')}>
                                                Confirm
                                            </Button>
                                        </>
                                    )}
                                    {booking.status === 'confirmed' && (
                                        <Button size="sm" variant="outline" className="w-full" onClick={() => handleStatusUpdate(booking.id, 'completed')}>
                                            Mark as Completed
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </PortalLayout>
    );
}
