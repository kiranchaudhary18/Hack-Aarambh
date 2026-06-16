import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { History } from "../history/history.entity";
import { UsersService } from "../users/users.service";
import * as pdfParse from "pdf-parse";
import { PDFDocument } from "pdf-lib";
import { AIEngineService } from "./ai-engine.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import * as Tesseract from 'tesseract.js';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(History) private repo: Repository<History>,
    private aiEngine: AIEngineService,
    private usersService: UsersService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async analyzeText(input: string, userId?: string) {
    // Try AI engine first, fallback to basic scoring
    let result;
    try {
      const aiResult = await this.aiEngine.analyzeText(input);
      result = {
        isFake: aiResult.is_fake,
        score: aiResult.scam_score,
        reasons: aiResult.reasons,
      };
    } catch (error) {
      console.warn("AI engine failed, using fallback:", error);
      result = AnalysisService.score(input);
    }

    const rec = this.repo.create({ input, result, userId });
    await this.repo.save(rec);

    // Increment user's scan count
    if (userId) {
      await this.usersService.incrementScans(userId);
    }

    return result;
  }

  async analyzePdf(buffer: Buffer, userId?: string, jobId?: string, pdfUrl?: string) {
    let text = "";
    let parseMethod = "";

    // Try to repair PDF first if it's corrupted
    let repairedBuffer = buffer;
    try {
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pdfBytes = await pdfDoc.save();
      repairedBuffer = Buffer.from(pdfBytes);
    } catch (repairError: any) {
      // Continue with original buffer if repair fails
    }

    // Try pdf-parse with repaired buffer
    try {
      const parsed = await pdfParse(repairedBuffer);
      text = parsed.text || "";
      parseMethod = "pdf-parse (repaired)";
    } catch (pdfError: any) {
      console.error("PDF parsing failed:", pdfError?.message || pdfError);
      // Return error result if PDF cannot be parsed
      const errorResult = {
        isFake: false,
        score: 0,
        reasons: ["PDF file is corrupted or cannot be parsed. Please try a different file."],
      };
      const rec = this.repo.create({
        input: "[PDF parsing failed]",
        result: errorResult,
        userId,
        status: "failed",
        processedAt: new Date(),
        pdfUrl,
      });
      await this.repo.save(rec);
      return errorResult;
    }

    // Check if extracted text is too short (indicates parsing failure)
    if (text.length < 50) {
      const errorResult = {
        isFake: false,
        score: 0,
        reasons: ["Could not extract text from PDF. The file may be corrupted or password-protected."],
      };
      const rec = this.repo.create({
        input: text || "[Empty PDF]",
        result: errorResult,
        userId,
        status: "failed",
        processedAt: new Date(),
        pdfUrl,
      });
      await this.repo.save(rec);
      return errorResult;
    }

    // Try AI engine first, fallback to basic scoring
    let result;
    try {
      const aiResult = await this.aiEngine.analyzeText(text);
      result = {
        isFake: aiResult.is_fake,
        score: aiResult.scam_score,
        reasons: aiResult.reasons,
      };
    } catch (error) {
      console.warn("AI engine failed, using fallback:", error);
      result = AnalysisService.score(text);
    }

    // create or update history record: if jobId provided, link by id
    const rec = this.repo.create({
      input: text,
      result,
      userId,
      status: "processed",
      processedAt: new Date(),
      pdfUrl,
    });
    await this.repo.save(rec);

    // Increment user's scan count
    if (userId) {
      await this.usersService.incrementScans(userId);
    }

    return result;
  }

  static score(text: string) {
    const reasons: string[] = [];
    const lowered = text.toLowerCase();

    // salary pattern: look for large monthly/yearly amounts
    const salaryMatch = lowered.match(/\u20b9?\s?\d{2,3}[,\d]*/g);
    if (salaryMatch) {
      for (const s of salaryMatch) {
        const digits = s.replace(/[^0-9]/g, "");
        const v = Number(digits);
        if (v > 50000) {
          reasons.push("Unrealistic high salary for fresher");
          break;
        }
      }
    }

    if (
      lowered.includes("registration fee") ||
      lowered.includes("training fee") ||
      lowered.includes("pay now")
    ) {
      reasons.push("Asking for payment");
    }

    if (
      lowered.includes("gmail.com") ||
      lowered.includes("yahoo.com") ||
      lowered.includes("hotmail.com")
    ) {
      reasons.push("Unofficial email domain");
    }

    if (
      /(apply within|urgent|immediately|within 24 hours|quick response)/.test(
        lowered,
      )
    ) {
      reasons.push("Urgency pressure");
    }

    if (
      /(congratulations|you have been selected)/.test(lowered) &&
      lowered.includes("offer") &&
      !lowered.includes("interview")
    ) {
      reasons.push("Generic congratulatory wording without process");
    }

    if (
      (lowered.match(/[\.!?]/g) || []).length <
        Math.max(1, lowered.split("\n").length / 3) &&
      lowered.split(" ").length < 30
    ) {
      // very short or oddly punctuated
      reasons.push("Suspicious wording or poor formatting");
    }

    const score = Math.min(
      100,
      20 * reasons.length + AnalysisService.keywordScore(lowered),
    );
    return { isFake: score >= 50, score, reasons };
  }

  static keywordScore(lowered: string) {
    let s = 0;
    const suspicious = [
      "scam",
      "payment",
      "fee",
      "urgent",
      "immediate",
      "selected",
      "congratulations",
      "wire",
      "upi",
      "paytm",
    ];
    for (const w of suspicious) if (lowered.includes(w)) s += 5;
    return s;
  }

  async analyzeImage(base64Image: string, userId?: string) {
    try {
      // Convert base64 to buffer, strip data URI prefix if present
      const base64Data = base64Image.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      // Upload image to Cloudinary
      const imageUrl = await this.cloudinaryService.uploadImage(imageBuffer, 'analysis');

      // Extract text from image using OCR
      const { data: { text } } = await Tesseract.recognize(
        imageBuffer,
        'eng',
        {
          logger: (m: any) => console.log(m),
        }
      );

      if (!text || text.trim().length < 10) {
        const errorResult = {
          isFake: false,
          score: 0,
          reasons: ["Could not extract text from image. The image may be unclear or contain no readable text."],
        };
        
        const rec = this.repo.create({
          input: "[Image OCR failed]",
          result: errorResult,
          userId,
          status: "failed",
          processedAt: new Date(),
          imageUrl,
          analysisType: "image",
        });
        await this.repo.save(rec);
        
        return errorResult;
      }

      // Analyze the extracted text
      let result;
      try {
      const aiResult = await this.aiEngine.analyzeText(text);
      result = {
        isFake: aiResult.is_fake,
        score: aiResult.scam_score,
        reasons: aiResult.reasons,
      };
    } catch (error) {
      console.warn("AI engine failed for image text, using fallback:", error);
      result = AnalysisService.score(text);
    }

      // Save to history
      const rec = this.repo.create({
        input: text,
        result,
        userId,
        status: "processed",
        processedAt: new Date(),
        imageUrl,
        analysisType: "image",
      });
      await this.repo.save(rec);

      // Increment user's scan count
      if (userId) {
        await this.usersService.incrementScans(userId);
      }

      return result;
    } catch (error) {
      console.error("Error analyzing image:", error);
      throw new Error("Failed to analyze image");
    }
  }
}
