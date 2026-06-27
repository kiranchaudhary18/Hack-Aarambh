import { Body, Controller, Post, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";

class RegisterDto {
  email!: string;
  password!: string;
  name?: string;
}

class LoginDto {
  email!: string;
  password!: string;
}

class ForgotPasswordDto {
  email!: string;
}

class VerifyCodeDto {
  email!: string;
  code!: string;
}

class ResetPasswordDto {
  email!: string;
  code!: string;
  newPassword!: string;
  confirmPassword!: string;
}

class ResendVerificationDto {
  email!: string;
}

class RequestEmailUpdateDto {
  newEmail!: string;
}

class TwoFactorSetupDto {
  token!: string;
}

class TwoFactorVerifyDto {
  token!: string;
}

class TwoFactorLoginDto {
  email!: string;
  password!: string;
  twoFactorToken?: string;
}

class TwoFactorDisableDto {
  password!: string;
}

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("register")
  register(@Body() body: RegisterDto, @Req() req: any) {
    console.log("Register request body:", body);
    if (!body.email || !body.password) {
      throw new Error("Email and password are required");
    }
    const origin = req.headers.origin || req.headers.referer;
    const sanitizedOrigin = origin ? origin.replace(/\/$/, "") : undefined;
    return this.auth.register(body.email, body.password, body.name, sanitizedOrigin);
  }

  @Post("login")
  login(@Body() body: LoginDto) {
    return this.auth.login(body.email, body.password);
  }

  @Get("verify-email")
  verifyEmail(@Query("token") token: string) {
    return this.auth.verifyEmail(token);
  }

  @Post("resend-verification")
  resendVerification(@Body() body: ResendVerificationDto, @Req() req: any) {
    const origin = req.headers.origin || req.headers.referer;
    const sanitizedOrigin = origin ? origin.replace(/\/$/, "") : undefined;
    return this.auth.resendVerificationEmail(body.email, sanitizedOrigin);
  }

  @Post("forgot-password")
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.auth.forgotPassword(body.email);
  }

  @Post("verify-code")
  verifyCode(@Body() body: VerifyCodeDto) {
    return this.auth.verifyCode(body.email, body.code);
  }

  @Post("reset-password")
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.auth.resetPassword(
      body.email,
      body.code,
      body.newPassword,
      body.confirmPassword,
    );
  }

  @Post("request-email-update")
  requestEmailUpdate(@Req() req: any, @Body() body: RequestEmailUpdateDto) {
    const userId = req.user?.sub;
    const origin = req.headers.origin || req.headers.referer;
    const sanitizedOrigin = origin ? origin.replace(/\/$/, "") : undefined;
    return this.auth.requestEmailUpdate(userId, body.newEmail, sanitizedOrigin);
  }

  @Get("verify-email-update")
  verifyEmailUpdate(@Query("token") token: string) {
    return this.auth.verifyEmailUpdate(token);
  }

  @Post("2fa/setup")
  @UseGuards(JwtAuthGuard)
  async setupTwoFactor(@Req() req: any) {
    const userId = req.user?.sub;
    return this.auth.setupTwoFactor(userId);
  }

  @Post("2fa/verify")
  @UseGuards(JwtAuthGuard)
  async verifyTwoFactor(@Req() req: any, @Body() body: TwoFactorSetupDto) {
    const userId = req.user?.sub;
    return this.auth.verifyAndEnableTwoFactor(userId, body.token);
  }

  @Post("2fa/disable")
  @UseGuards(JwtAuthGuard)
  async disableTwoFactor(@Req() req: any, @Body() body: TwoFactorDisableDto) {
    const userId = req.user?.sub;
    return this.auth.disableTwoFactor(userId, body.password);
  }

  @Post("2fa/backup-codes")
  @UseGuards(JwtAuthGuard)
  async regenerateBackupCodes(@Req() req: any, @Body() body: TwoFactorDisableDto) {
    const userId = req.user?.sub;
    return this.auth.regenerateBackupCodes(userId, body.password);
  }

  @Post("2fa/login")
  async loginWithTwoFactor(@Body() body: TwoFactorLoginDto) {
    return this.auth.loginWithTwoFactor(body.email, body.password, body.twoFactorToken);
  }
}
