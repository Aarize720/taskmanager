import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify connection configuration
if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
  transporter.verify((error, success) => {
    if (error) {
      console.log('❌ Email configuration error:', error);
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });
}

export default transporter;