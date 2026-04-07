import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { SUBMIT_STANDUP } from '@/lib/graphql/mutations';
import { GET_INTERNSHIP_STANDUPS } from '@/lib/graphql/queries';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Calendar, Link as LinkIcon, ListTodo, AlertCircle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DailyStandupProps {
  internshipId: string;
}

export const DailyStandup: React.FC<DailyStandupProps> = ({ internshipId }) => {
  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [blockers, setBlockers] = useState('');
  const [workLink, setWorkLink] = useState('');

  const { data, loading, refetch } = useQuery(GET_INTERNSHIP_STANDUPS, {
    variables: { internshipId }
  });

  const [submitStandup, { loading: submitting }] = useMutation(SUBMIT_STANDUP, {
    onCompleted: () => {
      toast.success("Standup submitted successfully!");
      setYesterday('');
      setToday('');
      setBlockers('');
      setWorkLink('');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yesterday || !today) {
      toast.error("Please fill in what you did yesterday and what you plan to do today.");
      return;
    }
    submitStandup({
      variables: {
        internshipId,
        yesterday,
        today,
        blockers,
        workLink
      }
    });
  };

  return (
    <div className="space-y-8">
      <Card className="border-accent/20 bg-accent/5">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            Submit Daily Standup
          </CardTitle>
          <CardDescription>
            Log your daily progress, attendance, and work references (Figma, GitHub, Behance, etc.).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                <ListTodo className="w-4 h-4 text-accent" /> What did you do yesterday?
              </Label>
              <RichTextEditor value={yesterday} onChange={setYesterday} placeholder="Describe the tasks you completed..." />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                 <ListTodo className="w-4 h-4 text-accent" /> What will you do today?
              </Label>
              <RichTextEditor value={today} onChange={setToday} placeholder="Describe the tasks you will tackle today..." />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-amber-600">
                <AlertCircle className="w-4 h-4" /> Any blockers? (Optional)
              </Label>
              <Input
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
                placeholder="List any issues preventing you from completing your tasks..."
                className="bg-background border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-indigo-600">
                <LinkIcon className="w-4 h-4" /> Daily Work Link (Figma, GitHub, Behance, etc.)
              </Label>
              <Input
                value={workLink}
                onChange={(e) => setWorkLink(e.target.value)}
                placeholder="https://figma.com/..., https://github.com/..., https://behance.net/..."
                type="url"
                className="bg-background border-border/50"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full md:w-auto bg-accent hover:bg-accent/90">
              {submitting ? "Submitting..." : "Submit Standup & Clock In"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-heading">Recent Standups</CardTitle>
          <CardDescription>Your last 5 daily progress reports</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : (data as any)?.getInternshipStandups?.length === 0 ? (
            <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed border-border/50">
              <AlertCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">No standups submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(data as any)?.getInternshipStandups?.slice(0, 5).map((standup: any) => (
                <div key={standup.id} className="p-5 border border-border/50 rounded-xl bg-card hover:border-accent/30 transition-all shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent" />
                      <h4 className="font-bold text-sm">{new Date(Number(standup.date)).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                    </div>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                      {standup.attendanceStatus}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Yesterday</p>
                      <div className="text-sm prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: standup.yesterday }} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Today</p>
                      <div className="text-sm prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: standup.today }} />
                    </div>
                  </div>
                  {(standup.blockers || standup.workLink) && (
                    <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-4">
                      {standup.blockers && (
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/10 px-2 py-1 rounded-md">
                          <AlertCircle className="w-3 h-3" />
                          <span className="font-semibold">Blockers:</span> {standup.blockers}
                        </div>
                      )}
                      {standup.workLink && (
                        <a 
                          href={standup.workLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 text-xs text-accent hover:underline bg-accent/5 px-2 py-1 rounded-md transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="font-semibold">View Daily Work</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyStandup;
