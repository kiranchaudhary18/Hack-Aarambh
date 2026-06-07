import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { History } from "../history/history.entity";
import * as pdfParse from "pdf-parse";
import { PDFDocument } from "pdf-lib";
import { AIEngineService } from "./ai-engine.service";
import { HistoryService } from "../history/history.service";

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(History) private repo: Repository<History>,
    private aiEngine: AIEngineService,
    private historyService: HistoryService,
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
      result = this.score(input);
    }

    const rec = this.repo.create({ input, result, userId });
    await this.repo.save(rec);
    return this.historyService.transformToFrontendFormat(rec);
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
      console.log("PDF repaired successfully using pdf-lib");
    } catch (repairError: any) {
      console.warn("PDF repair failed, trying original:", repairError?.message || repairError);
      // Continue with original buffer if repair fails
    }

    // Try pdf-parse with repaired buffer
    try {
      const parsed = await pdfParse(repairedBuffer);
      text = parsed.text || "";
      parseMethod = "pdf-parse (repaired)";
      console.log(`PDF parsed successfully, extracted ${text.length} characters`);
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
      return this.historyService.transformToFrontendFormat(rec);
    }

    // Check if extracted text is too short (indicates parsing failure)
    if (text.length < 50) {
      console.warn("Extracted PDF text is too short, may be corrupted");
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
      return this.historyService.transformToFrontendFormat(rec);
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
      result = this.score(text);
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
    return this.historyService.transformToFrontendFormat(rec);
  }

  score(text: string) {
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
      20 * reasons.length + this.keywordScore(lowered),
    );
    return { isFake: score >= 50, score, reasons };
  }

  keywordScore(lowered: string) {
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
}
