import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email
 */
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // Skip sending if SMTP not configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('[Email] SMTP not configured, skipping email:', options.subject);
      return true; // Return true to not block flow
    }

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'CODEMANDE Academy <noreply@codemande.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, '')
    });

    console.log(`[Email] Sent successfully to ${options.to}: ${options.subject}`);
    return true;
  } catch (error: any) {
    console.error('[Email] Failed to send:', error.message);
    return false;
  }
};

// ========== EMAIL TEMPLATES ==========

/**
 * Send application confirmation email
 */
export const sendApplicationConfirmation = async (
  email: string,
  studentName: string,
  programTitle: string
): Promise<boolean> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 Application Received!</h1>
        </div>
        <div class="content">
          <h2>Hi ${studentName},</h2>
          <p>Thank you for applying to the <strong>${programTitle}</strong> internship program at CODEMANDE Academy!</p>
          <p>Your application has been received and is now under review. Here's what happens next:</p>
          <ol>
            <li>Our team will review your application within 3-5 business days</li>
            <li>You'll receive an email with the decision (approved/pending/waitlisted)</li>
            <li>If approved, you'll get instructions for the next steps</li>
          </ol>
          <p>In the meantime, make sure your profile is complete and up-to-date.</p>
          <a href="${process.env.CLIENT_ORIGIN}/portal/student/internships" class="btn">View Application Status</a>
        </div>
        <div class="footer">
          <p>© 2026 CODEMANDE Academy. Building Africa's Tech Talent.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Application Received: ${programTitle}`,
    html
  });
};

/**
 * Send application status update email
 */
export const sendApplicationStatusUpdate = async (
  email: string,
  studentName: string,
  programTitle: string,
  status: 'approved' | 'rejected' | 'waitlisted',
  message?: string
): Promise<boolean> => {
  const statusMessages = {
    approved: {
      title: '🎉 Congratulations! You\'re In!',
      color: '#22c55e',
      text: 'Your application has been approved! Welcome to the program.'
    },
    rejected: {
      title: 'Application Update',
      color: '#ef4444',
      text: 'Unfortunately, we are unable to offer you a place in this program at this time.'
    },
    waitlisted: {
      title: 'You\'re on the Waitlist',
      color: '#f59e0b',
      text: 'You have been placed on our waitlist. We\'ll notify you if a spot becomes available.'
    }
  };

  const { title, color, text } = statusMessages[status];

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${color}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
        </div>
        <div class="content">
          <h2>Hi ${studentName},</h2>
          <p>${text}</p>
          <p><strong>Program:</strong> ${programTitle}</p>
          ${message ? `<p><strong>Additional Notes:</strong> ${message}</p>` : ''}
          ${status === 'approved' ? `
            <p>Please complete the following steps:</p>
            <ol>
              <li>Complete any pending payments (if applicable)</li>
              <li>Complete your onboarding tasks</li>
              <li>Join your assigned team</li>
            </ol>
            <a href="${process.env.CLIENT_ORIGIN}/portal/student/internships" class="btn">Get Started</a>
          ` : ''}
        </div>
        <div class="footer">
          <p>© 2026 CODEMANDE Academy. Building Africa's Tech Talent.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Application Status: ${programTitle} - ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    html
  });
};

/**
 * Send payment confirmation email
 */
export const sendPaymentConfirmation = async (
  email: string,
  studentName: string,
  programTitle: string,
  amount: number,
  currency: string,
  invoiceNumber: string
): Promise<boolean> => {
  const formattedAmount = new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: currency
  }).format(amount);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .receipt { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Payment Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Hi ${studentName},</h2>
          <p>Thank you for your payment! Your enrollment in <strong>${programTitle}</strong> is now confirmed.</p>
          
          <div class="receipt">
            <h3>Payment Receipt</h3>
            <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
            <p><strong>Program:</strong> ${programTitle}</p>
            <p><strong>Amount Paid:</strong> ${formattedAmount}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p>You now have full access to the internship program. Log in to your portal to start your journey!</p>
        </div>
        <div class="footer">
          <p>© 2026 CODEMANDE Academy. Building Africa's Tech Talent.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Payment Confirmed - ${programTitle}`,
    html
  });
};

/**
 * Send certificate issued email
 */
export const sendCertificateIssued = async (
  email: string,
  studentName: string,
  programTitle: string,
  certificateNumber: string,
  verificationUrl: string
): Promise<boolean> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .certificate-box { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 20px 0; border: 2px solid #d97706; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏆 Certificate of Completion!</h1>
        </div>
        <div class="content">
          <h2>Congratulations, ${studentName}! 🎉</h2>
          <p>You have successfully completed the <strong>${programTitle}</strong> internship program!</p>
          
          <div class="certificate-box">
            <h3>🎓 Your Certificate</h3>
            <p><strong>Certificate #:</strong> ${certificateNumber}</p>
            <p><strong>Program:</strong> ${programTitle}</p>
            <p><strong>Issued:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p>Your certificate can be verified at:</p>
          <p><a href="${verificationUrl}">${verificationUrl}</a></p>
          
          <p>Share your achievement on LinkedIn and with potential employers!</p>
          
          <a href="${process.env.CLIENT_ORIGIN}/portal/student/certificates" class="btn">Download Certificate</a>
        </div>
        <div class="footer">
          <p>© 2026 CODEMANDE Academy. Building Africa's Tech Talent.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `🏆 Certificate Issued - ${programTitle}`,
    html
  });
};

/**
 * Send new feedback notification
 */
export const sendFeedbackNotification = async (
  email: string,
  studentName: string,
  mentorName: string,
  projectTitle: string
): Promise<boolean> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💬 New Feedback Received</h1>
        </div>
        <div class="content">
          <h2>Hi ${studentName},</h2>
          <p><strong>${mentorName}</strong> has provided feedback on your work for <strong>${projectTitle}</strong>.</p>
          <p>Log in to view the feedback and continue improving your skills!</p>
          <a href="${process.env.CLIENT_ORIGIN}/portal/student/internships" class="btn">View Feedback</a>
        </div>
        <div class="footer">
          <p>© 2026 CODEMANDE Academy. Building Africa's Tech Talent.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `New Feedback: ${projectTitle}`,
    html
  });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<boolean> => {
  const resetUrl = `${process.env.CLIENT_ORIGIN}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .btn { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .warning { background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 10px; margin: 20px 0; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Reset Your Password</h1>
        </div>
        <div class="content">
          <h2>Hello,</h2>
          <p>We received a request to reset the password for your CODEMANDE Academy account.</p>
          <p>If you made this request, please click the button below to choose a new password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="btn">Reset Password</a>
          </div>
          
          <p style="margin-top: 30px;">Or copy and paste this link into your browser:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          
          <div class="warning">
            <p><strong>Note:</strong> This link will expire in 1 hour.</p>
          </div>
          
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          <p>© 2026 CODEMANDE Academy. Building Africa's Tech Talent.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset Your Password - CODEMANDE Academy',
    html
  });
};

export default {
  sendEmail,
  sendApplicationConfirmation,
  sendApplicationStatusUpdate,
  sendPaymentConfirmation,
  sendCertificateIssued,
  sendFeedbackNotification,
  sendPasswordResetEmail
};
