import { Injectable } from "@nestjs/common";
import * as speakeasy from "speakeasy";
import * as crypto from "crypto";

@Injectable()
export class TwoFactorService {
  // Generate a new TOTP secret for a user
  generateSecret(): string {
    return speakeasy.generateSecret({
      name: "ScamSniff",
      issuer: "ScamSniff",
    }).base32;
  }

  // Generate QR code URL for authenticator apps
  generateQRCodeUrl(secret: string, email: string): string {
    return speakeasy.otpauthURL({
      secret: secret,
      label: `ScamSniff (${email})`,
      issuer: "ScamSniff",
      encoding: "base32",
    });
  }

  // Verify a TOTP token
  verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: token,
      window: 2, // Allow 2 time steps (1 minute) for clock drift
    });
  }

  // Generate backup codes
  generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = crypto.randomBytes(4).toString("hex").toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  // Verify a backup code
  verifyBackupCode(storedCodes: string[], providedCode: string): boolean {
    const normalizedProvided = providedCode.replace(/\s/g, "").toUpperCase();
    return storedCodes.some(
      (code) => code.replace(/\s/g, "").toUpperCase() === normalizedProvided,
    );
  }

  // Remove used backup code from the list
  removeBackupCode(storedCodes: string[], usedCode: string): string[] {
    const normalizedUsed = usedCode.replace(/\s/g, "").toUpperCase();
    return storedCodes.filter(
      (code) => code.replace(/\s/g, "").toUpperCase() !== normalizedUsed,
    );
  }

  // Encrypt secret for storage (optional - for extra security)
  encryptSecret(secret: string): string {
    const algorithm = "aes-256-cbc";
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(secret, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}:${key.toString("hex")}`;
  }

  // Decrypt secret (optional - for extra security)
  decryptSecret(encryptedSecret: string): string {
    const algorithm = "aes-256-cbc";
    const [ivHex, encrypted, keyHex] = encryptedSecret.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const key = Buffer.from(keyHex, "hex");
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
