import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AnalysisService } from "./analysis.service";
import { JobQueueService } from "../queue/job-queue.service";

class TextDto {
  text!: string;
}

@Controller("analysis")
export class AnalysisController {
  constructor(
    private svc: AnalysisService,
    private queue: JobQueueService,
  ) {}

  @Post("text")
  analyzeText(@Body() body: TextDto, @Req() req: any) {
    const userId = req.user?.sub;
    return this.svc.analyzeText(body.text || "", userId);
  }

  @Post("pdf")
  @UseInterceptors(FileInterceptor("file"))
  async analyzePdf(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const userId = req.user?.sub;
    if (!file) return { error: "no file uploaded" };
    return this.svc.analyzePdf(file.buffer, userId);
  }

  @Post("pdf-async")
  @UseInterceptors(FileInterceptor("file"))
  async enqueuePdf(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const userId = req.user?.sub;
    if (!file) return { error: "no file uploaded" };
    const id =
      Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
    // enqueue job
    this.queue.enqueue({ id, buffer: file.buffer, userId });
    return { jobId: id, status: "queued" };
  }
}
