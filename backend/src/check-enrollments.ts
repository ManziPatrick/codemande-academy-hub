import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Payment } from './models/Payment';
import { InternshipPayment } from './models/internship/Payment';

dotenv.config();

const checkEnrollments = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || '');
        console.log('Connected to MongoDB');

        const payments = await Payment.find().limit(5);
        console.log('Recent Standard Payments:', payments.length);
        
        const internshipPayments = await InternshipPayment.find().limit(5);
        console.log('Recent Internship Payments:', internshipPayments.length);

        await mongoose.connection.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkEnrollments();
