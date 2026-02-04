import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Briefcase, CheckCircle, Loader2, CreditCard, ArrowRight, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useMutation } from "@apollo/client/react";
import { CREATE_INTERNSHIP } from "@/lib/graphql/mutations";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const [step, setStep] = useState<"info" | "payment" | "success">("info");
  const [formData, setFormData] = useState({
    motivation: "",
    availability: "",
    portfolio: "",
    phone: "",
    isStudent: true,
    schoolName: "",
    level: "",
    languages: "",
    skills: "",
    agreeToTerms: false,
  });

  const [createInternship, { loading: isSubmitting }] = useMutation(CREATE_INTERNSHIP, {
    onCompleted: () => {
      setStep("success");
      onApply?.();
    },
    onError: (err) => {
      toast.error(err.message);
    }
  });

  const handleApply = async () => {
    if (!formData.motivation || !formData.availability || !formData.phone || !formData.agreeToTerms) {
      toast.error("Please fill in all required fields and agree to terms");
      return;
    }

    if (formData.isStudent && (!formData.schoolName || !formData.level)) {
      toast.error("Please provide your school details");
      return;
    }

    if (!formData.isStudent && (!formData.languages && !formData.skills)) {
      toast.error("Please provide your languages or skills");
      return;
    }

    if (!user) return;

    createInternship({
      variables: {
        userId: user.id,
        title: "Software Development Intern",
        duration: "3-6 Months",
        type: "Hybrid",
        academicSchool: formData.isStudent ? formData.schoolName : undefined,
        academicLevel: formData.isStudent ? formData.level : undefined,
        previousLanguages: !formData.isStudent ? formData.languages : undefined,
        skills: !formData.isStudent ? formData.skills : undefined,
        phoneNumber: formData.phone,
        portfolioUrl: formData.portfolio,
        payment: {
          amount: 20000,
          currency: "RWF",
          status: "pending"
        },
        organization: "CODEMANDE Academy"
      }
    });
  };

  const handleClose = () => {
    setStep("info");
    setFormData({ 
      motivation: "", 
      availability: "", 
      portfolio: "", 
      phone: "",
      isStudent: true,
      schoolName: "",
      level: "",
      languages: "",
      skills: "",
      agreeToTerms: false 
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-accent" />
            Apply for Internship
          </DialogTitle>
        </DialogHeader>

        {step === "info" && (
          <>
            <div className="flex-1 px-4 sm:px-6 overflow-y-auto custom-scrollbar">
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
                    placeholder="Tell us about your motivation..."
                    rows={3}
                    className="mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 078XXXXXXX"
                      className="mt-1.5"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <Label htmlFor="availability">Availability *</Label>
                    <Input
                      id="availability"
                      value={formData.availability}
                      onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                      placeholder="e.g., 20h/week"
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="portfolio">Portfolio or GitHub Link</Label>
                  <Input
                    id="portfolio"
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    placeholder="https://github.com/yourusername"
                    className="mt-1.5"
                  />
                </div>

                <div className="space-y-4 pt-2">
                  <Label>Are you currently a student?</Label>
                  <div className="flex gap-4">
                    <Button 
                      type="button"
                      variant={formData.isStudent ? "gold" : "outline"} 
                      className="flex-1"
                      onClick={() => setFormData({ ...formData, isStudent: true })}
                    >
                      Yes, I am
                    </Button>
                    <Button 
                      type="button"
                      variant={!formData.isStudent ? "gold" : "outline"} 
                      className="flex-1"
                      onClick={() => setFormData({ ...formData, isStudent: false })}
                    >
                      No, I'm not
                    </Button>
                  </div>
                </div>

                {formData.isStudent ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="schoolName">School/University *</Label>
                      <Input
                        id="schoolName"
                        value={formData.schoolName}
                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                        placeholder="e.g. University of Rwanda"
                        className="mt-1.5"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Label htmlFor="level">Level/Class *</Label>
                      <Input
                        id="level"
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        placeholder="e.g. Year 3, Senior"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="languages">Programming Languages used before</Label>
                      <Input
                        id="languages"
                        value={formData.languages}
                        onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                        placeholder="e.g. React, Node.js, Python"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="skills">Relevant Skills</Label>
                      <Input
                        id="skills"
                        value={formData.skills}
                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        placeholder="e.g. Git, Docker, UI Design"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, agreeToTerms: checked as boolean })
                    }
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                    I agree to the internship terms and conditions.
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 p-4 sm:p-6 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                variant="gold" 
                className="flex-1" 
                onClick={() => setStep("payment")}
                disabled={!formData.motivation || !formData.availability || !formData.agreeToTerms}
              >
                Proceed <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}

        {step === "payment" && (
          <>
            <div className="flex-1 px-4 sm:px-6 overflow-y-auto custom-scrollbar">
              <div className="space-y-6 py-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CreditCard className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Application Fee</p>
                  <p className="text-3xl font-bold text-foreground">20,000 RWF</p>
                </div>

                <div className="space-y-3 text-left">
                  <p className="text-sm font-medium">Select Payment Method</p>
                  <div className="grid gap-3">
                    <Button variant="outline" className="justify-start h-16 px-4 gap-4 border-accent/20 bg-accent/5 ring-1 ring-accent">
                      <Smartphone className="w-6 h-6 text-accent" />
                      <div className="text-left">
                        <p className="font-medium">MTN Mobile Money</p>
                        <p className="text-[10px] text-muted-foreground">Fast and secure local payment</p>
                      </div>
                    </Button>
                  </div>
                  <div className="mt-2">
                    <Label className="text-xs mb-1.5 block">Phone Number</Label>
                    <Input placeholder="078XXXXXXX" className="bg-background" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 p-4 sm:p-6 border-t border-border">
              <Button variant="outline" className="flex-1" onClick={() => setStep("info")}>
                Back
              </Button>
              <Button variant="gold" className="flex-1" onClick={handleApply} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay & Submit <CheckCircle className="w-4 h-4 ml-2" />
                  </>
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
              Registration Successful!
            </h3>
            <p className="text-muted-foreground mb-6">
              You are now registered for the program. Next, you need to complete the 
              application fee payment from your internship dashboard to activate your profile.
            </p>
            <Button variant="gold" className="w-full" onClick={handleClose}>
              Go to Dashboard
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
