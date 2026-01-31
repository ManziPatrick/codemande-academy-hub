import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  students: number;
  lessons: number;
  price: string;
  isFree: boolean;
  freeTrialLessons: number;
  status: string;
  revenue: string;
  completion: number;
}

interface EditCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
  onSave?: (course: Course) => void;
}

export function EditCourseDialog({ open, onOpenChange, course, onSave }: EditCourseDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    freeTrialLessons: 2,
    isFree: false,
  });

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        price: course.price.replace(/[^\d]/g, ""),
        freeTrialLessons: course.freeTrialLessons,
        isFree: course.isFree,
      });
    }
  }, [course]);

  const handleSave = () => {
    if (!course) return;
    
    const updatedCourse = {
      ...course,
      title: formData.title,
      description: formData.description,
      price: formData.isFree ? "Free" : `${formData.price} RWF`,
      isFree: formData.isFree,
      freeTrialLessons: formData.isFree ? course.lessons : formData.freeTrialLessons,
    };
    
    onSave?.(updatedCourse);
    toast.success("Course updated successfully!");
    onOpenChange(false);
  };

  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Course Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Price (RWF)</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                disabled={formData.isFree}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Free Trial Lessons</label>
              <Input
                type="number"
                value={formData.freeTrialLessons}
                onChange={(e) => setFormData({ ...formData, freeTrialLessons: parseInt(e.target.value) })}
                disabled={formData.isFree}
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
            <div>
              <p className="font-medium text-sm">Make Course Free</p>
              <p className="text-xs text-muted-foreground">All lessons will be accessible</p>
            </div>
            <Switch
              checked={formData.isFree}
              onCheckedChange={(checked) => setFormData({ ...formData, isFree: checked })}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="gold" className="flex-1" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
