import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "../email/email.service";
import { TwoFactorService } from "./two-factor.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PasswordReset } from "./password-reset.entity";
import { EmailVerification } from "../email/email-verification.entity";
import { EmailUpdateVerification } from "./email-update-verification.entity";

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
    private email: EmailService,
    private twoFactorService: TwoFactorService,
    @InjectRepository(PasswordReset) private passwordResetRepo: Repository<PasswordReset>,
    @InjectRepository(EmailVerification) private emailVerificationRepo: Repository<EmailVerification>,
    @InjectRepository(EmailUpdateVerification) private emailUpdateVerificationRepo: Repository<EmailUpdateVerification>,
  ) {}

  async register(email: string, password: string, name?: string) {
    console.log("AuthService.register called with:", { email, name });
    try {
      console.log("Checking if email exists...");
      const existing = await this.users.findByEmail(email);
      
      if (existing) {
        console.log("Email already exists, checking verification status");
        // If user exists but is not verified, allow re-registration
        if (!existing.isVerified) {
          console.log("User not verified, deleting old account and creating new one");
          // Delete associated password reset entries
          await this.passwordResetRepo.delete({ userId: existing.id });
          // Delete associated email verification entries
          await this.emailVerificationRepo.delete({ userId: existing.id });
          // Delete old user
          await this.users["repo"].delete({ id: existing.id });
        } else {
          console.log("Email already in use and verified");
          throw new UnauthorizedException("Email already in use");
        }
      }
      
      console.log("Creating user...");
      const user = await this.users.create(email, password, name);
      console.log("User created:", { id: user.id, email: user.email });

      // Generate verification token
      const token = this.generateVerificationToken();

      // Calculate expiry (24 hours from now)
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      // Store verification token
      await this.emailVerificationRepo.save({
        userId: user.id,
        token,
        expiresAt,
        used: false,
      });

      // Send verification email
      await this.email.sendVerificationEmail(email, token);

      console.log("Verification email sent");

      return {
        success: true,
        message: "Registration successful. Please check your email to verify your account.",
        user: { id: user.id, email: user.email }
      };
    } catch (error) {
      console.error("Error in register:", error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    // Check if email is verified
    if (!user.isVerified) {
      throw new UnauthorizedException("Please verify your email before logging in");
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");
    const token = this.sign(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email }, token };
  }

  async verifyEmail(token: string) {
    const verification = await this.emailVerificationRepo.findOne({
      where: { token, used: false },
    });

    if (!verification || verification.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired verification token");
    }

    // Update user verification status
    const user = await this.users["repo"].findOne({ where: { id: verification.userId } });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    user.isVerified = true;
    await this.users["repo"].save(user);

    // Mark token as used
    verification.used = true;
    await this.emailVerificationRepo.save(verification);

    return { success: true, message: "Email verified successfully" };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Email not found");
    }

    if (user.isVerified) {
      throw new UnauthorizedException("Email is already verified");
    }

    // Generate new verification token
    const token = this.generateVerificationToken();

    // Calculate expiry (24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Store verification token
    await this.emailVerificationRepo.save({
      userId: user.id,
      token,
      expiresAt,
      used: false,
    });

    // Send verification email
    await this.email.sendVerificationEmail(email, token);

    return { success: true, message: "Verification email sent" };
  }

  sign(id: string, email: string, role: string) {
    return this.jwt.sign({ sub: id, email, role });
  }

  async forgotPassword(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Email not found");
    }

    // Generate 6-digit alphanumeric code
    const code = this.generateCode();

    // Calculate expiry (1 minute from now)
    const expiresAt = new Date(Date.now() + 1 * 60 * 1000);

    // Store in database
    await this.passwordResetRepo.save({
      userId: user.id,
      code,
      expiresAt,
      used: false,
    });

    // Send email
    await this.email.sendPasswordResetCode(email, code);

    return { success: true, message: "Code sent to email" };
  }

  async verifyCode(email: string, code: string) {
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Email not found");
    }

    const resetRecord = await this.passwordResetRepo.findOne({
      where: {
        userId: user.id,
        code,
        used: false,
      },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired code");
    }

    return { success: true, message: "Code verified" };
  }

  async resetPassword(email: string, code: string, newPassword: string, confirmPassword: string) {
    if (newPassword !== confirmPassword) {
      throw new UnauthorizedException("Passwords do not match");
    }

    // Validate password requirements
    if (!this.validatePassword(newPassword)) {
      throw new UnauthorizedException(
        "Password must be at least 8 characters with uppercase, unique letter, and number",
      );
    }

    const user = await this.users.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException("Email not found");
    }

    // Verify code again
    const resetRecord = await this.passwordResetRepo.findOne({
      where: {
        userId: user.id,
        code,
        used: false,
      },
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired code");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await this.users.updateProfile(user.id, { name: user.name });
    // Direct update since updateProfile doesn't handle password
    user.password = hashedPassword;
    await this.users["repo"].save(user);

    // Mark code as used
    resetRecord.used = true;
    await this.passwordResetRepo.save(resetRecord);

    return { success: true, message: "Password updated successfully" };
  }

  private generateVerificationToken(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }

  private generateCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed I, O, 0, 1 for clarity
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  private validatePassword(password: string): boolean {
    // Minimum 8 characters
    if (password.length < 8) return false;

    // At least 1 uppercase letter
    if (!/[A-Z]/.test(password)) return false;

    // At least 1 number
    if (!/[0-9]/.test(password)) return false;

    // Check for unique letter (not repeated)
    const letters = password.replace(/[^a-zA-Z]/g, "");
    const uniqueLetters = new Set(letters.split(""));
    if (uniqueLetters.size < 2) return false;

    return true;
  }

  async requestEmailUpdate(userId: string, newEmail: string) {
    // Check if new email already exists
    const existingUser = await this.users.findByEmail(newEmail);
    if (existingUser) {
      throw new UnauthorizedException("Email already in use");
    }

    // Generate verification token
    const token = this.generateVerificationToken();

    // Calculate expiry (24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Store verification token
    await this.emailUpdateVerificationRepo.save({
      userId,
      newEmail,
      token,
      expiresAt,
      used: false,
    });

    // Send verification email
    await this.email.sendEmailUpdateVerification(newEmail, token);

    return { success: true, message: "Verification email sent to new email address" };
  }

  async verifyEmailUpdate(token: string) {
    const verification = await this.emailUpdateVerificationRepo.findOne({
      where: { token, used: false },
    });

    if (!verification || verification.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired verification token");
    }

    // Get user
    const user = await this.users["repo"].findOne({ where: { id: verification.userId } });
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Update user email
    user.email = verification.newEmail;
    user.isVerified = false; // Require re-verification after email change
    await this.users["repo"].save(user);

    // Mark token as used
    verification.used = true;
    await this.emailUpdateVerificationRepo.save(verification);

    return { success: true, message: "Email updated successfully. Please verify your new email." };
  }

  // 2FA Methods
  async setupTwoFactor(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Generate secret
    const secret = this.twoFactorService.generateSecret();
    const qrCodeUrl = this.twoFactorService.generateQRCodeUrl(secret, user.email);

    // Temporarily store secret (not enabled yet)
    user.twoFactorSecret = secret;
    await this.users["repo"].save(user);

    return {
      secret: secret,
      qrCodeUrl: qrCodeUrl,
    };
  }

  async verifyAndEnableTwoFactor(userId: string, token: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (!user.twoFactorSecret) {
      throw new UnauthorizedException("2FA setup not initiated");
    }

    // Verify token
    const isValid = this.twoFactorService.verifyToken(user.twoFactorSecret, token);
    if (!isValid) {
      throw new UnauthorizedException("Invalid 2FA token");
    }

    // Generate backup codes
    const backupCodes = this.twoFactorService.generateBackupCodes();

    // Enable 2FA
    user.twoFactorEnabled = true;
    user.twoFactorBackupCodes = backupCodes;
    await this.users["repo"].save(user);

    return {
      success: true,
      message: "2FA enabled successfully",
      backupCodes: backupCodes,
    };
  }

  async disableTwoFactor(userId: string, password: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    user.twoFactorBackupCodes = [];
    await this.users["repo"].save(user);

    return {
      success: true,
      message: "2FA disabled successfully",
    };
  }

  async regenerateBackupCodes(userId: string, password: string) {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    if (!user.twoFactorEnabled) {
      throw new UnauthorizedException("2FA is not enabled");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid password");
    }

    // Generate new backup codes
    const backupCodes = this.twoFactorService.generateBackupCodes();
    user.twoFactorBackupCodes = backupCodes;
    await this.users["repo"].save(user);

    return {
      success: true,
      message: "Backup codes regenerated successfully",
      backupCodes: backupCodes,
    };
  }

  async loginWithTwoFactor(email: string, password: string, twoFactorToken?: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");

    // Check if email is verified
    if (!user.isVerified) {
      throw new UnauthorizedException("Please verify your email before logging in");
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      if (!twoFactorToken) {
        return {
          requiresTwoFactor: true,
          message: "2FA token required",
        };
      }

      // Verify 2FA token
      const isValidToken = this.twoFactorService.verifyToken(user.twoFactorSecret!, twoFactorToken);
      const isValidBackup = this.twoFactorService.verifyBackupCode(
        user.twoFactorBackupCodes as string[],
        twoFactorToken,
      );

      if (!isValidToken && !isValidBackup) {
        throw new UnauthorizedException("Invalid 2FA token");
      }

      // If backup code was used, remove it
      if (isValidBackup) {
        user.twoFactorBackupCodes = this.twoFactorService.removeBackupCode(
          user.twoFactorBackupCodes as string[],
          twoFactorToken,
        );
        await this.users["repo"].save(user);
      }
    }

    const token = this.sign(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email, twoFactorEnabled: user.twoFactorEnabled }, token };
  }
}
