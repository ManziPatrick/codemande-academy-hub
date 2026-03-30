import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Phone, DollarSign } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/env';

interface PaymentFormProps {
  amount: number;
  description: string;
  courseId?: string;
  subscriptionId?: string;
  onSuccess?: () => void;
}

export function PaymentForm({
  amount,
  description,
  courseId,
  subscriptionId,
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

      if (data.status === 'successful') {
        setPaymentStatus(null);
        toast.success('Payment successful! 🎉');
        onSuccess?.();
      } else if (data.status === 'failed') {
        setPaymentStatus(null);
        toast.error('Payment failed. Please try again.');
      } else if (data.status === 'pending') {
        // Keep polling
        setTimeout(() => {
          pollPaymentStatus(txId);
        }, 5000);
      }
    } catch (error) {
      console.error('Status check error:', error);
      // Don't show error - just stop polling
      setPaymentStatus(null);
    }
  };

  // Show status message while payment is pending
  if (transactionId && paymentStatus) {
    return (
      <div className="w-full max-w-md mx-auto p-6 border rounded-lg bg-blue-50 border-blue-200">
        <div className="flex items-center justify-center mb-4">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        </div>
        <h3 className="text-center font-semibold text-blue-900 mb-2">
          Payment Processing
        </h3>
        <p className="text-center text-sm text-blue-700 mb-4">
          Please complete the payment on your phone. This page will automatically update once payment is confirmed.
        </p>
        <p className="text-center text-xs text-blue-600">
          Transaction ID: {transactionId.substring(0, 8)}...
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setTransactionId(null);
            setPaymentStatus(null);
          }}
          className="w-full mt-4"
        >
          Dismiss
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleInitiatePayment} className="w-full max-w-md space-y-4">
      {/* Amount Display */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Amount to Pay:</span>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">
              {amount.toLocaleString()}
            </span>
            <span className="text-gray-500">RWF</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      </div>

      {/* Phone Number Input */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-gray-700 font-medium">
          Mobile Money Phone Number
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            id="phone"
            type="tel"
            placeholder="078xxxxxxx"
            value={phoneNumber}
            onChange={handlePhoneChange}
            disabled={isLoading}
            className="pl-10"
            maxLength={10}
          />
        </div>
        <p className="text-xs text-gray-500">
          Enter your MTN or Airtel phone number (078/079xxxxxxx)
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading || !phoneNumber}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Initiating Payment...
          </>
        ) : (
          <>
            <Phone className="w-4 h-4 mr-2" />
            Initiate Payment
          </>
        )}
      </Button>

      {/* Info Box */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-900">
          <strong>How it works:</strong> After clicking the button, you'll receive a USSD
          prompt on your phone. Follow the on-screen instructions to enter your PIN and
          complete the payment. Your browser will automatically update when payment is
          confirmed.
        </p>
      </div>
    </form>
  );
}
