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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Video, Loader2, Calendar as CalendarIcon, RefreshCw, Users, ShieldCheck, User as UserIcon, Check } from "lucide-react";
import { toast } from "sonner";
import { CREATE_INTERNSHIP_MEETING } from "@/lib/graphql/mutations";
import { GET_INTERNSHIP_TEAMS, GET_INTERNSHIP_MEETINGS, GET_ALL_STUDENTS, GET_ALL_TRAINERS } from "@/lib/graphql/queries";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedMentors, setSelectedMentors] = useState<string[]>([]);
  const [searchStudents, setSearchStudents] = useState("");
  const [searchMentors, setSearchMentors] = useState("");
  const [recurrenceDays, setRecurrenceDays] = useState<number[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "10:00",
    endTime: "11:00",
    meetLink: "",
    type: "ONCE",
    recurrenceEndDate: "",
  });

  const { data: teamsData, loading: teamsLoading } = useQuery(GET_INTERNSHIP_TEAMS, {
    variables: { programId, limit: 100 },
    skip: !open,
  });

  const { data: studentsData, loading: studentsLoading } = useQuery(GET_ALL_STUDENTS, { skip: !open });
  const { data: mentorsData, loading: mentorsLoading } = useQuery(GET_ALL_TRAINERS, { skip: !open });

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
      recurrenceEndDate: "",
    });
    setSelectedTeams([]);
    setSelectedUsers([]);
    setSelectedMentors([]);
    setRecurrenceDays([]);
    setSearchStudents("");
    setSearchMentors("");
  };

  const toggleSelection = (id: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDayToggle = (day: number) => {
    if (formData.type === "WEEKLY") setRecurrenceDays([day]);
    else setRecurrenceDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (selectedTeams.length === 0 && selectedUsers.length === 0 && selectedMentors.length === 0) {
      toast.error("Please select at least one team or individual attendee");
      return;
    }

    const startISO = `${formData.date}T${formData.startTime}:00`;
    const endISO = `${formData.date}T${formData.endTime}:00`;

    await createMeeting({
      variables: {
        ...formData,
        startTime: startISO,
        endTime: endISO,
        teamIds: selectedTeams,
        userIds: selectedUsers,
        mentorIds: selectedMentors,
        recurrenceDays: formData.type !== "ONCE" ? recurrenceDays : undefined,
        recurrenceEndDate: (formData.type !== "ONCE" && formData.recurrenceEndDate) ? `${formData.recurrenceEndDate}T${formData.endTime}:00` : undefined,
      }
    });
  };

  const filteredStudents = ((studentsData as any)?.getAllStudents || []).filter((s: any) => 
    (s.username || "").toLowerCase().includes(searchStudents.toLowerCase()) || 
    (s.fullName || "").toLowerCase().includes(searchStudents.toLowerCase())
  );

  const filteredMentors = ((mentorsData as any)?.getAllTrainers || []).filter((s: any) => 
    (s.username || "").toLowerCase().includes(searchMentors.toLowerCase()) || 
    (s.fullName || "").toLowerCase().includes(searchMentors.toLowerCase())
  );

  const isRecurring = formData.type === "DAILY" || formData.type === "WEEKLY";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-accent/20">
        <DialogHeader className="px-8 py-6 border-b border-border/10 bg-muted/20">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-accent shadow-gold">
               <CalendarIcon className="w-6 h-6" />
             </div>
             <div>
               <DialogTitle className="text-xl font-black uppercase tracking-tight">Schedule Meeting</DialogTitle>
               <p className="text-xs text-muted-foreground font-medium">Coordinate with teams and individual experts</p>
             </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto h-[calc(90vh-140px)] custom-scrollbar">
            <div className="p-8 space-y-8">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-accent/70">Meeting Title</Label>
                  <Input 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Technical Sync Session"
                    className="h-12 text-base rounded-2xl border-accent/10 focus:border-accent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-accent/70">Date</Label>
                    <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="h-12 rounded-2xl" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-accent/70">Frequency</Label>
                    <Select value={formData.type} onValueChange={v => setFormData({...formData, type: v})}>
                      <SelectTrigger className="h-12 rounded-2xl"><SelectValue /></SelectTrigger>
                      <SelectContent>{FREQUENCIES.map(f => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-accent/70">Start Time</Label>
                    <Input type="time" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="h-12 rounded-2xl" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-accent/70">End Time</Label>
                    <Input type="time" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="h-12 rounded-2xl" />
                  </div>
                </div>

                {isRecurring && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-accent/70">Repeat Until (End Date)</Label>
                      <Input 
                        type="date" 
                        value={formData.recurrenceEndDate} 
                        onChange={e => setFormData({...formData, recurrenceEndDate: e.target.value})} 
                        className="h-12 rounded-2xl border-accent/20" 
                        min={formData.date}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Recurrence Days */}
              {isRecurring && (
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-accent/70">Repeat On</Label>
                  <div className="flex gap-2">
                    {DAYS_OF_WEEK.map(day => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => handleDayToggle(day.value)}
                        className={cn(
                          "w-10 h-10 rounded-xl text-[10px] font-black border transition-all",
                          recurrenceDays.includes(day.value) ? "bg-accent text-accent-foreground border-accent shadow-gold" : "bg-muted/10 border-border/50 hover:border-accent/50"
                        )}
                      >
                        {day.label[0]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignments Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {/* Team Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-accent/70 flex items-center gap-2">
                      <Users className="w-3 h-3" /> Select Teams
                    </Label>
                  </div>
                  <div className="h-[250px] border border-accent/10 rounded-3xl overflow-hidden bg-muted/5 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {teamsLoading ? <Loader2 className="w-4 h-4 animate-spin m-auto mt-20" /> : 
                      ((teamsData as any)?.internshipTeams?.items || []).map((t: any) => (
                        <div key={t.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-accent/5 transition-colors group cursor-pointer" onClick={() => toggleSelection(t.id, setSelectedTeams)}>
                          <div className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0", selectedTeams.includes(t.id) ? "bg-accent border-accent text-accent-foreground" : "border-border/50")}>
                             {selectedTeams.includes(t.id) && <Check className="w-3 h-3" />}
                          </div>
                          <div className="flex-1">
                             <p className="text-xs font-black uppercase tracking-tight leading-none">{t.name}</p>
                             <p className="text-[9px] text-muted-foreground mt-1">{t.type} Group · {t.members?.length || 0} Members</p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

                {/* Trainer/Creator Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-accent/70 flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3 text-gold" /> Select Creators/Trainers
                    </Label>
                    <Badge variant="outline" className="text-[8px] font-black uppercase text-gold border-gold/30">{selectedMentors.length} Selected</Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                      <Input placeholder="Search creators..." value={searchMentors} onChange={e => setSearchMentors(e.target.value)} className="pl-8 h-9 rounded-xl text-xs bg-muted/10 border-none" />
                    </div>
                    <div className="h-[200px] border border-gold/10 rounded-3xl overflow-hidden bg-muted/5 p-3 space-y-1 overflow-y-auto custom-scrollbar">
                      {mentorsLoading ? <Loader2 className="w-4 h-4 animate-spin m-auto mt-10" /> : 
                        filteredMentors.map((m: any) => (
                          <div key={m.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gold/5 transition-colors cursor-pointer" onClick={() => toggleSelection(m.id, setSelectedMentors)}>
                             <div className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0", selectedMentors.includes(m.id) ? "bg-accent border-accent text-accent-foreground" : "border-border/50")}>
                                {selectedMentors.includes(m.id) && <Check className="w-3 h-3" />}
                             </div>
                             <Avatar className="h-6 w-6">
                               <AvatarImage src={m.avatar} />
                               <AvatarFallback className="text-[8px]">{m.username?.[0]}</AvatarFallback>
                             </Avatar>
                             <div className="flex-1 truncate">
                               <p className="text-[10px] font-black uppercase">{m.fullName || m.username}</p>
                               <p className="text-[8px] text-muted-foreground">{m.role}</p>
                             </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Individual Student Selection */}
              <div className="space-y-4 border-t border-border/10 pt-8">
                 <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-accent/70 flex items-center gap-2">
                      <UserIcon className="w-3 h-3" /> Select Individual Users/Students
                    </Label>
                    <Badge variant="outline" className="text-[8px] font-black uppercase">{selectedUsers.length} Selected</Badge>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search users by name or email..." value={searchStudents} onChange={e => setSearchStudents(e.target.value)} className="pl-12 h-12 rounded-2xl bg-muted/10 border-none text-sm" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 h-[200px] overflow-y-auto p-4 border border-accent/10 rounded-3xl bg-muted/5 custom-scrollbar">
                     {studentsLoading ? <Loader2 className="w-4 h-4 animate-spin m-auto" /> : 
                        filteredStudents.map((s: any) => (
                          <div key={s.id} className={cn(
                            "flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer",
                            selectedUsers.includes(s.id) ? "bg-accent/10 border-accent/30" : "bg-card border-border/40 hover:border-accent/20"
                          )} onClick={() => toggleSelection(s.id, setSelectedUsers)}>
                             <Avatar className="h-8 w-8">
                               <AvatarImage src={s.avatar} />
                               <AvatarFallback className="text-xs">{s.username?.[0]}</AvatarFallback>
                             </Avatar>
                             <div className="flex-1 truncate">
                               <p className="text-[10px] font-black uppercase truncate">{s.fullName || s.username}</p>
                               <p className="text-[8px] text-muted-foreground lowercase truncate">{s.email}</p>
                             </div>
                             <div className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0", selectedUsers.includes(s.id) ? "bg-accent border-accent text-accent-foreground" : "border-border/50")}>
                                {selectedUsers.includes(s.id) && <Check className="w-3 h-3" />}
                             </div>
                          </div>
                        ))
                     }
                  </div>
              </div>

              {/* Description & Link */}
              <div className="space-y-4 border-t border-border/10 pt-8">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-accent/70">Google Meet Link</Label>
                  <div className="flex gap-2">
                    <Input value={formData.meetLink} onChange={e => setFormData({...formData, meetLink: e.target.value})} placeholder="https://meet.google.com/..." className="h-12 rounded-2xl flex-1 border-accent/10" />
                    <Button type="button" variant="outline" onClick={async () => {
                        setIsGenerating(true);
                        await new Promise(r => setTimeout(r, 600));
                        setFormData({...formData, meetLink: generateMeetLink()});
                        setIsGenerating(false);
                    }} disabled={isGenerating} className="h-12 w-12 rounded-2xl border-accent/20">
                      {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-accent/70">Agenda / Notes</Label>
                  <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} placeholder="What will be discussed?" className="rounded-2xl border-accent/10" />
                </div>
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className="px-8 py-6 border-t border-border/10 bg-muted/20 gap-3">
          <Button variant="ghost" className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest text-[10px]" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" variant="gold" className="rounded-2xl h-12 px-10 font-black uppercase tracking-widest text-[10px] shadow-gold" onClick={handleSubmit} disabled={creating}>
             {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CalendarIcon className="w-4 h-4 mr-2" />}
             Establish Meeting Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
