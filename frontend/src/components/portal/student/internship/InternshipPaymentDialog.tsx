import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { PROCESS_INTERNSHIP_PAYMENT } from "@/lib/graphql/mutations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, 
  CheckCircle, 
  Loader2, 
  Smartphone,
  ArrowRight,
  ShieldCheck,
  Lock,
  Globe,
  History
} from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaymentForm } from "@/components/PaymentForm";
import { FileUpload } from "@/components/FileUpload";

interface InternshipPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  internshipProgramId: string;
  paymentId: string;
  programTitle: string;
  amount: number;
  currency?: string;
  onSuccess?: () => void;
}

export function InternshipPaymentDialog({
  open,
  onOpenChange,
  internshipProgramId,
  paymentId,
  programTitle,
  amount,
  currency = "RWF",
  onSuccess,
}: InternshipPaymentDialogProps) {
  const [paymentMethod, setPaymentMethod] = useState<"paypack" | "manual">("paypack");
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>("");

  const [processPayment, { loading: isSubmitting }] = useMutation(PROCESS_INTERNSHIP_PAYMENT, {
    onCompleted: () => {
      toast.success("Payment submitted successfully! Our team will verify it.");
      if (onSuccess) onSuccess();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleManualFinalize = async () => {
    if (!paymentProofUrl) {
      toast.error("Please upload your payment proof first.");
      return;
    }

    await processPayment({
      variables: {
        paymentId,
        paymentMethod: "manual_transfer",
        paymentProofUrl,
        transactionId: "MANUAL-" + Date.now() 
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] sm:max-w-[400px] max-h-[92vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl rounded-[2rem] bg-background">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-accent" />
                <span>Secure Enrollment</span>
              </DialogTitle>
              <DialogDescription className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                {programTitle}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Primary Scrollable Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-6 space-y-8 custom-scrollbar">
            {/* Ticket Header Section */}
            <div className="relative p-6 bg-gradient-to-b from-accent/10 via-accent/5 to-transparent rounded-[2rem] border border-accent/20 overflow-hidden shadow-sm">
                <div className="absolute top-4 right-4 text-accent">
                    <ShieldCheck className="w-5 h-5 animate-pulse" />
                </div>
                
                <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-600 rounded-full border border-green-500/20 text-[10px] font-black uppercase tracking-tighter w-fit shadow-sm mb-2">
                        <CheckCircle className="w-3 h-3" />
                        Verified Spot
                    </div>
                    <h3 className="text-sm font-black text-accent uppercase tracking-[0.2em]">Secure Enrollment</h3>
                    <p className="text-lg font-black text-foreground leading-tight tracking-tight uppercase">{programTitle}</p>
                </div>
                
                <div className="mt-8 flex flex-col items-center gap-1 border-t border-dashed border-accent/30 pt-6">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Total Due Today</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-foreground tracking-tighter">{amount.toLocaleString()}</span>
                        <span className="text-sm font-black text-muted-foreground/60 uppercase">{currency}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-[9px] text-accent font-black uppercase tracking-widest bg-accent/5 px-4 py-1.5 rounded-full border border-accent/20 shadow-sm">
                        <Globe className="w-3 h-3" />
                        PAYPACK SECURE
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-3 px-1">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-1">Choose Payment Method</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className={`relative flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all duration-300
                                ${paymentMethod === "paypack" 
                                    ? "border-accent bg-accent/5 ring-4 ring-accent/10 shadow-md" 
                                    : "border-border/40 bg-muted/5 hover:border-accent/30"}`}
                            onClick={() => setPaymentMethod("paypack")}
                        >
                            <Smartphone className={`w-5 h-5 ${paymentMethod === "paypack" ? "text-accent" : "text-muted-foreground/40"}`} />
                            <span className="text-[11px] font-black uppercase tracking-wider">Local MoMo</span>
                            {paymentMethod === "paypack" && <div className="absolute top-2 right-2"><CheckCircle className="w-3.5 h-3.5 text-accent" /></div>}
                        </button>

                        <button
                            type="button"
                            className={`relative flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border-2 transition-all duration-300
                                ${paymentMethod === "manual" 
                                    ? "border-accent bg-accent/5 ring-4 ring-accent/10 shadow-md" 
                                    : "border-border/40 bg-muted/5 hover:border-accent/30"}`}
                            onClick={() => setPaymentMethod("manual")}
                        >
                            <History className={`w-5 h-5 ${paymentMethod === "manual" ? "text-accent" : "text-muted-foreground/40"}`} />
                            <span className="text-[11px] font-black uppercase tracking-wider">Bank Transfer</span>
                            {paymentMethod === "manual" && <div className="absolute top-2 right-2"><CheckCircle className="w-3.5 h-3.5 text-accent" /></div>}
                        </button>
                    </div>
                </div>

                <div className="pt-2">
                    {paymentMethod === "paypack" ? (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] pl-2">MOBILE MONEY NUMBER</Label>
                            <div className="bg-muted/5 rounded-2xl p-1 border border-border/40">
                                <PaymentForm
                                    amount={amount}
                                    description={`Enrollment: ${programTitle}`}
                                    internshipProgramId={internshipProgramId}
                                    onSuccess={() => {
                                        onSuccess?.();
                                        onOpenChange(false);
                                    }}
                                />
                            </div>
                    </div>
                    ) : (
                    <div className="p-6 border border-dashed border-accent/20 bg-accent/5 rounded-3xl space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                                <Smartphone className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Local USSD Code</p>
                                <p className="text-xl font-black text-foreground">*182*8*1*234567#</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex flex-col gap-1 px-1">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Upload Proof of Payment</Label>
                                <p className="text-[9px] text-muted-foreground font-medium italic">Snapshot of your USSD confirmation SMS.</p>
                            </div>
                            <div className="bg-background rounded-2xl p-1 border border-border/50">
                                <FileUpload
                                    onUploadComplete={(url) => setPaymentProofUrl(url)}
                                    folder="payments"
                                />
                            </div>
                            
                            {/* Image Preview */}
                            {paymentProofUrl && (
                                <div className="relative group animate-in zoom-in-95 duration-300">
                                    <div className="absolute -top-2 -right-2 z-10">
                                        <button 
                                            onClick={() => setPaymentProofUrl("")}
                                            className="p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:scale-110 transition-transform"
                                        >
                                            <History className="w-3 h-3 rotate-45" />
                                        </button>
                                    </div>
                                    <div className="overflow-hidden rounded-2xl border-2 border-accent/20 shadow-md aspect-[4/3] bg-muted/20">
                                        <img 
                                            src={paymentProofUrl} 
                                            alt="Payment Proof" 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="mt-2 flex items-center justify-center gap-1.5 text-[9px] font-black text-green-600 uppercase tracking-widest">
                                        <CheckCircle className="w-3 h-3" />
                                        Snapshot Ready
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button 
                            variant="gold" 
                            className="w-full h-12 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-premium flex items-center gap-2 justify-center group"
                            onClick={handleManualFinalize}
                            disabled={isSubmitting || !paymentProofUrl}
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : <ShieldCheck className="w-4 h-4 text-black" />}
                            <span>Finalize Ticket</span>
                        </Button>
                    </div>
                    )}
                </div>

                <div className="pt-8 pb-4 flex flex-col items-center gap-4 mt-6 border-t border-dashed border-border/50">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/5 rounded-full border border-green-500/10 text-[10px] font-black text-green-600 uppercase tracking-[0.2em] shadow-sm">
                        <Lock className="w-4 h-4" />
                        End-to-End Encryption
                    </div>
                    <p className="text-[10px] text-muted-foreground/50 text-center leading-relaxed max-w-[280px] font-medium italic">
                        Your transaction is secured by AES-256 encrypted gateways via Paypack. No financial data is stored locally.
                    </p>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
