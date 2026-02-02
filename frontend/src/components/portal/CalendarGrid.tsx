import { useState, useMemo } from "react";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Video, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: string;
  status: string;
  user?: { username: string };
  mentor?: { username: string };
}

interface CalendarGridProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

export function CalendarGrid({ events, onEventClick }: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), day));
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-2xl">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/50 bg-muted/20">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground capitalize">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
            {events.length} Active Sessions This Month
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="h-9 w-9">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())} className="font-medium">
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-9 w-9">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Weekday Names */}
      <div className="grid grid-cols-7 border-b border-border/30 bg-muted/10">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 border-collapse">
        {days.map((day, idx) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toString()}
              className={`min-h-[140px] p-2 border-r border-b border-border/20 transition-all ${
                !isCurrentMonth ? "bg-muted/5 opacity-30" : "bg-background/20"
              } ${idx % 7 === 6 ? "border-r-0" : ""} hover:bg-muted/10`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                  isToday ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20" : "text-muted-foreground"
                }`}>
                  {format(day, "d")}
                </span>
                {dayEvents.length > 0 && isCurrentMonth && (
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                )}
              </div>

              <div className="space-y-1.5">
                {isCurrentMonth && dayEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className={`w-full text-left p-1.5 rounded border text-[10px] font-medium transition-all hover:scale-[1.02] active:scale-95 group relative ${
                      event.status === 'confirmed' 
                        ? 'bg-accent/10 border-accent/20 text-accent ring-1 ring-accent/10' 
                        : 'bg-muted/30 border-border/30 text-muted-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="truncate max-w-[80%] font-bold uppercase text-[9px] tracking-tight">
                        {event.time}
                      </span>
                      {event.status === 'confirmed' && <Video className="w-2.5 h-2.5 opacity-60" />}
                    </div>
                    <div className="truncate font-heading text-[10px] leading-tight group-hover:underline">
                      {event.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
