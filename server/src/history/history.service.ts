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

  transformToFrontendFormat(record: History) {
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

    // Determine source
    let source: "text" | "pdf" | "url" = "text";
    if (record.pdfUrl) {
      source = "pdf";
    } else if (record.input?.startsWith("Job link:")) {
      source = "url";
    }

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
}
