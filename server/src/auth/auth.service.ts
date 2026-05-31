import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "../email/email.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PasswordReset } from "./password-reset.entity";

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
    private email: EmailService,
    @InjectRepository(PasswordReset) private passwordResetRepo: Repository<PasswordReset>,
  ) {}

  async register(email: string, password: string, name?: string) {
    console.log("AuthService.register called with:", { email, name });
    try {
      console.log("Checking if email exists...");
      const existing = await this.users.findByEmail(email);
      if (existing) {
        console.log("Email already in use");
        throw new UnauthorizedException("Email already in use");
      }
      console.log("Creating user...");
      const user = await this.users.create(email, password, name);
      console.log("User created:", { id: user.id, email: user.email });
      console.log("Generating token...");
      const token = this.sign(user.id, user.email, user.role);
      console.log("Token generated successfully");
      return { user: { id: user.id, email: user.email }, token };
    } catch (error) {
      console.error("Error in register:", error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");
    const token = this.sign(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email }, token };
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
}
