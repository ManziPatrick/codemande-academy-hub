import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any // Cast to any to avoid version mismatch errors with type definitions
});

export interface CreatePaymentIntentParams {
  amount: number; // Amount in smallest currency unit (e.g., cents for USD, francs for RWF)
  currency: string;
  userId: string;
  programId: string;
  programTitle: string;
  customerEmail: string;
  customerName: string;
}

export interface PaymentResult {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  error?: string;
}

/**
 * Create a Stripe Payment Intent for internship payment
 */
export const createPaymentIntent = async (params: CreatePaymentIntentParams): Promise<PaymentResult> => {
  try {
    const { amount, currency, userId, programId, programTitle, customerEmail, customerName } = params;

    // Create or retrieve customer
    let customer: Stripe.Customer;
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: customerEmail,
        name: customerName,
        metadata: {
          userId: userId
        }
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in smallest currency unit
      currency: currency.toLowerCase(),
      customer: customer.id,
      description: `Internship Program: ${programTitle}`,
      metadata: {
        userId: userId,
        programId: programId,
        programTitle: programTitle,
        type: 'internship_payment'
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret || undefined,
      paymentIntentId: paymentIntent.id
    };
  } catch (error: any) {
    console.error('Stripe Payment Intent Error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Confirm a payment was successful
 */
export const confirmPayment = async (paymentIntentId: string): Promise<{ success: boolean; status: string; error?: string }> => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    return {
      success: paymentIntent.status === 'succeeded',
      status: paymentIntent.status
    };
  } catch (error: any) {
    console.error('Stripe Confirm Payment Error:', error.message);
    return {
      success: false,
      status: 'error',
      error: error.message
    };
  }
};

/**
 * Process refund for a payment
 */
export const refundPayment = async (paymentIntentId: string, amount?: number): Promise<{ success: boolean; refundId?: string; error?: string }> => {
  try {
    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId
    };

    // Partial refund if amount specified
    if (amount) {
      refundParams.amount = amount;
    }

    const refund = await stripe.refunds.create(refundParams);

    return {
      success: refund.status === 'succeeded',
      refundId: refund.id
    };
  } catch (error: any) {
    console.error('Stripe Refund Error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Verify webhook signature from Stripe
 */
export const verifyWebhookSignature = (payload: Buffer, signature: string): Stripe.Event | null => {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    return event;
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return null;
  }
};

/**
 * Get payment details
 */
export const getPaymentDetails = async (paymentIntentId: string): Promise<Stripe.PaymentIntent | null> => {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error: any) {
    console.error('Error retrieving payment details:', error.message);
    return null;
  }
};

/**
 * Create a Checkout Session for redirecting to Stripe hosted page
 */
export const createCheckoutSession = async (params: {
  amount: number;
  currency: string;
  programId: string;
  programTitle: string;
  userId: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ success: boolean; sessionId?: string; url?: string; error?: string }> => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: params.customerEmail,
      line_items: [
        {
          price_data: {
            currency: params.currency.toLowerCase(),
            product_data: {
              name: params.programTitle,
              description: `Internship Program Enrollment Fee`
            },
            unit_amount: params.amount
          },
          quantity: 1
        }
      ],
      metadata: {
        userId: params.userId,
        programId: params.programId,
        type: 'internship_payment'
      },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl
    });

    return {
      success: true,
      sessionId: session.id,
      url: session.url || undefined
    };
  } catch (error: any) {
    console.error('Stripe Checkout Session Error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

export default stripe;
