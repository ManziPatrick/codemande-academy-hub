import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useMutation } from "@apollo/client/react";
import { CREATE_STRIPE_PAYMENT_INTENT, PROCESS_INTERNSHIP_PAYMENT } from "@/lib/graphql/mutations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Checkout Form Component
function CheckoutForm({ 
  paymentId,
  paymentIntentId, 
  programId, 
  onSuccess, 
  onCancel 
}: { 
  paymentId: string;
  paymentIntentId: string; 
  programId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [processPayment] = useMutation(PROCESS_INTERNSHIP_PAYMENT, {
    onCompleted: () => {
      toast.success("Payment verified! Your internship spot is secured.");
      onSuccess();
    },
    onError: (err) => {
      toast.error(err.message);
      setIsProcessing(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/portal/student/internships?payment_success=true`,
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Create the payment record in our backend
      processPayment({
        variables: {
          paymentId: paymentId,
          transactionId: paymentIntent.id,
          paymentMethod: "stripe_card"
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {errorMessage && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {errorMessage}
        </div>
      )}
      <div className="flex gap-3">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1" 
          onClick={onCancel}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1 gap-2" 
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Pay Now
            </>
          )}
        </Button>
      </div>
      <p className="text-[10px] text-center text-muted-foreground">
        Secure payment processed by Stripe. Your card information never touches our servers.
      </p>
    </form>
  );
}

// Main Dialog Component
export function StripePaymentDialog({ 
  open, 
  onOpenChange, 
  programId,
  programTitle,
  amount,
  currency = "RWF",
  onSuccess
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  programId: string;
  programTitle: string;
  amount: number;
  currency?: string;
  onSuccess?: () => void;
}) {
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const [createIntent, { loading }] = useMutation(CREATE_STRIPE_PAYMENT_INTENT, {
    onCompleted: (data) => {
      setClientSecret(data.createStripePaymentIntent.clientSecret);
      setPaymentIntentId(data.createStripePaymentIntent.paymentIntentId);
      setPaymentId(data.createStripePaymentIntent.paymentId);
      setStripePromise(loadStripe(data.createStripePaymentIntent.publishableKey));
    },
    onError: (err) => {
      toast.error(err.message);
      onOpenChange(false);
    }
  });

  useEffect(() => {
    if (open && programId && !clientSecret) {
      createIntent({ variables: { programId } });
    }
  }, [open, programId, clientSecret, createIntent]);

  // Reset state when closed
  useEffect(() => {
    if (!open) {
      setClientSecret(null);
      setPaymentIntentId(null);
      setPaymentId(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Secure Enrollment</DialogTitle>
          <DialogDescription>
            Secure your spot in the <strong>{programTitle}</strong> program.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-muted/30 p-4 rounded-xl border border-border/50 mb-6 font-medium text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Total Amount</p>
            <p className="text-2xl text-foreground font-bold">{amount.toLocaleString()} {currency}</p>
          </div>

          {loading || !clientSecret || !stripePromise ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <p className="text-sm text-muted-foreground">Initializing secure checkout...</p>
            </div>
          ) : (
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret,
                appearance: {
                  theme: 'night',
                  variables: {
                    colorPrimary: '#D4AF37',
                  }
                }
              }}
            >
              <CheckoutForm 
                paymentId={paymentId!}
                paymentIntentId={paymentIntentId!} 
                programId={programId}
                onSuccess={() => onSuccess && onSuccess()}
                onCancel={() => onOpenChange(false)}
              />
            </Elements>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
