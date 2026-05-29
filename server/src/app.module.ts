import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { AnalysisModule } from "./analysis/analysis.module";
import { AdminModule } from "./admin/admin.module";
import { HistoryModule } from "./history/history.module";
import { History } from "./history/history.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as any) || "postgres",
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 5432),
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASS || "postgres",
      database: process.env.DB_NAME || "fakejob",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: process.env.TYPEORM_SYNC
        ? process.env.TYPEORM_SYNC === "true"
        : true,
    }),
    UsersModule,
    AuthModule,
    AnalysisModule,
    AdminModule,
    HistoryModule,
  ],
})
export class AppModule {}
