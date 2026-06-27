import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExtensionSettings } from "./extension.entity";
import { ExtensionScan } from "./extension-scan.entity";
import { ExtensionNotification, NotificationType, NotificationStatus } from "./extension-notification.entity";
import { UsersService } from "../users/users.service";

@Injectable()
export class ExtensionService {
  constructor(
    @InjectRepository(ExtensionSettings)
    private extensionSettingsRepo: Repository<ExtensionSettings>,
    @InjectRepository(ExtensionScan)
    private extensionScanRepo: Repository<ExtensionScan>,
    @InjectRepository(ExtensionNotification)
    private extensionNotificationRepo: Repository<ExtensionNotification>,
    private usersService: UsersService,
  ) {}

  // Extension Settings Management
  async getSettings(userId: string) {
    const settings = await this.extensionSettingsRepo.findOne({
      where: { userId },
    });
    return settings?.settings || {};
  }

  async updateSettings(userId: string, settings: any, deviceInfo?: any) {
    let extensionSettings = await this.extensionSettingsRepo.findOne({
      where: { userId },
    });

    if (!extensionSettings) {
      extensionSettings = this.extensionSettingsRepo.create({
        userId,
        settings,
        deviceInfo,
        isActive: true,
      });
    } else {
      extensionSettings.settings = { ...extensionSettings.settings, ...settings };
      if (deviceInfo) {
        extensionSettings.deviceInfo = { ...extensionSettings.deviceInfo, ...deviceInfo, lastSeen: new Date() };
      }
    }

    return this.extensionSettingsRepo.save(extensionSettings);
  }

  // Extension Scan History
  async createScan(userId: string, scanData: {
    url: string;
    scanType: "url" | "text" | "email";
    result: any;
    pageTitle?: string;
    domain?: string;
  }) {
    const scan = this.extensionScanRepo.create({
      userId,
      ...scanData,
      isScam: scanData.result.riskLevel === "scam",
    });

    const savedScan = await this.extensionScanRepo.save(scan);

    // Create notification for scam detection
    if (savedScan.isScam) {
      await this.createNotification(userId, {
        type: NotificationType.SCAM_ALERT,
        title: "Scam Detected",
        message: `Potential scam detected at ${scanData.domain || scanData.url}`,
        data: {
          url: scanData.url,
          riskScore: scanData.result.riskScore,
          scanId: savedScan.id,
        },
        metadata: {
          source: "extension",
          priority: "high",
        },
      });
    }

    return savedScan;
  }

  async getScanHistory(userId: string, limit = 50) {
    return this.extensionScanRepo.find({
      where: { userId },
      order: { createdAt: "DESC" },
      take: limit,
    });
  }

  async getScanById(userId: string, scanId: string) {
    return this.extensionScanRepo.findOne({
      where: { id: scanId, userId },
    });
  }

  // Extension Notifications
  async createNotification(userId: string, notificationData: {
    type: NotificationType;
    title: string;
    message: string;
    data?: any;
    metadata?: any;
  }) {
    const notification = this.extensionNotificationRepo.create({
      userId,
      ...notificationData,
      status: NotificationStatus.PENDING,
      read: false,
    });

    return this.extensionNotificationRepo.save(notification);
  }

  async getNotifications(userId: string, unreadOnly = false) {
    const where: any = { userId };
    if (unreadOnly) {
      where.read = false;
    }

    return this.extensionNotificationRepo.find({
      where,
      order: { createdAt: "DESC" },
      take: 50,
    });
  }

  async markNotificationAsRead(notificationId: string, userId: string) {
    const notification = await this.extensionNotificationRepo.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new Error("Notification not found");
    }

    notification.read = true;
    notification.status = NotificationStatus.READ;
    notification.readAt = new Date();

    return this.extensionNotificationRepo.save(notification);
  }

  async markAllAsRead(userId: string) {
    await this.extensionNotificationRepo.update(
      { userId, read: false },
      { read: true, status: NotificationStatus.READ, readAt: new Date() }
    );
  }

  async getUnreadCount(userId: string) {
    return this.extensionNotificationRepo.count({
      where: { userId, read: false },
    });
  }

  // Extension Device Management
  async updateDeviceLastSeen(userId: string, deviceInfo: any) {
    const settings = await this.extensionSettingsRepo.findOne({
      where: { userId },
    });

    if (settings) {
      settings.deviceInfo = { ...settings.deviceInfo, ...deviceInfo, lastSeen: new Date() };
      return this.extensionSettingsRepo.save(settings);
    }

    return null;
  }

  async deactivateExtension(userId: string) {
    const settings = await this.extensionSettingsRepo.findOne({
      where: { userId },
    });

    if (settings) {
      settings.isActive = false;
      return this.extensionSettingsRepo.save(settings);
    }

    return null;
  }
}
