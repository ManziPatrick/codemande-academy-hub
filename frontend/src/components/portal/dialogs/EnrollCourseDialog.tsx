import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BookOpen, Clock, Star, CheckCircle, CreditCard, Smartphone, Check, FileText, XCircle } from "lucide-react";


import { useMutation } from "@apollo/client/react";
import { ENROLL_COURSE, PAY_FOR_COURSE, SUBMIT_PAYMENT_PROOF } from "@/lib/graphql/mutations";
import { GET_ME, GET_COURSES } from "@/lib/graphql/queries";
import { FileUpload } from "@/components/FileUpload";


export function EnrollCourseDialog({ open, onOpenChange, course }: any) {
  const [step, setStep] = useState(1); // 1: Info, 3: Proof Upload, 4: Confirmation
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [proofUrl, setProofUrl] = useState<string | null>(null);


  const [enrollMutation] = useMutation(ENROLL_COURSE, {
    refetchQueries: [{ query: GET_ME }, { query: GET_COURSES }]
  });

  const [payForCourseMutation] = useMutation(PAY_FOR_COURSE);
  const [submitProofMutation] = useMutation(SUBMIT_PAYMENT_PROOF, {
    refetchQueries: [{ query: GET_ME }, { query: GET_COURSES }]
  });


  if (!course) return null;

  const finalPrice = course.discountPrice > 0 ? course.discountPrice : course.price;
  const isFree = finalPrice === 0;

  const handleEnroll = async () => {
    setIsProcessing(true);
    try {
      if (isFree) {
        const targetCourseId = course.id || course._id;
        if (!targetCourseId) throw new Error("Course ID missing");

        await enrollMutation({
          variables: { courseId: targetCourseId }
        });
        toast.success(`Successfully enrolled in ${course.title}!`);
        onOpenChange(false);
      } else {
        const targetCourseId = course.id || course._id;
        if (!targetCourseId) throw new Error("Course ID missing");

        const { data } = await payForCourseMutation({
          variables: {
            courseId: targetCourseId,
            amount: finalPrice,
            paymentMethod: 'Manual Payment (MoMo/PayPal)'
          }
        });

        if ((data as any)?.payForCourse?.id) {
          setPaymentId((data as any).payForCourse.id);
          setStep(3); // Go to proof upload
        } else {
          throw new Error("Failed to initiate payment");
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to proceed with enrollment");
    } finally {
      setIsProcessing(false);
    }
  };




  const handleSubmitProof = async () => {
    if (!proofUrl) {
      toast.error("Please upload your proof of payment first");
      return;
    }

    setIsProcessing(true);
    try {
      await submitProofMutation({
        variables: {
          paymentId,
          proofUrl
        }
      });
      setStep(4);
      toast.success("Proof submitted! Awaiting admin verification.");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit proof");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalLessons = course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0;

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) {
        setTimeout(() => {
          setStep(1);
        }, 300);
      }

    }}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {step === 1 && "Course Enrollment"}
            {step === 3 && "Submit Proof of Payment"}
            {step === 4 && "Enrollment Pending"}
          </DialogTitle>
        </DialogHeader>


        <ScrollArea className="flex-1 px-6 custom-scrollbar">
          <div className="py-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-muted/20 rounded-lg text-center">
                    <BookOpen className="w-5 h-5 text-accent mx-auto mb-1" />
                    <p className="text-sm font-medium">{totalLessons} Lessons</p>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg text-center">
                    <Clock className="w-5 h-5 text-accent mx-auto mb-1" />
                    <p className="text-sm font-medium">{course.level}</p>
                  </div>
                  <div className="p-3 bg-muted/20 rounded-lg text-center">
                    <Star className="w-5 h-5 fill-accent text-accent mx-auto mb-1" />
                    <p className="text-sm font-medium">4.8 Rating</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/10 rounded-lg">
                    <span className="text-sm text-muted-foreground">Instructor</span>
                    <span className="font-medium">{course.instructor?.username || 'Trainer'}</span>
                  </div>

                  <div className="p-4 border border-accent/20 rounded-xl bg-accent/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-muted-foreground">Investment</span>
                      <div className="text-right">
                        {course.discountPrice > 0 ? (
                          <>
                            <span className="text-xs text-muted-foreground line-through mr-2">{course.price.toLocaleString()} RWF</span>
                            <span className="text-xl font-bold text-accent">{course.discountPrice.toLocaleString()} RWF</span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-accent">{course.price.toLocaleString()} RWF</span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Lifetime access + Certificate of completion</p>
                  </div>
                </div>
              </div>
            )}


            {step === 3 && (
              <div className="space-y-6">
                <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
                  <p className="text-sm font-bold text-accent mb-3 text-center uppercase tracking-wider">Manual Payment Instructions</p>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center p-3 bg-background rounded-lg border border-border/50">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-accent" />
                        <span className="font-medium">MTN MoMo</span>
                      </div>
                      <span className="font-mono font-bold select-all">250790706170</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-background rounded-lg border border-border/50">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-accent" />
                        <span className="font-medium">PayPal</span>
                      </div>
                      <span className="font-mono font-bold select-all">munyeshurimanzi@gmail.com</span>
                    </div>

                    <div className="p-3 bg-muted/20 rounded-lg space-y-2">
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        1. Send <span className="text-accent font-bold">{finalPrice.toLocaleString()} RWF</span> using either method above.
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        2. Keep your transaction confirmation message or take a screenshot.
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        3. Upload the confirmation proof below for verification.
                      </p>
                    </div>
                  </div>
                </div>


                <FileUpload
                  onUploadComplete={(url) => setProofUrl(url)}
                  label="Upload Confirmation Screenshot/PDF"
                  folder="payment-proofs"
                />

                {proofUrl && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-500 text-xs font-semibold justify-center">
                      <CheckCircle className="w-4 h-4" /> Proof uploaded successfully
                    </div>

                    <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-black/5 flex items-center justify-center">
                      {proofUrl.toLowerCase().endsWith('.pdf') ? (
                        <div className="flex flex-col items-center p-4">
                          <FileText className="w-8 h-8 text-accent mb-2" />
                          <span className="text-xs font-medium">PDF Document</span>
                        </div>
                      ) : (
                        <img src={proofUrl} alt="Payment Proof" className="w-full h-full object-contain" />
                      )}
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 rounded-full shadow-lg"
                        onClick={() => setProofUrl(null)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}


            {step === 4 && (
              <div className="py-10 text-center space-y-4">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-10 h-10 text-accent animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold">Verification Pending</h2>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  We've received your proof of payment for <span className="text-foreground font-semibold">{course.title}</span>.
                  Our team will verify it within 24 hours. You'll receive a notification once approved.
                </p>
              </div>
            )}

          </div>
        </ScrollArea>

        <div className="p-6 border-t border-border bg-muted/5">
          {step === 1 && (
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Maybe Later
              </Button>
              <Button variant="gold" className="flex-1" onClick={handleEnroll} disabled={isProcessing}>
                {isProcessing ? "Processing..." : isFree ? "Enroll Free" : "Next: Payment"}
              </Button>
            </div>
          )}



          {step === 3 && (
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)} disabled={isProcessing}>
                Back
              </Button>
              <Button variant="gold" className="flex-1" onClick={handleSubmitProof} disabled={isProcessing || !proofUrl}>
                {isProcessing ? "Processing..." : "Complete Enrollment"}
              </Button>
            </div>
          )}

          {step === 4 && (
            <Button variant="gold" className="w-full" onClick={() => onOpenChange(false)}>
              Got it
            </Button>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
}
