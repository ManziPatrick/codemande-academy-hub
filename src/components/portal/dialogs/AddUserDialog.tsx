import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd?: (user: { name: string; email: string; role: string }) => void;
}

export function AddUserDialog({ open, onOpenChange, onAdd }: AddUserDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    onAdd?.(formData);
    toast.success("User added successfully!");
    setFormData({ name: "", email: "", role: "student" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-4 sm:px-6">
          <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Full Name *</label>
            <Input
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Email *</label>
            <Input
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Role</label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="trainer">Trainer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          </div>
        </ScrollArea>
        <div className="flex gap-2 p-4 sm:p-6 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="gold" className="flex-1" onClick={handleSubmit}>
            Add User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
