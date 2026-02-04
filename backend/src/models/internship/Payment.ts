import mongoose, { Schema, Document } from 'mongoose';

export interface IInternshipPayment extends Document {
  userId: mongoose.Types.ObjectId;
  internshipProgramId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'waived' | 'failed' | 'refunded';
  paymentMethod?: string;
  transactionId?: string;
  paidAt?: Date;
  invoiceId?: mongoose.Types.ObjectId;
  waivedBy?: mongoose.Types.ObjectId;
  waivedReason?: string;
  notes?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InternshipPaymentSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    internshipProgramId: {
      type: Schema.Types.ObjectId,
      ref: 'InternshipProgram',
      required: true,
      index: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      default: 'RWF',
      uppercase: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'waived', 'failed', 'refunded'],
      default: 'pending',
      required: true,
      index: true
    },
    paymentMethod: {
      type: String,
      trim: true
    },
    transactionId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true
    },
    paidAt: {
      type: Date
    },
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: 'InternshipInvoice'
    },
    waivedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    waivedReason: {
      type: String,
      trim: true
    },
    notes: {
      type: String,
      trim: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Compound index for unique user-program payment
InternshipPaymentSchema.index({ userId: 1, internshipProgramId: 1 }, { unique: true });

// Update paidAt when status changes to paid
// Update paidAt when status changes to paid
InternshipPaymentSchema.pre('save', async function() {
  if (this.isModified('status') && this.get('status') === 'paid' && !this.get('paidAt')) {
    this.set('paidAt', new Date());
  }
});

export const InternshipPayment = mongoose.model<IInternshipPayment>('InternshipPayment', InternshipPaymentSchema);
