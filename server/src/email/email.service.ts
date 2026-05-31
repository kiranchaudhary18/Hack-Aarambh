import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private useEthereal: boolean;

  constructor() {
    this.useEthereal = process.env.USE_ETHEREAL === "true";

    if (this.useEthereal) {
      // Use Ethereal Email for development/testing
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.ethereal.email",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    } else {
      // Use configured SMTP (Gmail, etc.)
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    }
  }

  async sendPasswordResetCode(email: string, code: string) {
    const mailOptions = {
      from: this.useEthereal
        ? "ScamSniff <sachaniyanarvin21@ethereal.email>"
        : process.env.SMTP_FROM || "ScamSniff <noreply@scamsniff.com>",
      to: email,
      subject: "ScamSniff - Password Reset Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, oklch(0.68 0.16 295), oklch(0.55 0.22 305)); padding: 30px; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">ScamSniff</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Password Reset</p>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 16px 16px; border: 1px solid #e5e7eb;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi there,</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">You requested a password reset for your ScamSniff account.</p>
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 2px solid oklch(0.68 0.16 295);">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">Your verification code is:</p>
              <p style="color: oklch(0.68 0.16 295); font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 0;">${code}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px;">This code expires in 1 minute.</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 20px;">If you didn't request this, please ignore this email.</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">- ScamSniff Team</p>
          </div>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`[EMAIL SERVICE] Password reset code sent to ${email}: ${code}`);
      console.log(`[EMAIL SERVICE] Code expires in 1 minute`);
      
      if (this.useEthereal) {
        console.log(`[EMAIL SERVICE] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }
}
