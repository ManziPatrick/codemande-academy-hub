import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Video, Loader2, Calendar as CalendarIcon, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { CREATE_INTERNSHIP_MEETING } from "@/lib/graphql/mutations";
import { GET_INTERNSHIP_TEAMS, GET_INTERNSHIP_MEETINGS } from "@/lib/graphql/queries";
import { format } from "date-fns";

interface CreateInternshipMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  programId?: string;
}

const FREQUENCIES = [
  { value: "ONCE", label: "Once" },
  { value: "DAILY", label: "Daily (select days)" },
  { value: "WEEKLY", label: "Weekly (pick a day)" },
  { value: "MONTHLY", label: "Monthly" },
];

const DAYS_OF_WEEK = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

const generateMeetLink = (): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const seg = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `https://meet.google.com/${seg(3)}-${seg(4)}-${seg(3)}`;
};

export function CreateInternshipMeetingDialog({ open, onOpenChange, programId }: CreateInternshipMeetingDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [recurrenceDays, setRecurrenceDays] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "10:00",
    endTime: "11:00",
    meetLink: "",
    type: "ONCE",
  });

  const { data: teamsData, loading: teamsLoading } = useQuery(GET_INTERNSHIP_TEAMS, {
    variables: { programId },
    skip: !open,
  });

  const [createMeeting, { loading: creating }] = useMutation(CREATE_INTERNSHIP_MEETING, {
    onCompleted: () => {
      toast.success("Meeting scheduled successfully!");
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to schedule meeting");
    },
    refetchQueries: [{ query: GET_INTERNSHIP_MEETINGS }],
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
      startTime: "10:00",
      endTime: "11:00",
      meetLink: "",
      type: "ONCE",
    });
    setSelectedTeams([]);
    setRecurrenceDays([]);
  };

  const handleGenerateMeetLink = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setFormData({ ...formData, meetLink: generateMeetLink() });
    setIsGenerating(false);
    toast.success("Google Meet link generated!");
  };

  const toggleTeam = (teamId: string) => {
    setSelectedTeams(prev =>
      prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId]
    );
  };

  const toggleDay = (day: number) => {
    if (formData.type === "WEEKLY") {
      // For weekly, only one day allowed
      setRecurrenceDays([day]);
    } else {
      setRecurrenceDays(prev =>
        prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort((a, b) => a - b)
      );
    }
  };

  const isRecurring = formData.type === "DAILY" || formData.type === "WEEKLY";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (selectedTeams.length === 0) {
      toast.error("Please select at least one team");
      return;
    }
    if (isRecurring && recurrenceDays.length === 0) {
      toast.error(`Please select at least one day for ${formData.type === "WEEKLY" ? "weekly" : "daily"} recurrence`);
      return;
    }

    const startISO = `${formData.date}T${formData.startTime}:00`;
    const endISO = `${formData.date}T${formData.endTime}:00`;

    await createMeeting({
      variables: {
        title: formData.title,
        description: formData.description,
        startTime: startISO,
        endTime: endISO,
        meetLink: formData.meetLink || generateMeetLink(),
        type: formData.type,
        teamIds: selectedTeams,
        recurrenceDays: isRecurring ? recurrenceDays : undefined,
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-gold" />
            Schedule Internship Meeting
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-6 py-6">

              {/* Title */}
              <div className="grid gap-2">
                <Label htmlFor="title">Meeting Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Weekly Sync — Backend Team"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Row: Start Date + Frequency */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">{isRecurring ? "Starts From *" : "Date *"}</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                  {isRecurring && (
                    <p className="text-[10px] text-muted-foreground">Recurs until end of internship</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Frequency</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => {
                      setFormData({ ...formData, type: value });
                      setRecurrenceDays([]);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCIES.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Day-of-Week Selector for DAILY / WEEKLY */}
              {isRecurring && (
                <div className="grid gap-2">
                  <Label>
                    {formData.type === "WEEKLY" ? "Repeat Every *" : "Repeat On (select days) *"}
                  </Label>
                  <div className="flex flex-wrap gap-2 p-3 rounded-xl border bg-muted/20">
                    {DAYS_OF_WEEK.map((day) => {
                      const selected = recurrenceDays.includes(day.value);
                      return (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleDay(day.value)}
                          className={`w-12 h-10 rounded-lg text-xs font-black uppercase tracking-wider transition-all border ${
                            selected
                              ? "bg-gold text-gold-foreground border-gold shadow-sm"
                              : "bg-background text-muted-foreground border-border hover:border-gold/40 hover:text-foreground"
                          }`}
                        >
                          {day.label}
                        </button>
                      );
                    })}
                  </div>
                  {recurrenceDays.length > 0 && (
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3 text-gold" />
                      Repeats every{" "}
                      {recurrenceDays
                        .map((d) => DAYS_OF_WEEK[d].label)
                        .join(", ")}{" "}
                      from {formData.date || "start date"} until internship ends.
                    </p>
                  )}
                </div>
              )}

              {/* Time Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Assign Teams */}
              <div className="grid gap-2">
                <Label>Assign Teams *</Label>
                <div className="border rounded-md p-3 bg-muted/30">
                  {teamsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : ((teamsData as any)?.internshipTeams?.items || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2 text-center">No teams found</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {((teamsData as any)?.internshipTeams?.items || []).map((team: any) => (
                        <div key={team.id} className="flex items-center gap-2">
                          <Checkbox
                            id={`team-${team.id}`}
                            checked={selectedTeams.includes(team.id)}
                            onCheckedChange={() => toggleTeam(team.id)}
                          />
                          <Label
                            htmlFor={`team-${team.id}`}
                            className="text-sm font-normal cursor-pointer truncate"
                          >
                            {team.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Meet Link */}
              <div className="grid gap-2">
                <Label htmlFor="meetLink">Google Meet Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="meetLink"
                    placeholder="https://meet.google.com/..."
                    value={formData.meetLink}
                    onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateMeetLink}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="description">Description / Agenda</Label>
                <Textarea
                  id="description"
                  placeholder="Agenda or notes for the meeting..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="px-6 py-4 border-t gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" disabled={creating}>
              {creating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Schedule Meeting
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
