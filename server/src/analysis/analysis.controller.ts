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
import { CloudinaryService } from "../cloudinary/cloudinary.service";

class TextDto {
  text!: string;
}

@Controller("analysis")
export class AnalysisController {
  constructor(
    private svc: AnalysisService,
    private queue: JobQueueService,
    private cloudinaryService: CloudinaryService,
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
    
    try {
      // Upload PDF to Cloudinary
      const pdfUrl = await this.cloudinaryService.uploadPdf(file.buffer, 'analysis');
      return this.svc.analyzePdf(file.buffer, userId, pdfUrl);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      return { error: "Failed to upload PDF" };
    }
  }

  @Post("pdf-async")
  @UseInterceptors(FileInterceptor("file"))
  async enqueuePdf(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const userId = req.user?.sub;
    if (!file) return { error: "no file uploaded" };
    
    try {
      // Upload PDF to Cloudinary
      const pdfUrl = await this.cloudinaryService.uploadPdf(file.buffer, 'analysis');
      
      const id =
        Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
      // enqueue job with PDF URL
      this.queue.enqueue({ id, buffer: file.buffer, userId, pdfUrl });
      return { jobId: id, status: "queued", pdfUrl };
    } catch (error) {
      console.error("Error uploading PDF:", error);
      return { error: "Failed to upload PDF" };
    }
  }
}
