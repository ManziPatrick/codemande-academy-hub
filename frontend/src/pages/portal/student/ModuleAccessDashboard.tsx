import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Lock, Unlock, BadgeCheck, Clock3, XCircle } from 'lucide-react';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { moduleAccessApi } from '@/features/module-access/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const DEMO_COURSE_ID = 'replace-with-real-course-id';

type AssignmentState = 'pending' | 'approved' | 'rejected';

export default function ModuleAccessDashboard() {
  const { user } = useAuth();
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [submissionLink, setSubmissionLink] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['module-progress', user?.id, DEMO_COURSE_ID],
    queryFn: () => moduleAccessApi.getProgress(String(user?.id), DEMO_COURSE_ID),
    enabled: Boolean(user?.id)
  });

  const progress = data?.progress;
  const assignments = data?.assignments || [];

  const moduleStatuses = useMemo(() => {
    return (progress?.unlockedModules || []).map((index: number) => ({
      moduleIndex: index,
      locked: false
    }));
  }, [progress]);

  const completionPercent = useMemo(() => {
    const unlocked = progress?.unlockedModules?.length || 0;
    const current = (progress?.currentModuleIndex || 0) + 1;
    return Math.min(100, Math.round((current / Math.max(1, unlocked || 1)) * 100));
  }, [progress]);

  const assignmentBadge = (status: AssignmentState) => {
    if (status === 'approved') return <Badge className="bg-green-600">Approved</Badge>;
    if (status === 'rejected') return <Badge variant="destructive">Rejected</Badge>;
    return <Badge variant="secondary">Pending</Badge>;
  };

  const submitAssignment = async () => {
    if (!selectedModuleId || !submissionLink.trim()) {
      toast.error('Module and link are required');
      return;
    }

    try {
      await moduleAccessApi.submitAssignment({
        courseId: DEMO_COURSE_ID,
        moduleId: selectedModuleId,
        submissionLink
      });
      toast.success('Submitted. Status changed to Pending Review.');
      setSubmissionLink('');
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Module Access Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={completionPercent} />
            <p className="text-sm text-muted-foreground">Current module: {progress?.currentModuleIndex ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Modules</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-3">
            {isLoading && <p>Loading modules...</p>}
            {!isLoading && moduleStatuses.map((module: any) => (
              <div key={module.moduleIndex} className="p-3 border rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium">Module {module.moduleIndex + 1}</p>
                  <p className="text-xs text-muted-foreground">Strict progression enabled</p>
                </div>
                {module.locked ? <Lock className="w-4 h-4 text-muted-foreground" /> : <Unlock className="w-4 h-4 text-green-600" />}
              </div>
            ))}
            {!isLoading && moduleStatuses.length === 0 && <p className="text-sm text-muted-foreground">No module progress yet.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submit Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input value={selectedModuleId} onChange={(e) => setSelectedModuleId(e.target.value)} placeholder="Module ID" />
            <Input value={submissionLink} onChange={(e) => setSubmissionLink(e.target.value)} placeholder="GitHub link or file URL" />
            <Button onClick={submitAssignment}>Submit (Pending Review)</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignment Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {assignments.map((assignment: any) => (
              <div key={assignment._id} className="flex items-center justify-between border rounded-lg p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Module: {assignment.moduleId}</p>
                  <p className="text-xs text-muted-foreground">Submitted: {new Date(assignment.submittedAt).toLocaleString()}</p>
                  {assignment.feedback && <p className="text-xs text-destructive">Feedback: {assignment.feedback}</p>}
                </div>
                <div className="flex items-center gap-2">
                  {assignment.status === 'approved' && <BadgeCheck className="w-4 h-4 text-green-600" />}
                  {assignment.status === 'pending' && <Clock3 className="w-4 h-4 text-amber-600" />}
                  {assignment.status === 'rejected' && <XCircle className="w-4 h-4 text-red-600" />}
                  {assignmentBadge(assignment.status)}
                </div>
              </div>
            ))}
            {assignments.length === 0 && <p className="text-sm text-muted-foreground">No submissions yet.</p>}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}
