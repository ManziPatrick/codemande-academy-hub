import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Briefcase, CheckCircle, Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface ApplyInternshipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply?: () => void;
}

export function ApplyInternshipDialog({ 
  open, 
  onOpenChange, 
  onApply 
}: ApplyInternshipDialogProps) {
  const [step, setStep] = useState<"info" | "payment" | "success">("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    motivation: "",
    availability: "",
    portfolio: "",
    agreeToTerms: false,
  });

  const handleNext = async () => {
    if (!formData.motivation || !formData.availability || !formData.agreeToTerms) {
      toast.error("Please fill in all required fields and agree to terms");
      return;
    }
    setStep("payment");
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStep("success");
    setIsSubmitting(false);
    onApply?.();
  };

  const handleClose = () => {
    setStep("info");
    setFormData({ motivation: "", availability: "", portfolio: "", agreeToTerms: false });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-accent" />
            Apply for Internship
          </DialogTitle>
        </DialogHeader>

        {step === "info" && (
          <>
            <ScrollArea className="flex-1 px-4 sm:px-6">
              <div className="space-y-4 py-4">
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                  <h4 className="font-medium text-card-foreground mb-2">Internship Program</h4>
                  <p className="text-sm text-muted-foreground">
                    3-6 month hands-on experience working on real projects with industry mentors.
                  </p>
                  <div className="mt-3 text-2xl font-bold text-accent">
                    20,000 <span className="text-sm font-normal">RWF</span>
                  </div>
                  <p className="text-xs text-muted-foreground">One-time application fee</p>
                </div>

                <div>
                  <Label htmlFor="motivation">Why do you want to join? *</Label>
                  <Textarea
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    placeholder="Tell us about your motivation and career goals..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="availability">Availability *</Label>
                  <Input
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    placeholder="e.g., 20 hours/week, Mon-Fri afternoons"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="portfolio">Portfolio/GitHub URL (Optional)</Label>
                  <Input
                    id="portfolio"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    placeholder="https://github.com/yourusername"
                    className="mt-1.5"
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, agreeToTerms: checked as boolean })
                    }
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                    I agree to the internship terms and conditions, including the commitment 
                    requirements and code of conduct.
                  </label>
                </div>
              </div>
            </ScrollArea>

            <div className="flex gap-2 p-4 sm:p-6 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="gold" className="flex-1" onClick={handleNext}>
                Continue to Payment
              </Button>
            </div>
          </>
        )}

        {step === "payment" && (
          <>
            <ScrollArea className="flex-1 px-4 sm:px-6">
              <div className="space-y-4 py-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-3">Payment Summary</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span>Internship Application Fee</span>
                    <span className="font-medium">20,000 RWF</span>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <Label className="text-sm font-medium mb-3 block">Payment Method</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg border border-accent/30">
                      <CreditCard className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm font-medium">Mobile Money</p>
                        <p className="text-xs text-muted-foreground">MTN MoMo or Airtel Money</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Mobile Money Number</Label>
                  <Input
                    id="phone"
                    placeholder="07X XXX XXXX"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </ScrollArea>

            <div className="flex gap-2 p-4 sm:p-6 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setStep("info")}>
                Back
              </Button>
              <Button variant="gold" className="flex-1" onClick={handlePayment} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Pay 20,000 RWF"
                )}
              </Button>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="py-8 px-4 sm:px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="font-heading text-xl font-medium text-foreground mb-2">
              Application Submitted!
            </h3>
            <p className="text-muted-foreground mb-6">
              Your internship application has been received. We'll review it and 
              get back to you within 3-5 business days.
            </p>
            <Button variant="gold" onClick={handleClose}>
              Continue
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
