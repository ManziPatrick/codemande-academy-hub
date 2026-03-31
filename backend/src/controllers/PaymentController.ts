/**
 * Payment Controller
 * Handles payment initiation, status checks, and webhook processing
 */

import { Request, Response } from 'express';
import { PaymentTransaction } from '../models/PaymentTransaction';
import { createPaypackService } from '../services/paypack.service';
import { User } from '../models/User';
import { Course } from '../models/Course';
import { Internship } from '../models/Internship';
import { Payment } from '../models/Payment';

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
  internshipProgramId?: string;
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

      const { amount, phoneNumber, description, courseId, subscriptionId, internshipProgramId } =
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
        internshipProgramId: internshipProgramId || null,
      });

      await paymentTransaction.save();

      // 3. Create a PENDING Payment record for immediate visibility in "Bills"
      const pendingPayment = new Payment({
        userId,
        amount: Math.floor(amount),
        currency: 'RWF',
        status: 'pending',
        paymentMethod: 'Paypack Mobile Money',
        transactionId: paypackResponse.ref, // Use Paypack ref as unique identifier
        type: courseId ? 'Course Enrollment' : (internshipProgramId ? 'Internship Fee' : 'Subscription Fee'),
        itemTitle: description || (courseId ? 'Course' : (internshipProgramId ? 'Internship' : 'Subscription')),
        courseId: courseId || undefined,
        internshipId: subscriptionId || undefined,
      });
      await pendingPayment.save();

      return res.status(201).json({
        message: 'Payment initiated successfully',
        transactionId: paymentTransaction._id,
        paypackRef: paypackResponse.ref,
        amount: paypackResponse.amount,
        status: normalizedInitialStatus,
        instructions: paypackResponse.user_message || paypackResponse.instructions || 'Follow the USSD prompt on your phone.',
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
  public getPaymentStatus = async (req: Request, res: Response) => {
    try {
      const { transactionId } = req.params;
      const userId = (req as any).user?.id || (req as any).user?._id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const transaction = await PaymentTransaction.findById(transactionId);

      if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
      }

      // Verify ownership
      if (transaction.userId.toString() !== userId.toString()) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // If status is already terminal, return it
      const terminalStatuses = ['successful', 'failed', 'cancelled', 'expired'];
      if (terminalStatuses.includes(transaction.status)) {
        // Double check if post-processing was done for successful payments
        if (transaction.status === 'successful' && !transaction.processedAt) {
          console.log(`Retrying post-payment processing for transaction ${transactionId}`);
          await this.handleSuccessfulPayment(transaction);
        }
        return res.json(this.formatTransactionResponse(transaction));
      }

        try {
          console.log(`Checking status for Paypack ref: ${transaction.paypackRef}`);
          const paypackStatus = await this.paypackService.getTransactionStatus(
            transaction.paypackRef
          );
          
          const normalizedStatus = this.paypackService.normalizeStatus(
            paypackStatus.status
          );

          console.log(`Paypack API status for ${transaction.paypackRef}: ${paypackStatus.status} -> ${normalizedStatus}`);

          if (normalizedStatus !== transaction.status) {
            transaction.status = normalizedStatus as any;
            
            if (normalizedStatus === 'successful') {
              await this.handleSuccessfulPayment(transaction);
            }
            
            if (terminalStatuses.includes(normalizedStatus)) {
              transaction.processedAt = new Date();
            }
            
            await transaction.save();
          }

          return res.json(this.formatTransactionResponse(transaction));
        } catch (error: any) {
          if (error.message === 'NOT_FOUND') {
            console.log(`Paypack ref ${transaction.paypackRef} not indexed yet. Returning current status: ${transaction.status}`);
          } else {
            console.error('Error fetching status from Paypack:', error.message);
          }
          // Fallback to current database status if API call or indexing fails
          return res.json({
            ...this.formatTransactionResponse(transaction),
            note: 'Real-time check currently unavailable (local cache used)',
          });
        }
    } catch (error) {
      console.error('Error in getPaymentStatus:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  private formatTransactionResponse(transaction: any) {
    return {
      transactionId: transaction._id,
      amount: transaction.amount,
      fee: transaction.fee,
      status: transaction.status,
      paypackRef: transaction.paypackRef,
      createdAt: transaction.createdAt,
      processedAt: transaction.processedAt,
      description: transaction.description,
    };
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
        console.warn('Invalid webhook signature. Signing failed for body:', rawBody.substring(0, 50));
        return res.status(401).json({ error: 'Invalid signature' });
      }

      console.log('Webhook signature valid. Processing payload...');

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
      const { userId, courseId, subscriptionId, internshipProgramId, amount, description } = transaction;

      console.log(`Handling successful payment for transaction:`, {
        transactionId: transaction._id,
        userId,
        courseId,
        subscriptionId,
        internshipProgramId
      });

      // 1. Update the Payment record (for accounting/history)
      try {
        // Find existing pending payment first (created during initiation)
        let paymentRecord = await Payment.findOne({ transactionId: transaction.paypackRef });
        
        if (paymentRecord) {
          paymentRecord.status = 'completed';
          await paymentRecord.save();
          console.log(`Payment record ${paymentRecord._id} updated to completed`);
        } else {
          // Fallback: create if it doesn't exist for some reason
          paymentRecord = new Payment({
            userId,
            amount,
            currency: 'RWF',
            status: 'completed',
            paymentMethod: 'Paypack Mobile Money',
            transactionId: transaction.paypackRef,
            type: courseId ? 'Course Enrollment' : (internshipProgramId ? 'Internship Fee' : 'Subscription Fee'),
            itemTitle: description || (courseId ? 'Course' : (internshipProgramId ? 'Internship' : 'Subscription')),
            courseId: courseId || undefined,
            internshipId: subscriptionId || undefined, 
          });
          await paymentRecord.save();
          console.log(`New payment record created for transaction ${transaction._id}`);
        }
      } catch (err) {
        console.error('Failed to update/create Payment record:', err);
      }

      // 2. Handle Course Enrollment
      if (courseId) {
        const [user, course] = await Promise.all([
          User.findById(userId),
          Course.findById(courseId)
        ]);

        if (user && course) {
          // Add course to user's enrolledCourses if not already there
          const courseIdStr = courseId.toString();
          const isEnrolled = user.enrolledCourses.some(id => id.toString() === courseIdStr);
          
          if (!isEnrolled) {
            user.enrolledCourses.push(courseId);
            await user.save();
          }

          // Add user to course's studentsEnrolled if not already there
          const userIdStr = userId.toString();
          const isUserInCourse = course.studentsEnrolled.some(id => id.toString() === userIdStr);
          
          if (!isUserInCourse) {
            course.studentsEnrolled.push(userId);
            await course.save();
          }

          console.log(`User ${userId} successfully enrolled in course ${courseId}`);
        }
      }

      // 3. Handle Internship / Program
      if (subscriptionId) {
        const internship = await Internship.findById(subscriptionId);
        if (internship) {
          internship.payment = {
            ...internship.payment,
            status: 'paid',
            paidAt: new Date(),
            amount: amount,
          };
          internship.status = 'enrolled'; 
          await internship.save();
          console.log(`Internship ${subscriptionId} marked as paid and enrolled`);
        }
      }
      
      // If payment was for a program fee (during application)
      if (internshipProgramId) {
        // Any logic for program-level payments?
        // E.g. we might want to flag the user as having paid for this program in their metadata
        await User.findByIdAndUpdate(userId, {
          $push: {
            activityLog: {
              action: 'PAID_PROGRAM_FEE',
              details: `Paid ${amount} RWF for program ${internshipProgramId}`,
              timestamp: new Date()
            }
          }
        });
      }

      transaction.processedAt = new Date();
      await transaction.save();
    } catch (error) {
      console.error('Error handling successful payment:', error);
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
