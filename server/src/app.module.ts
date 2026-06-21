import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { AnalysisModule } from "./analysis/analysis.module";
import { AdminModule } from "./admin/admin.module";
import { HistoryModule } from "./history/history.module";
import { TokensModule } from "./tokens/tokens.module";
import { ExtensionModule } from "./extension/extension.module";
import { SearchModule } from "./search/search.module";
import { History } from "./history/history.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "fackjob_user",
      password: "fackjobdb21",
      database: "fakejob",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
      logging: false,
    }),
    UsersModule,
    AuthModule,
    AnalysisModule,
    AdminModule,
    HistoryModule,
    TokensModule,
    ExtensionModule,
    SearchModule,
  ],
})
export class AppModule {}
