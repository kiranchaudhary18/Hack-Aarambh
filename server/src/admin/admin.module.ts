import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { History } from "../history/history.entity";
import { User } from "../users/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([History, User])],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
