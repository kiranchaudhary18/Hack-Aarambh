import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  Req,
  UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AnalysisService } from "./analysis.service";
import { JobQueueService } from "../queue/job-queue.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { TokensService } from "../tokens/tokens.service";

class TextDto {
  text!: string;
}

class ImageAnalysisDto {
  image!: string; // base64 encoded image
  apiToken!: string;
}

@Controller("analysis")
export class AnalysisController {
  constructor(
    private svc: AnalysisService,
    private queue: JobQueueService,
    private cloudinaryService: CloudinaryService,
    private tokensService: TokensService,
  ) {}

  @Post("text")
  @UseGuards(JwtAuthGuard)
  analyzeText(@Body() body: TextDto, @Req() req: any) {
    const userId = req.user?.sub;
    return this.svc.analyzeText(body.text || "", userId);
  }

  @Post("pdf")
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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

  @Post("image")
  async analyzeImage(@Body() body: ImageAnalysisDto) {
    try {
      // Validate API token
      const tokenValidation = await this.tokensService.validateToken(body.apiToken);
      
      // Analyze image (extract text via OCR and analyze)
      const result = await this.svc.analyzeImage(body.image, tokenValidation.userId);
      
      return {
        success: true,
        result,
        remaining: tokenValidation.remaining,
      };
    } catch (error: any) {
      console.error("Error analyzing image:", error);
      return {
        success: false,
        error: error.message || "Failed to analyze image",
      };
    }
  }
}
