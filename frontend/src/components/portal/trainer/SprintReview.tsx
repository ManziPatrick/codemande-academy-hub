import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { GRADE_SPRINT_MILESTONE } from '@/lib/graphql/mutations';
import RichTextEditor from '@/components/ui/RichTextEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Award, CheckCircle2 } from 'lucide-react';

interface SprintReviewProps {
  internshipId: string;
  onSuccess?: () => void;
}

export const SprintReview: React.FC<SprintReviewProps> = ({ internshipId, onSuccess }) => {
  const [week, setWeek] = useState(1);
  const [grade, setGrade] = useState(0);
  const [feedback, setFeedback] = useState('');

  const [gradeSprint, { loading }] = useMutation(GRADE_SPRINT_MILESTONE, {
    onCompleted: () => {
      toast.success("Sprint graded successfully!");
      setFeedback('');
      setGrade(0);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback) {
      toast.error("Please provide feedback for the core sprint review.");
      return;
    }
    if (grade < 0 || grade > 100) {
      toast.error("Grade must be between 0 and 100.");
      return;
    }
    gradeSprint({
      variables: {
        internshipId,
        week: Number(week),
        grade: Number(grade),
        feedback
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          Weekly Sprint Review & Grading
        </CardTitle>
        <CardDescription>
          Evaluate the intern's weekly milestones and provide rich feedback.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <Label>Sprint Week</Label>
              <Input
                type="number"
                min="1"
                value={week}
                onChange={(e) => setWeek(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-2 flex-1">
              <Label>Sprint Grade (0-100)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={grade}
                onChange={(e) => setGrade(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Sprint Feedback
            </Label>
            <RichTextEditor 
              value={feedback} 
              onChange={setFeedback} 
              placeholder="Provide a detailed review of what they did well and what needs improvement..." 
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting Grade..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SprintReview;
