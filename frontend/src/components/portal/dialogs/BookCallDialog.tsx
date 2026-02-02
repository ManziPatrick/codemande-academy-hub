import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video, Calendar, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@apollo/client/react";
import { CREATE_BOOKING } from "@/lib/graphql/mutations";
import { GET_MY_BOOKINGS } from "@/lib/graphql/queries";

interface BookCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mentorName?: string;
  mentorId?: string;
  purpose?: string;
}

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

const callTypes = [
  { value: "mentorship", label: "Mentorship Session" },
  { value: "project-review", label: "Project Review" },
  { value: "career", label: "Career Guidance" },
  { value: "technical", label: "Technical Help" },
];

export function BookCallDialog({ 
  open, 
  onOpenChange, 
  mentorName,
  mentorId,
  purpose 
}: BookCallDialogProps) {
  const [isBooking, setIsBooking] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    callType: purpose || "",
    topic: "",
    notes: "",
  });

  const [createBooking] = useMutation(CREATE_BOOKING, {
    refetchQueries: [{ query: GET_MY_BOOKINGS }],
    onCompleted: () => {
      toast.success("Call booked successfully!");
      setFormData({ date: "", time: "", callType: "", topic: "", notes: "" });
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to book call");
    }
  });

  const handleBook = async () => {
    if (!formData.date || !formData.time || !formData.callType) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsBooking(true);
    try {
      await createBooking({
        variables: {
          mentorId,
          type: formData.callType,
          date: formData.date,
          time: formData.time,
          topic: formData.topic,
          notes: formData.notes
        }
      });
    } finally {
      setIsBooking(false);
    }
  };

  // Generate next 7 days for date options
  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dates.push({
        value: date.toISOString().split('T')[0],
        label: `${dayName}, ${dateStr}`,
      });
    }
    return dates;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5 text-accent" />
            Book a Call
            {mentorName && <span className="text-muted-foreground font-normal">with {mentorName}</span>}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-4 sm:px-6">
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="callType">Call Type *</Label>
              <Select
                value={formData.callType}
                onValueChange={(value) => setFormData({ ...formData, callType: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select call type" />
                </SelectTrigger>
                <SelectContent>
                  {callTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Select
                value={formData.date}
                onValueChange={(value) => setFormData({ ...formData, date: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  {getDateOptions().map((date) => (
                    <SelectItem key={date.value} value={date.value}>
                      {date.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="time">Time *</Label>
              <Select
                value={formData.time}
                onValueChange={(value) => setFormData({ ...formData, time: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="topic">Topic (Optional)</Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="What would you like to discuss?"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional context or preparation needed..."
              rows={3}
              className="mt-1.5"
            />
          </div>

            <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4" />
                <span className="font-medium">Duration: 30 minutes</span>
              </div>
              <p>A Google Meet link will be sent to your email after booking.</p>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-2 p-4 sm:p-6 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="gold" className="flex-1" onClick={handleBook} disabled={isBooking}>
            {isBooking ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Booking...
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4 mr-2" />
                Book Call
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
