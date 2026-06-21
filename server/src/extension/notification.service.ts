import { Injectable } from "@nestjs/common";
import { ExtensionGateway } from "./extension.gateway";
import { ExtensionService } from "./extension.service";
import { ExtensionNotification, NotificationType } from "./extension-notification.entity";

interface NotificationPreferences {
  scamPatternsDigest?: boolean;
  weeklyScanSummary?: boolean;
  productUpdates?: boolean;
  scamAlerts?: boolean;
  securityAlerts?: boolean;
  patternUpdates?: boolean;
  accountUpdates?: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  scamPatternsDigest: true,
  weeklyScanSummary: true,
  productUpdates: false,
  scamAlerts: true,
  securityAlerts: true,
  patternUpdates: true,
  accountUpdates: true,
};

@Injectable()
export class NotificationService {
  constructor(
    private extensionGateway: ExtensionGateway,
    private extensionService: ExtensionService,
  ) {}

  private async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const settings = await this.extensionService.getSettings(userId);
      return settings.notificationPreferences || DEFAULT_PREFERENCES;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      return DEFAULT_PREFERENCES;
    }
  }

  private shouldSendNotification(
    preferences: NotificationPreferences,
    notificationType: NotificationType,
  ): boolean {
    switch (notificationType) {
      case NotificationType.SCAM_ALERT:
        return preferences.scamAlerts !== false;
      case NotificationType.SECURITY_ALERT:
        return preferences.securityAlerts !== false;
      case NotificationType.PATTERN_UPDATE:
        return preferences.patternUpdates !== false;
      case NotificationType.ACCOUNT_UPDATE:
        return preferences.accountUpdates !== false;
      case NotificationType.SCAN_RESULT:
        return preferences.scamAlerts !== false;
      default:
        return true;
    }
  }

  // Send notification to specific user's extension
  async sendToUser(userId: string, notification: {
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
    metadata?: any;
  }) {
    // Check user preferences before sending
    const preferences = await this.getUserPreferences(userId);
    
    if (!this.shouldSendNotification(preferences, notification.type)) {
      console.log(`Notification type ${notification.type} disabled for user ${userId}`);
      return null;
    }

    // Store notification in database
    const savedNotification = await this.extensionService.createNotification(userId, notification);

    // Send real-time notification via WebSocket
    this.extensionGateway.sendNotificationToUser(userId, {
      id: savedNotification.id,
      ...notification,
      createdAt: savedNotification.createdAt,
    });

    // Update badge count
    const unreadCount = await this.extensionService.getUnreadCount(userId);
    this.extensionGateway.sendBadgeUpdate(userId, unreadCount);

    return savedNotification;
  }

  // Send scam alert to user's extension
  async sendScamAlert(userId: string, alert: {
    url: string;
    riskScore: number;
    reasons: string[];
    scanId?: string;
  }) {
    // Create notification
    await this.sendToUser(userId, {
      type: NotificationType.SCAM_ALERT,
      title: "Scam Detected",
      message: `Potential scam detected at ${alert.url}`,
      data: alert,
      metadata: {
        source: "site",
        priority: "high",
      },
    });

    // Send immediate alert via WebSocket
    this.extensionGateway.sendScamAlert(userId, alert);
  }

  // Send new scam pattern update to user's extension
  async sendPatternUpdate(userId: string, pattern: {
    pattern: string;
    description: string;
    severity: "low" | "medium" | "high";
  }) {
    await this.sendToUser(userId, {
      type: NotificationType.PATTERN_UPDATE,
      title: "New Scam Pattern Detected",
      message: `New scam pattern: ${pattern.pattern}`,
      data: pattern,
      metadata: {
        source: "site",
        priority: pattern.severity,
      },
    });

    this.extensionGateway.sendPatternUpdate(userId, pattern);
  }

  // Send security alert to user's extension
  async sendSecurityAlert(userId: string, alert: {
    type: string;
    message: string;
    actionUrl?: string;
  }) {
    await this.sendToUser(userId, {
      type: NotificationType.SECURITY_ALERT,
      title: "Security Alert",
      message: alert.message,
      data: alert,
      metadata: {
        source: "site",
        priority: "high",
      },
    });

    this.extensionGateway.sendSecurityAlert(userId, alert);
  }

  // Send account verification status update
  async sendAccountUpdate(userId: string, update: {
    type: "email_verified" | "password_changed" | "settings_updated";
    message: string;
  }) {
    await this.sendToUser(userId, {
      type: NotificationType.ACCOUNT_UPDATE,
      title: "Account Update",
      message: update.message,
      data: update,
      metadata: {
        source: "site",
        priority: "low",
      },
    });
  }

  // Broadcast notification to all users (for system-wide alerts)
  async broadcastToAll(notification: {
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
  }) {
    // This would require getting all users and sending to each
    // For now, implement as a placeholder
    console.log("Broadcast notification:", notification);
  }

  // Send scan result notification
  async sendScanResult(userId: string, result: {
    url: string;
    riskScore: number;
    riskLevel: "safe" | "suspicious" | "scam";
    scanId: string;
  }) {
    if (result.riskLevel === "scam") {
      await this.sendScamAlert(userId, {
        url: result.url,
        riskScore: result.riskScore,
        reasons: ["High risk detected"],
        scanId: result.scanId,
      });
    } else if (result.riskLevel === "suspicious") {
      await this.sendToUser(userId, {
        type: NotificationType.SCAN_RESULT,
        title: "Suspicious Content Detected",
        message: `Suspicious content found at ${result.url}`,
        data: result,
        metadata: {
          source: "site",
          priority: "medium",
        },
      });
    }
  }
}
