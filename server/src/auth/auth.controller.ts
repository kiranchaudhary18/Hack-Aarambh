import { Body, Controller, Post, Get, Query, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";

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
}
