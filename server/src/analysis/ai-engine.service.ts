import { Injectable } from "@nestjs/common";
import { spawn } from "child_process";
import * as path from "path";

interface AIAnalysisResult {
  success: boolean;
  is_fake: boolean;
  scam_score: number;
  verdict: string;
  reasons: string[];
  detailed_reasons: any[];
  confidence: string;
}

interface Mark2Result {
  success: boolean;
  result?: {
    is_fake: boolean;
    score: number;
    confidence: number;
    routing_decision: string;
    reason: string;
    reasons: string[];
    text_scam_probability: number;
    doc_scam_probability: number;
  };
  error?: string;
}

@Injectable()
export class AIEngineService {
  /**
   * Call Mark-2 Python AI engine to analyze job offer text
   * Returns structured analysis result with scam score and reasons
   */
  async analyzeText(text: string): Promise<AIAnalysisResult> {
    return new Promise((resolve, reject) => {
      const pythonScriptPath = path.join(
        __dirname,
        "..",
        "ai-engine",
        "api",
        "predict.py",
      );

      // Spawn Python process with Mark-2 API
      const pythonProcess = spawn("python3", [pythonScriptPath, "--text", text]);

      let output = "";
      let error = "";

      pythonProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        error += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          // Fallback to rule-based scoring if Python fails
          console.warn(`Python process exited with code ${code}: ${error}`);
          return resolve(this.fallbackAnalysis(text));
        }

        try {
          const mark2Result: Mark2Result = JSON.parse(output);
          
          if (mark2Result.success && mark2Result.result) {
            // Convert Mark-2 result to legacy format
            resolve(this.convertMark2Result(mark2Result.result));
          } else {
            console.error("Mark-2 API returned error:", mark2Result.error);
            resolve(this.fallbackAnalysis(text));
          }
        } catch (e) {
          console.error("Error parsing Mark-2 result:", e);
          resolve(this.fallbackAnalysis(text));
        }
      });

      // Timeout after 30 seconds (Mark-2 may take longer)
      setTimeout(() => {
        pythonProcess.kill();
        reject(new Error("AI analysis timeout"));
      }, 30000);
    });
  }

  /**
   * Convert Mark-2 result format to legacy AIAnalysisResult format
   */
  private convertMark2Result(mark2Result: any): AIAnalysisResult {
    const score = mark2Result.score || 0;
    
    return {
      success: true,
      is_fake: mark2Result.is_fake || false,
      scam_score: score,
      verdict: this.getVerdict(score),
      reasons: mark2Result.reasons || [mark2Result.reason || "Analysis completed"],
      detailed_reasons: [
        {
          type: "routing_decision",
          message: mark2Result.routing_decision || "text_only",
        },
        {
          type: "confidence",
          message: `Confidence: ${mark2Result.confidence || 0}%`,
        },
        {
          type: "text_probability",
          message: `Text scam probability: ${(mark2Result.text_scam_probability * 100).toFixed(1)}%`,
        },
      ],
      confidence: this.getConfidenceLevel(mark2Result.confidence || 0),
    };
  }

  private getVerdict(score: number): string {
    if (score >= 70) return "Likely Scam";
    if (score >= 50) return "Suspicious";
    return "Likely Real";
  }

  private getConfidenceLevel(confidence: number): string {
    if (confidence >= 80) return "high";
    if (confidence >= 60) return "medium";
    return "low";
  }

  /**
   * Fallback to basic heuristic analysis if Python fails
   */
  private fallbackAnalysis(text: string): AIAnalysisResult {
    const score = this.calculateBasicScore(text);

    return {
      success: true,
      is_fake: score > 60,
      scam_score: score,
      verdict:
        score > 70 ? "Likely Scam" : score > 50 ? "Suspicious" : "Likely Real",
      reasons: this.extractBasicReasons(text),
      detailed_reasons: [],
      confidence: score > 80 || score < 20 ? "high" : "medium",
    };
  }

  private calculateBasicScore(text: string): number {
    let score = 0;
    const textLower = text.toLowerCase();

    // Payment keywords
    if (textLower.includes("pay") || textLower.includes("fee")) score += 20;
    if (textLower.includes("registration")) score += 15;

    // Urgency
    if (textLower.includes("urgent") || textLower.includes("limited time"))
      score += 15;

    // Salary suspicious patterns
    if (textLower.match(/₹\s*[0-9]{5,}/)) score += 15;

    // Email checks
    if (textLower.includes("gmail") || textLower.includes("yahoo")) score += 10;

    // Phrase checks
    if (
      textLower.includes("work from home") ||
      textLower.includes("easy money")
    )
      score += 10;

    return Math.min(score, 100);
  }

  private extractBasicReasons(text: string): string[] {
    const reasons: string[] = [];
    const textLower = text.toLowerCase();

    if (textLower.includes("pay") || textLower.includes("fee")) {
      reasons.push("Payment request detected");
    }
    if (textLower.includes("urgent")) {
      reasons.push("Urgency tactics detected");
    }
    if (textLower.match(/₹\s*[0-9]{5,}/)) {
      reasons.push("Unrealistic salary claim");
    }
    if (textLower.includes("gmail") || textLower.includes("yahoo")) {
      reasons.push("Free email domain used");
    }

    return reasons;
  }
}
