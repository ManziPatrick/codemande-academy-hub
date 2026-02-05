import { useState } from 'react';
import { useMutation } from "@apollo/client/react";
import { CREATE_INTERNSHIP_PROGRAM } from '@/lib/graphql/mutations';
import { GET_INTERNSHIP_PROGRAMS } from '@/lib/graphql/queries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface CreateInternshipProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateInternshipProgramDialog({ open, onOpenChange }: CreateInternshipProgramDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '3 Months',
    startDate: '',
    endDate: '',
    applicationDeadline: '',
    price: 0,
    currency: 'RWF'
  });

  const [createProgram, { loading }] = useMutation(CREATE_INTERNSHIP_PROGRAM, {
    refetchQueries: [{ query: GET_INTERNSHIP_PROGRAMS }],
    onCompleted: () => {
      toast.success('Internship program created successfully');
      onOpenChange(false);
      setFormData({
        title: '',
        description: '',
        duration: '3 Months',
        startDate: '',
        endDate: '',
        applicationDeadline: '',
        price: 0,
        currency: 'RWF'
      });
    },
    onError: (err) => toast.error(err.message)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProgram({
      variables: {
        ...formData,
        price: parseFloat(formData.price.toString())
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Internship Program</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Program Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Full Stack Web Development"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell applicants what they will learn..."
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 3 Months"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (0 for free)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Application Deadline</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.applicationDeadline}
              onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-accent hover:bg-accent/90">
              {loading ? 'Creating...' : 'Create Program'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
