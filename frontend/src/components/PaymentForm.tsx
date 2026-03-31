import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Phone, DollarSign, CheckCircle, Smartphone, Star } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/env';

interface PaymentFormProps {
  amount: number;
  description: string;
  courseId?: string;
  subscriptionId?: string;
  internshipProgramId?: string;
  onSuccess?: () => void;
}

export function PaymentForm({
  amount,
  description,
  courseId,
  subscriptionId,
  internshipProgramId,
  onSuccess,
}: PaymentFormProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Format as phone number
    if (value.length >= 1 && value.startsWith('0')) {
      value = value; // Keep as is (078xxxxxxx)
    } else if (value.length >= 1 && !value.startsWith('0')) {
      value = '0' + value; // Add leading 0 if missing
    }
    
    setPhoneNumber(value);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Rwandan phone format: 078xxxxxxx or +250788xxxxxx
    const regex = /^(\+250|0)[1-9]\d{8}$/;
    return regex.test(phone.replace(/\s+/g, ''));
  };

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      toast.error('Invalid phone number format. Use 078xxxxxxx');
      return;
    }

    setIsLoading(true);

    try {
      const baseUrl = getApiBaseUrl();

      const response = await fetch(`${baseUrl}/api/payments/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('codemande_token')}`,
        },
        body: JSON.stringify({
          amount: Math.floor(amount),
          phoneNumber,
          description,
          courseId: courseId || undefined,
          subscriptionId: subscriptionId || undefined,
          internshipProgramId: internshipProgramId || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to initiate payment');
      }

      const data = await response.json();
      setTransactionId(data.transactionId);
      setPaymentStatus('pending');

      toast.success('Payment initiated! Check your phone for a USSD prompt.');
      toast.info(data.instructions);

      // Start polling for payment status after 3 seconds
      setTimeout(() => {
        pollPaymentStatus(data.transactionId);
      }, 3000);
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to initiate payment'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const pollPaymentStatus = async (txId: string) => {
    setPaymentStatus('checking');

    try {
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/payments/${txId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('codemande_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check payment status');
      }

      const data = await response.json();
      console.log('Payment status check:', data.status);

      const terminalStatuses = ['successful', 'failed', 'cancelled', 'expired'];
      
      if (data.status === 'successful') {
        setPaymentStatus(null);
        toast.success('Payment successful! 🎉');
        onSuccess?.();
      } else if (data.status === 'failed' || data.status === 'cancelled' || data.status === 'expired') {
        setPaymentStatus(null);
        toast.error(`Payment ${data.status}. Please try again.`);
      } else {
        // Still pending or unknown, keep polling
        setPaymentStatus('pending');
        setTimeout(() => {
          pollPaymentStatus(txId);
        }, 4000);
      }
    } catch (error) {
      console.error('Status check error:', error);
      // Keep polling on error (might be transient network issue)
      setTimeout(() => {
        pollPaymentStatus(txId);
      }, 6000);
    }
  }

  // Show status message while payment is pending
  if (transactionId && paymentStatus) {
    return (
      <div className="w-full max-w-sm mx-auto p-6 border rounded-2xl bg-white shadow-xl relative overflow-hidden">
        <div className="relative flex flex-col items-center justify-center mb-6">
          <div className="relative w-14 h-14 bg-[#ffcc00] rounded-2xl flex items-center justify-center shadow-lg mb-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
            <img 
               src="https://momo.mtn.com/wp-content/uploads/sites/15/2022/07/Group-360.png" 
               alt="MTN" 
               className="w-8 h-8 object-contain rounded"
            />
          </div>
          
          <div className="flex flex-col items-center gap-0.5">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#ffcc00]" />
              <h3 className="text-lg font-black text-gray-900 tracking-tight">Authorization Sent</h3>
            </div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Checking...</p>
          </div>
        </div>

        <div className="relative bg-gray-50/80 border border-gray-100 rounded-xl p-4 text-center space-y-3 backdrop-blur-sm">
          <p className="text-[11px] text-gray-600 leading-normal">
            Enter your PIN on the <strong>MoMo prompt</strong><br/>
            to authorize <strong>{amount.toLocaleString()} RWF</strong>.
          </p>
          
          <div className="py-1.5 px-3 bg-white rounded-lg shadow-xs inline-block border border-gray-100">
             <span className="text-[9px] uppercase font-bold text-gray-300 block mb-0.5">Reference</span>
             <span className="font-mono text-[10px] font-bold text-gray-700">{transactionId.substring(transactionId.length - 8).toUpperCase()}</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setTransactionId(null);
              setPaymentStatus(null);
            }}
            className="w-full border border-gray-100 hover:bg-gray-50 font-bold transition-all h-10 rounded-xl text-xs"
          >
            I've completed payment
          </Button>
          
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest text-center"
          >
            Refresh if prompt didn't appear
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleInitiatePayment} className="w-full max-w-sm space-y-4 flex flex-col items-center">
      {/* Light MoMo Header - Reduced Yellow */}
      <div className="w-full relative overflow-hidden bg-white border-2 border-[#ffcc00]/30 rounded-2xl p-4 shadow-sm text-center">
        <div className="relative flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#ffcc00]/10 rounded-lg flex items-center justify-center p-1.5 border border-[#ffcc00]/20">
              <img 
                src="https://momo.mtn.com/wp-content/uploads/sites/15/2022/07/Group-360.png" 
                alt="MTN" 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <span className="text-lg font-black text-gray-800 tracking-tight">MoMo Pay</span>
          </div>

          <div className="flex flex-col items-center scale-95">
            <div className="flex items-center gap-1.5 mb-1 justify-center opacity-40">
               <img src="https://flagcdn.com/w40/rw.png" alt="RW Flag" className="w-3.5 h-2.5 object-cover rounded-sm shadow-xs grayscale-[0.3]" />
               <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest">Amount Due</span>
            </div>
            <div className="flex items-baseline gap-1.5 px-4 py-1.5 rounded-xl border border-gray-100 bg-gray-50/50">
              <span className="text-2xl font-black text-gray-900 tabular-nums">{amount.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">RWF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description Box - Minimalist */}
      <div className="w-full px-3 py-1.5 bg-muted/20 border border-border/40 rounded-xl flex items-center justify-center gap-2">
        <DollarSign className="w-3 h-3 text-primary/70" />
        <p className="text-[10px] text-muted-foreground font-semibold text-center">{description}</p>
      </div>

      {/* Transparent Input - Visible Border */}
      <div className="w-full space-y-2 text-center flex flex-col items-center">
        <Label htmlFor="phone" className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          Mobile Money Phone Number
        </Label>
        
        <div className="relative group w-full max-w-[240px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Smartphone className="w-3.5 h-3.5 text-gray-300 group-focus-within:text-[#ffcc00] transition-colors" />
          </div>
          <Input
            id="phone"
            type="tel"
            placeholder="078 / 079..."
            value={phoneNumber}
            onChange={handlePhoneChange}
            disabled={isLoading}
            className="pl-10 h-11 bg-transparent border-2 border-gray-200 focus:border-[#ffcc00] focus:ring-0 rounded-xl text-lg font-black tracking-widest placeholder:tracking-normal placeholder:font-medium placeholder:text-gray-200 text-center transition-all shadow-none"
            maxLength={10}
          />
        </div>
        <p className="text-[9px] text-gray-300 font-bold flex items-center gap-1 justify-center tracking-tighter">
           <CheckCircle className="w-2.5 h-2.5 text-gray-200" /> MTN, AIRTEL OR MoMo
        </p>
      </div>

      {/* Submit Button - Focused Action */}
      <div className="pt-1 w-full flex justify-center">
        <Button
          type="submit"
          disabled={isLoading || !phoneNumber}
          className="w-full max-w-[240px] bg-[#ffcc00] hover:bg-black hover:text-[#ffcc00] text-black font-black h-11 rounded-xl shadow-md transition-all active:scale-[0.98] text-xs border border-transparent"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span>Initiate Pay</span>
            </div>
          )}
        </Button>
      </div>

      {/* Semi-Info Box - Site Colors Smaller */}
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 relative overflow-hidden text-center">
        <p className="text-[10px] text-muted-foreground leading-tight font-medium">
          Confirm the <strong>MoMo prompt</strong> on your phone to complete. Success is automatic.
        </p>
      </div>
    </form>
  );
}
