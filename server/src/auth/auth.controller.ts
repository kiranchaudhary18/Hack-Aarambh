import { Body, Controller, Post } from "@nestjs/common";
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

@Controller("auth")
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post("register")
  register(@Body() body: RegisterDto) {
    console.log("Register request body:", body);
    if (!body.email || !body.password) {
      throw new Error("Email and password are required");
    }
    return this.auth.register(body.email, body.password, body.name);
  }

  @Post("login")
  login(@Body() body: LoginDto) {
    return this.auth.login(body.email, body.password);
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
    return this.auth.resetPassword(body.email, body.code, body.newPassword, body.confirmPassword);
  }
}
