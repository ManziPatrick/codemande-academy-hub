# Paypack Payment Integration Guide

This guide explains how to integrate Paypack mobile money payments into your Codemande Academy application.

## Overview

The Paypack integration allows users to pay for courses and subscriptions using their mobile money account (MTN, Airtel) via USSD prompts.

### Payment Flow

1. User enters amount and phone number
2. Frontend sends payment initiation request to backend
3. Backend calls Paypack API to create CASHIN transaction
4. User receives USSD prompt on their phone
5. User enters PIN to confirm payment
6. Paypack processes transaction and sends webhook
7. Backend receives webhook and updates payment status
8. User is automatically enrolled in course/subscription

## Environment Setup

### 1. Backend Environment Variables

Add these to your `.env` file:

```bash
# Paypack Configuration
PAYPACK_CLIENT_ID=your_client_id_here
PAYPACK_CLIENT_SECRET=your_client_secret_here
PAYPACK_WEBHOOK_SECRET=your_webhook_secret_here
PAYPACK_ENVIRONMENT=production  # or development for testing
PAYPACK_BASE_URL=https://payments.paypack.rw/api
```

### 2. Getting Paypack Credentials

1. Visit https://payments.paypack.rw
2. Create a Paypack merchant account
3. Create an Application with:
   - Privileges: `cashin`, `read` (for transaction lookup)
4. Copy the `client_id` and `client_secret`
5. Create a Webhook and copy the webhook secret

## Backend Integration

### 1. Register Payment Routes

In your main app file (e.g., `index.ts`), add:

```typescript
import paymentRoutes from './routes/PaymentRoutes';

// Add this with your other routes
app.use('/api/payments', paymentRoutes);
```

### 2. Configure Webhook Raw Body Capture

Make sure your Express app captures raw body for webhook signature verification:

```typescript
import express from 'express';

// Before parsing JSON
app.use(
  express.json({
    verify: (req, res, buf) => {
      (req as any).rawBody = buf;
    },
  })
);
```

### 3. Update User Model (Optional)

If you want to track payment method preferences:

```typescript
// In your User model
phoneNumber?: string;
preferredPaymentMethod?: 'mobile_money' | 'card';
```

## Frontend Integration

### 1. Use PaymentForm Component

In any page where you want to collect payment:

```tsx
import { PaymentForm } from '@/components/PaymentForm';

export function CourseEnrollmentPage() {
  const coursePrice = 50000; // RWF

  return (
    <div>
      <h2>Enroll in Course</h2>
      <PaymentForm
        amount={coursePrice}
        description="Advanced React Course"
        courseId="course-123"
        onSuccess={() => {
          // Redirect to course or refresh
          window.location.reload();
        }}
      />
    </div>
  );
}
```

### 2. Check Payment History

```tsx
// Fetch user's payment transactions
const response = await fetch('/api/payments?status=successful', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
const { transactions } = await response.json();
```

## API Endpoints

### POST `/api/payments/initiate`
Initiate a payment transaction

**Request:**
```json
{
  "amount": 50000,
  "phoneNumber": "078xxxxxxx",
  "description": "Advanced React Course",
  "courseId": "course-123",
  "subscriptionId": "optional"
}
```

**Response:**
```json
{
  "message": "Payment initiated successfully",
  "transactionId": "65abc123def456",
  "paypackRef": "d0bb2807-1d52-4795-b373-3feaf63dceb1",
  "amount": 50000,
  "status": "pending",
  "instructions": "You will receive a USSD prompt on your phone..."
}
```

### GET `/api/payments/:transactionId`
Get payment status

**Response:**
```json
{
  "transactionId": "65abc123def456",
  "amount": 50000,
  "fee": 115,
  "status": "pending|successful|failed",
  "paypackRef": "d0bb2807-1d52-4795-b373-3feaf63dceb1",
  "createdAt": "2024-03-30T10:30:00Z",
  "processedAt": "2024-03-30T10:35:00Z"
}
```

### GET `/api/payments/?status=successful`
Get user's payment history

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)
- `status` (pending|successful|failed)

**Response:**
```json
{
  "transactions": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

### POST `/api/payments/webhook`
Webhook endpoint for Paypack (called by Paypack servers)

## Security

### Webhook Signature Verification

The webhook endpoint automatically verifies signatures using HMAC-SHA256. The verification process:

1. Paypack sends `X-Paypack-Signature` header
2. Backend computes HMAC hash of request body using webhook secret
3. Compares computed hash with received signature
4. Only processes if signatures match

### Best Practices

1. **Always use HTTPS** - Webhooks must be delivered to HTTPS URLs
2. **Verify signatures** - The code does this automatically
3. **Idempotency** - The service uses idempotency keys to prevent duplicate charges
4. **Secure secrets** - Store `PAYPACK_CLIENT_SECRET` and `PAYPACK_WEBHOOK_SECRET` securely
5. **Rate limiting** - Implement rate limiting on payment endpoints
6. **Logging** - All transactions are logged for audit trails

## Testing

### Local Testing with localhost.run

To test webhooks on localhost:

```bash
ssh -R 80:localhost:3000 nokey@localhost.run
```

This exposes your localhost to the internet. Use the generated URL in Paypack dashboard.

### Test Transaction

1. Create payment with test phone number
2. In Paypack dashboard, navigate to Transaction Tester
3. Manually trigger a webhook
4. Verify your webhook endpoint receives it

## Troubleshooting

### "Transaction not found" Error

**Cause:** Webhook processed before transaction saved to database
**Solution:** Ensure database write completes before webhook is sent

### "Invalid signature" Error

**Cause:** Webhook secret mismatch
**Solution:** Verify `PAYPACK_WEBHOOK_SECRET` matches dashboard

### "Token expired" Error

**Cause:** Access token lifetime exceeded
**Solution:** Service automatically refreshes tokens; no action needed

### "Network error" in Frontend

**Cause:** CORS or API URL misconfiguration
**Solution:** Verify `VITE_API_URL` environment variable is set correctly

## Next Steps

1. **Implement Post-Payment Actions**
   - Update `handleSuccessfulPayment()` in PaymentController
   - Enroll user in course
   - Activate subscription
   - Send confirmation email

2. **Add Analytics**
   - Track payment success rates
   - Monitor revenue by course
   - Analyze user payment methods

3. **Improve UX**
   - Add payment confirmation page
   - Send SMS notifications
   - Implement payment receipts

4. **Handle Refunds**
   - Implement CASHOUT for refunds
   - Add refund request UI
   - Track refund status

## Support

For Paypack API questions: https://docs.paypack.rw
For issues with this integration, check the logs and verify environment variables.
