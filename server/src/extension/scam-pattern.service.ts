import { Injectable } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/user.entity";

@Injectable()
export class ScamPatternService {
  constructor(
    private notificationService: NotificationService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // Detect new scam patterns from analysis results
  async detectAndNotifyNewPatterns(newPatterns: Array<{
    pattern: string;
    description: string;
    severity: "low" | "medium" | "high";
    examples: string[];
  }>) {
    // Get all active users with extensions
    const users = await this.userRepo.find({
      where: { isVerified: true },
    });

    // Notify each user about new patterns
    for (const user of users) {
      for (const pattern of newPatterns) {
        await this.notificationService.sendPatternUpdate(user.id, pattern);
      }
    }

    return { notified: users.length, patterns: newPatterns.length };
  }

  // Push high-priority scam alerts to all users
  async broadcastHighPriorityScamAlert(alert: {
    url: string;
    riskScore: number;
    reasons: string[];
    pattern: string;
  }) {
    // Get all verified users
    const users = await this.userRepo.find({
      where: { isVerified: true },
    });

    // Send alert to all users
    for (const user of users) {
      await this.notificationService.sendScamAlert(user.id, {
        url: alert.url,
        riskScore: alert.riskScore,
        reasons: alert.reasons,
      });
    }

    return { notified: users.length };
  }

  // Monitor for emerging scam trends
  async analyzeScamTrends(timeframe: "hour" | "day" | "week" = "day") {
    // This would analyze recent scans to detect emerging patterns
    // For now, return placeholder data
    return {
      timeframe,
      topPatterns: [],
      emergingThreats: [],
      recommendations: [],
    };
  }

  // Create scam pattern from user report
  async createPatternFromReport(reportData: {
    userId: string;
    pattern: string;
    description: string;
    evidence: string[];
  }) {
    // Store pattern (would need a Pattern entity)
    // Notify admins for review
    // If approved, broadcast to all users

    return { status: "pending_review" };
  }
}
