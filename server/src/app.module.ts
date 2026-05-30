import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { AnalysisModule } from "./analysis/analysis.module";
import { AdminModule } from "./admin/admin.module";
import { HistoryModule } from "./history/history.module";
import * as dotenv from "dotenv";

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      host: !process.env.DATABASE_URL ? (process.env.DB_HOST || "localhost") : undefined,
      port: !process.env.DATABASE_URL ? (process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432) : undefined,
      username: !process.env.DATABASE_URL ? (process.env.DB_USER || "fackjob_user") : undefined,
      password: !process.env.DATABASE_URL ? (process.env.DB_PASS || "fackjobdb21") : undefined,
      database: !process.env.DATABASE_URL ? (process.env.DB_NAME || "fakejob") : undefined,
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: process.env.TYPEORM_SYNC === "true",
      logging: false,
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
    }),
    UsersModule,
    AuthModule,
    AnalysisModule,
    AdminModule,
    HistoryModule,
  ],
})
export class AppModule {}
