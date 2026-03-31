/**
 * Payment Controller
 * Handles payment initiation, status checks, and webhook processing
 */

import { Request, Response } from 'express';
import { PaymentTransaction } from '../models/PaymentTransaction';
import { createPaypackService } from '../services/paypack.service';

// Extend Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
      rawBody?: Buffer | string;
    }
  }
}

interface PaymentInitiateBody {
  amount: number;
  phoneNumber: string;
  description?: string;
  courseId?: string;
  subscriptionId?: string;
}

class PaymentController {
  private paypackService = createPaypackService();

  /**
   * Initiate a payment (CASHIN) from user
   * POST /api/payments/initiate
   */
  async initiatePayment(req: Request, res: Response) {
    try {
      const userId = req.user?.id || req.user?._id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { amount, phoneNumber, description, courseId, subscriptionId } =
        req.body as PaymentInitiateBody;

      // Validate input
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
      }

      if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
      }

      // Normalize phone number (handle both 078... and +250... formats)
      const normalizedPhone = phoneNumber.startsWith('+250')
        ? '0' + phoneNumber.slice(4)
        : phoneNumber;

      // Initiate payment with Paypack
      const paypackResponse = await this.paypackService.initiatePayment({
        amount: Math.floor(amount), // Ensure integer
        number: normalizedPhone,
      });

      // Persist transaction with Paypack reference from the start.
      const normalizedInitialStatus = this.paypackService.normalizeStatus(
        paypackResponse.status
      );

      const paymentTransaction = new PaymentTransaction({
        userId,
        type: 'CASHIN',
        amount,
        phoneNumber: normalizedPhone,
        status: normalizedInitialStatus,
        paypackRef: paypackResponse.ref,
        description,
        courseId: courseId || null,
        subscriptionId: subscriptionId || null,
      });

      await paymentTransaction.save();

      return res.status(201).json({
        message: 'Payment initiated successfully',
        transactionId: paymentTransaction._id,
        paypackRef: paypackResponse.ref,
        amount: paypackResponse.amount,
        status: normalizedInitialStatus,
        instructions:
          'You will receive a USSD prompt on your phone. Please follow the on-screen instructions to complete the payment.',
      });
    } catch (error) {
      console.error('Payment initiation error:', error);
      return res.status(500).json({
        error: 'Failed to initiate payment',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get payment transaction status
   * GET /api/payments/:transactionId
   */
  async getPaymentStatus(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      const userId = req.user?.id || req.user?._id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Find transaction
      const transaction = await PaymentTransaction.findById(transactionId);
      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      // Verify ownership
      if (transaction.userId.toString() !== userId.toString()) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Get latest status from Paypack
      try {
        const paypackStatus = await this.paypackService.getTransactionStatus(
          transaction.paypackRef
        );

        // Update local status if different
        const normalizedStatus = this.paypackService.normalizeStatus(
          paypackStatus.status
        );

        if (normalizedStatus !== transaction.status) {
          transaction.status = normalizedStatus as any;
          transaction.processedAt = new Date();
          await transaction.save();

          // Handle post-payment actions
          if (normalizedStatus === 'successful') {
            await this.handleSuccessfulPayment(transaction);
          }
        }

        return res.json({
          transactionId,
          amount: transaction.amount,
          fee: transaction.fee,
          status: transaction.status,
          paypackRef: transaction.paypackRef,
          createdAt: transaction.createdAt,
          processedAt: transaction.processedAt,
        });
      } catch (paypackError) {
        // If Paypack API fails, return local status
        console.error('Failed to fetch Paypack status:', paypackError);
        return res.json({
          transactionId,
          amount: transaction.amount,
          fee: transaction.fee,
          status: transaction.status,
          paypackRef: transaction.paypackRef,
          createdAt: transaction.createdAt,
          processedAt: transaction.processedAt,
          note: 'Status from local cache (real-time check unavailable)',
        });
      }
    } catch (error) {
      console.error('Get payment status error:', error);
      return res.status(500).json({
        error: 'Failed to get payment status',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Webhook endpoint for Paypack transaction updates
   * POST /api/payments/webhook
   */
  async handleWebhook(req: Request, res: Response) {
    try {
      const signature = req.get('x-paypack-signature');
      if (!signature) {
        console.warn('Webhook received without signature');
        return res.status(400).json({ error: 'Missing signature' });
      }

      // Verify webhook signature
      let rawBody: string;
      if (req.rawBody instanceof Buffer) {
        rawBody = req.rawBody.toString();
      } else if (typeof req.rawBody === 'string') {
        rawBody = req.rawBody;
      } else {
        rawBody = JSON.stringify(req.body);
      }

      const isValid = this.paypackService.verifyWebhookSignature(
        rawBody,
        signature
      );

      if (!isValid) {
        console.warn('Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }

      // Parse webhook payload
      const webhookData = this.paypackService.parseWebhookPayload(req.body as any);

      // Find transaction by Paypack reference
      const transaction = await PaymentTransaction.findOne({
        paypackRef: webhookData.transactionRef,
      });

      if (!transaction) {
        console.warn(
          `Transaction not found for ref: ${webhookData.transactionRef}`
        );
        // Still return 200 to acknowledge receipt
        return res.json({ success: true });
      }

      // Update transaction status
      const previousStatus = transaction.status;
      transaction.status = webhookData.status;
      transaction.processedAt = new Date();
      transaction.fee = webhookData.fee;
      transaction.metadata = {
        ...(transaction.metadata as any),
        webhookReceivedAt: new Date().toISOString(),
      };

      await transaction.save();

      // Handle post-payment actions
      if (webhookData.status === 'successful' && previousStatus !== 'successful') {
        await this.handleSuccessfulPayment(transaction);
      }

      // Log webhook event
      console.log(`Payment webhook processed:`, {
        transactionRef: webhookData.transactionRef,
        status: webhookData.status,
        amount: webhookData.amount,
        dbTransactionId: transaction._id,
      });

      return res.json({ success: true });
    } catch (error) {
      console.error('Webhook processing error:', error);
      // Return 200 anyway to prevent Paypack retries
      return res.status(200).json({
        success: false,
        message: 'Internal processing error',
      });
    }
  }

  /**
   * Handle successful payment (enroll user in course, activate subscription, etc)
   */
  private async handleSuccessfulPayment(transaction: any): Promise<void> {
    try {
      // TODO: Implement your business logic here:
      // - If courseId: Enroll user in course
      // - If subscriptionId: Activate subscription
      // - Send success notification to user
      // - Send receipt email

      console.log(`Handling successful payment for transaction:`, {
        transactionId: transaction._id,
        userId: transaction.userId,
        courseId: transaction.courseId,
        subscriptionId: transaction.subscriptionId,
      });

      // Example: Emit event for other services to handle
      // eventEmitter.emit('payment:success', transaction);
    } catch (error) {
      console.error('Error handling successful payment:', error);
      // Don't throw - payment is already marked successful
    }
  }

  /**
   * Get user's payment history
   * GET /api/payments/
   */
  async getPaymentHistory(req: Request, res: Response) {
    try {
      const userId = req.user?.id || req.user?._id;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const page = parseInt((req.query.page as string) || '1');
      const limit = parseInt((req.query.limit as string) || '10');
      const status = req.query.status as string | undefined;

      const query: Record<string, any> = { userId };
      if (status) {
        query.status = status;
      }

      const transactions = await PaymentTransaction.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

      const total = await PaymentTransaction.countDocuments(query);

      return res.json({
        transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Get payment history error:', error);
      return res.status(500).json({
        error: 'Failed to fetch payment history',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

export const paymentController = new PaymentController();
