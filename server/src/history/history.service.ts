import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { History } from "./history.entity";

@Injectable()
export class HistoryService {
  constructor(@InjectRepository(History) private repo: Repository<History>) {}

  async getAll(userId?: string) {
    let records;
    if (userId) {
      records = await this.repo.find({
        where: { userId },
        order: { createdAt: "DESC" },
      });
    } else {
      records = await this.repo.find({ order: { createdAt: "DESC" } });
    }

    // Transform database records to match frontend expectations
    return records.map((record) => this.transformToFrontendFormat(record));
  }

  private transformToFrontendFormat(record: History) {
    const result = record.result || {};
    const isFake = result.isFake || false;
    const score = result.score || 0;
    const reasons = result.reasons || [];

    // Determine verdict based on score
    let verdict: "scam" | "suspicious" | "safe";
    if (score >= 60) {
      verdict = "scam";
    } else if (score >= 40) {
      verdict = "suspicious";
    } else {
      verdict = "safe";
    }

    // Extract title from input (first line or first 50 chars)
    const inputLines = record.input?.split('\n').filter(line => line.trim()) || [];
    const title = inputLines[0]?.substring(0, 100) || "Untitled Job";

    // Try to extract company from input (look for common patterns)
    const company = this.extractCompany(record.input) || "Unknown Company";

    // Format date
    const date = record.createdAt 
      ? new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : "Unknown date";

    // Create snippet from input
    const snippet = record.input?.substring(0, 150) || "";

    // Determine source (default to text, could be enhanced to detect pdf/url)
    const source: "text" | "pdf" | "url" = "text";

    // Transform reasons to match frontend format (with severity and detail)
    const transformedReasons = reasons.map((reason: string, index: number) => ({
      label: reason,
      severity: index < 2 ? "high" : index < 4 ? "med" : "low",
      detail: reason,
    }));

    return {
      id: record.id,
      title,
      company,
      date,
      verdict,
      score,
      source,
      snippet,
      reasons: transformedReasons,
    };
  }

  private extractCompany(input: string): string | null {
    if (!input) return null;
    
    const patterns = [
      /(?:at|@)\s+([A-Z][A-Za-z\s]+?)(?:\n|$|,|\.)/i,
      /(?:company|organization|firm)\s*[:\-]?\s*([A-Z][A-Za-z\s]+?)(?:\n|$|,|\.)/i,
      /^([A-Z][A-Za-z\s]+?)(?:\n|$)/i,
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match && match[1]) {
        const company = match[1].trim();
        if (company.length > 2 && company.length < 50) {
          return company;
        }
      }
    }

    return null;
  }

  async getById(id: string, userId?: string) {
    const query = this.repo
      .createQueryBuilder("history")
      .where("history.id = :id", { id });
    if (userId) {
      query.andWhere("history.userId = :userId", { userId });
    }
    const record = await query.getOne();
    if (!record) return null;
    return this.transformToFrontendFormat(record);
  }

  async delete(id: string, userId?: string) {
    const query = this.repo
      .createQueryBuilder("history")
      .where("history.id = :id", { id });
    if (userId) {
      query.andWhere("history.userId = :userId", { userId });
    }
    const result = await query.getOne();
    if (result) {
      await this.repo.remove(result);
    }
    return { success: true };
  }

  async getAnalytics(userId?: string) {
    let records;
    if (userId) {
      records = await this.repo.find({
        where: { userId },
        order: { createdAt: "DESC" },
      });
    } else {
      records = await this.repo.find({ order: { createdAt: "DESC" } });
    }

    const scamRecords = records.filter((r) => r.result?.isFake);
    const scamPatternMap = new Map<string, number>();

    // Analyze each scam record
    for (const record of scamRecords) {
      const reasons = record.result?.reasons || [];

      // Categorize scam patterns based on reasons
      for (const reason of reasons) {
        const lowerReason = reason.toLowerCase();
        let pattern = "Other";

        if (lowerReason.includes("fee") || lowerReason.includes("payment") || lowerReason.includes("pay")) {
          pattern = "Advance-fee fraud";
        } else if (lowerReason.includes("gmail") || lowerReason.includes("yahoo") || lowerReason.includes("hotmail")) {
          pattern = "Brand impersonation";
        } else if (lowerReason.includes("crypto") || lowerReason.includes("wallet") || lowerReason.includes("bitcoin")) {
          pattern = "Crypto wallet scam";
        } else if (lowerReason.includes("hr") || lowerReason.includes("call") || lowerReason.includes("interview")) {
          pattern = "Fake HR call";
        } else if (lowerReason.includes("salary") || lowerReason.includes("unrealistic")) {
          pattern = "Fake salary offer";
        } else if (lowerReason.includes("urgent") || lowerReason.includes("immediate")) {
          pattern = "Urgency tactics";
        }

        scamPatternMap.set(pattern, (scamPatternMap.get(pattern) || 0) + 1);
      }
    }

    // Convert scam pattern map to array
    const scamPatternData = Array.from(scamPatternMap.entries()).map(([name, value]) => ({
      name,
      value,
      color: this.getPatternColor(name),
    }));

    return {
      scamPatterns: scamPatternData,
    };
  }

  private getPatternColor(pattern: string): string {
    const colors: Record<string, string> = {
      "Advance-fee fraud": "oklch(0.62 0.18 295)",
      "Brand impersonation": "oklch(0.65 0.22 15)",
      "Crypto wallet scam": "oklch(0.74 0.16 60)",
      "Fake HR call": "oklch(0.72 0.16 155)",
      "Fake salary offer": "oklch(0.68 0.18 45)",
      "Urgency tactics": "oklch(0.78 0.14 25)",
      "Other": "oklch(0.82 0.1 230)",
    };
    return colors[pattern] || colors["Other"];
  }
}
