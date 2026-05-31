import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { EmailModule } from "../email/email.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PasswordReset } from "./password-reset.entity";

@Module({
  imports: [
    UsersModule,
    EmailModule,
    TypeOrmModule.forFeature([PasswordReset]),
    JwtModule.register({
      secret: "ca5d924a04711ae040e1f9118f07908a7a1bcaa02c4337272d52afd7a7b9ea14",
      signOptions: { expiresIn: "7d" },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
