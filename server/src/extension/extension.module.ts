import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { AuthModule } from "../auth/auth.module";
import { ExtensionService } from "./extension.service";
import { ExtensionController } from "./extension.controller";
import { ExtensionGateway } from "./extension.gateway";
import { NotificationService } from "./notification.service";
import { ScamPatternService } from "./scam-pattern.service";
import { ExtensionSettings } from "./extension.entity";
import { ExtensionScan } from "./extension-scan.entity";
import { ExtensionNotification } from "./extension-notification.entity";
import { User } from "../users/user.entity";

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TypeOrmModule.forFeature([ExtensionSettings, ExtensionScan, ExtensionNotification, User]),
  ],
  providers: [ExtensionService, ExtensionGateway, NotificationService, ScamPatternService],
  controllers: [ExtensionController],
  exports: [ExtensionService, ExtensionGateway, NotificationService, ScamPatternService],
})
export class ExtensionModule {}
