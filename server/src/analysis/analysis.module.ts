import { Module } from "@nestjs/common";
import { AnalysisService } from "./analysis.service";
import { AnalysisController } from "./analysis.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { History } from "../history/history.entity";
import { JobQueueService } from "../queue/job-queue.service";
import { AIEngineService } from "./ai-engine.service";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";

@Module({
  imports: [TypeOrmModule.forFeature([History]), CloudinaryModule],
  providers: [AnalysisService, JobQueueService, AIEngineService],
  controllers: [AnalysisController],
  exports: [AnalysisService, JobQueueService],
})
export class AnalysisModule {}
