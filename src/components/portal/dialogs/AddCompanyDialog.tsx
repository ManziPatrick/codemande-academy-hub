import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCompanyDialog({ open, onOpenChange }: AddCompanyDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    positions: "1",
    contactName: "",
    contactEmail: "",
    description: "",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.industry) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.success("Partner company added successfully!");
    setFormData({
      name: "",
      industry: "",
      positions: "1",
      contactName: "",
      contactEmail: "",
      description: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle>Add Partner Company</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 px-4 sm:px-6">
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Company Name *</label>
              <Input
                placeholder="e.g., TechCorp Rwanda"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Industry *</label>
              <Select
                value={formData.industry}
                onValueChange={(value) => setFormData({ ...formData, industry: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="data">Data & AI</SelectItem>
                  <SelectItem value="iot">IoT</SelectItem>
                  <SelectItem value="fintech">Fintech</SelectItem>
                  <SelectItem value="various">Various</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Available Positions</label>
              <Input
                type="number"
                min="1"
                value={formData.positions}
                onChange={(e) => setFormData({ ...formData, positions: e.target.value })}
              />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Contact Person</label>
              <Input
                placeholder="Contact name"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Contact Email</label>
              <Input
                type="email"
                placeholder="contact@company.com"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
            </div>
          </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                placeholder="Brief description of the company..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </ScrollArea>
        <div className="flex gap-2 p-4 sm:p-6 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="gold" className="flex-1" onClick={handleSubmit}>
            Add Company
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
