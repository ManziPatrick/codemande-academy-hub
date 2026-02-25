import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PortalLayout } from '@/components/portal/PortalLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { moduleAccessApi } from '@/features/module-access/api';
import { toast } from 'sonner';

export default function TrainerModuleReviewPanel() {
  const [feedbackById, setFeedbackById] = useState<Record<string, string>>({});
  const [scoreById, setScoreById] = useState<Record<string, number>>({});

  const { data, refetch } = useQuery({
    queryKey: ['pending-module-assignments'],
    queryFn: moduleAccessApi.getPendingAssignments
  });

  const review = async (assignmentId: string, status: 'approved' | 'rejected') => {
    try {
      await moduleAccessApi.reviewAssignment({
        assignmentId,
        status,
        feedback: feedbackById[assignmentId],
        score: scoreById[assignmentId]
      });
      toast.success(`Assignment ${status}`);
      refetch();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Trainer Assignment Review Panel</h1>
        {(data?.assignments || []).map((assignment: any) => (
          <Card key={assignment._id}>
            <CardHeader>
              <CardTitle>{assignment.courseId?.title || 'Course'} - Module {assignment.moduleId}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm">Student: {assignment.studentId?.fullName || assignment.studentId?.username} ({assignment.studentId?.email})</p>
              <a href={assignment.submissionLink} className="text-sm text-blue-600 underline" target="_blank">View Submission</a>
              <Input
                placeholder="Score (0-100)"
                type="number"
                onChange={(e) => setScoreById((prev) => ({ ...prev, [assignment._id]: Number(e.target.value) }))}
              />
              <Input
                placeholder="Feedback"
                onChange={(e) => setFeedbackById((prev) => ({ ...prev, [assignment._id]: e.target.value }))}
              />
              <div className="flex gap-2">
                <Button onClick={() => review(assignment._id, 'approved')}>Approve</Button>
                <Button variant="destructive" onClick={() => review(assignment._id, 'rejected')}>Reject</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}
