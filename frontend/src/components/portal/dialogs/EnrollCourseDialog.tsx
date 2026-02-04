import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { BookOpen, Clock, Star, CheckCircle, CreditCard, Smartphone, Check } from "lucide-react";

import { useMutation } from "@apollo/client/react";
import { ENROLL_COURSE, PAY_FOR_COURSE } from "@/lib/graphql/mutations";
import { GET_ME, GET_COURSES } from "@/lib/graphql/queries";

export function EnrollCourseDialog({ open, onOpenChange, course }: any) {
  const [step, setStep] = useState(1); // 1: Info, 2: Payment Method, 3: Processing/Confirmation
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [enrollMutation] = useMutation(ENROLL_COURSE, {
    refetchQueries: [{ query: GET_ME }, { query: GET_COURSES }]
  });

  const [payForCourseMutation] = useMutation(PAY_FOR_COURSE, {
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
        setStep(2);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to enroll in course");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
        toast.error("Please select a payment method");
        return;
    }
    if (paymentMethod === 'momo' && !phoneNumber) {
        toast.error("Please enter your MoMo phone number");
        return;
    }

    setIsProcessing(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const targetCourseId = course.id || course._id;
      if (!targetCourseId) throw new Error("Course ID missing");

      await payForCourseMutation({
        variables: { 
            courseId: targetCourseId,
            amount: finalPrice,
            paymentMethod: paymentMethod === 'momo' ? `MTN MoMo (${phoneNumber})` : 'Card'
        }
      });
      setStep(3);
      toast.success("Payment successful!");
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
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
                setPaymentMethod(null);
                setPhoneNumber("");
            }, 300);
        }
    }}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {step === 1 && "Course Enrollment"}
            {step === 2 && "Secure Payment"}
            {step === 3 && "Enrollment Confirmed"}
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

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total to pay</p>
                    <p className="text-3xl font-bold text-foreground">{(finalPrice).toLocaleString()} RWF</p>
                </div>

                <div className="space-y-3">
                    <p className="text-sm font-medium">Select Payment Method</p>
                    
                    <button 
                        onClick={() => setPaymentMethod('momo')}
                        className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${paymentMethod === 'momo' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-border hover:border-accent/40 bg-muted/10'}`}
                    >
                        <div className="flex items-center gap-3">
                            <Smartphone className="w-6 h-6 text-accent" />
                            <div className="text-left">
                                <p className="font-medium">MTN Mobile Money</p>
                                <p className="text-xs text-muted-foreground">Fast and secure local payment</p>
                            </div>
                        </div>
                        {paymentMethod === 'momo' && <CheckCircle className="w-5 h-5 text-accent" />}
                    </button>

                    {paymentMethod === 'momo' && (
                        <div className="mt-2 ml-2 mr-2">
                            <Input 
                                placeholder="Phone Number (e.g. 078XXXXXXX)"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="bg-background"
                            />
                        </div>
                    )}

                    <button 
                         onClick={() => setPaymentMethod('card')}
                        className={`w-full p-4 rounded-xl border transition-all flex items-center justify-between ${paymentMethod === 'card' ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-border hover:border-accent/40 bg-muted/10'}`}
                    >
                        <div className="flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-accent" />
                            <div className="text-left">
                                <p className="font-medium">Credit / Debit Card</p>
                                <p className="text-xs text-muted-foreground">Visa, Mastercard, etc.</p>
                            </div>
                        </div>
                        {paymentMethod === 'card' && <CheckCircle className="w-5 h-5 text-accent" />}
                    </button>
                </div>

                <p className="text-[10px] text-center text-muted-foreground">
                    Your payment information is encrypted and secure. By clicking Pay Now, you agree to our Terms of Service.
                </p>
              </div>
            )}

            {step === 3 && (
                <div className="py-10 text-center space-y-4">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold">Welcome Aboard!</h2>
                    <p className="text-muted-foreground max-w-xs mx-auto">
                        Your enrollment in <span className="text-foreground font-semibold">{course.title}</span> is confirmed. 
                        You can now start learning from your dashboard.
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

          {step === 2 && (
            <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)} disabled={isProcessing}>
                    Back
                </Button>
                <Button variant="gold" className="flex-1" onClick={handlePayment} disabled={isProcessing || !paymentMethod}>
                    {isProcessing ? "Processing..." : `Pay ${(finalPrice).toLocaleString()} RWF`}
                </Button>
            </div>
          )}

          {step === 3 && (
            <Button variant="gold" className="w-full" onClick={() => onOpenChange(false)}>
                Go to Course
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
