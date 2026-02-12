import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileUpload } from "@/components/FileUpload";
import { useMutation } from "@apollo/client/react";
import { SUBMIT_PAYMENT_PROOF } from "@/lib/graphql/mutations";
import { GET_MY_PAYMENTS } from "@/lib/graphql/queries";
import { Upload, CheckCircle } from "lucide-react";

export function SubmitProofDialog({ open, onOpenChange, payment }: any) {
    const [proofUrl, setProofUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [submitProofMutation] = useMutation(SUBMIT_PAYMENT_PROOF, {
        refetchQueries: [{ query: GET_MY_PAYMENTS }]
    });

    const handleSubmit = async () => {
        if (!proofUrl) {
            toast.error("Please upload a file first");
            return;
        }

        setIsSubmitting(true);
        try {
            await submitProofMutation({
                variables: {
                    paymentId: payment.id,
                    proofUrl
                }
            });
            toast.success("Proof submitted successfully!");
            onOpenChange(false);
        } catch (err: any) {
            toast.error(err.message || "Failed to submit proof");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!payment) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Submit Proof of Payment</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
                        <p className="text-sm font-bold">{payment.itemTitle}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Amount: {payment.amount.toLocaleString()} {payment.currency}
                        </p>
                    </div>

                    <FileUpload
                        onUploadComplete={(url) => setProofUrl(url)}
                        label="Upload Proof (Image or PDF)"
                        folder="payment-proofs"
                    />

                    {proofUrl && (
                        <div className="flex items-center gap-2 text-green-500 text-xs font-semibold justify-center">
                            <CheckCircle className="w-4 h-4" /> Proof uploaded
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="gold"
                            className="flex-1"
                            onClick={handleSubmit}
                            disabled={!proofUrl || isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit Proof"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
