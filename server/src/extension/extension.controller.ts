import { Controller, Get, Post, Put, Body, Req, Query, Param, UseGuards } from "@nestjs/common";
import { ExtensionService } from "./extension.service";
import { JwtAuthGuard } from "../common/jwt-auth.guard";

@Controller("extension")
@UseGuards(JwtAuthGuard)
export class ExtensionController {
  constructor(private extensionService: ExtensionService) {}

  // Extension Settings
  @Get("settings")
  async getSettings(@Req() req: any) {
    const userId = req.user?.sub;
    return this.extensionService.getSettings(userId);
  }

  @Put("settings")
  async updateSettings(
    @Req() req: any,
    @Body() body: { settings: any; deviceInfo?: any }
  ) {
    const userId = req.user?.sub;
    return this.extensionService.updateSettings(userId, body.settings, body.deviceInfo);
  }

  // Extension Scan History
  @Post("scan")
  async createScan(
    @Req() req: any,
    @Body() body: {
      url: string;
      scanType: "url" | "text" | "email";
      result: any;
      pageTitle?: string;
      domain?: string;
    }
  ) {
    const userId = req.user?.sub;
    return this.extensionService.createScan(userId, body);
  }

  @Get("scans")
  async getScanHistory(
    @Req() req: any,
    @Query("limit") limit?: string
  ) {
    const userId = req.user?.sub;
    return this.extensionService.getScanHistory(userId, limit ? parseInt(limit) : 50);
  }

  @Get("scans/:scanId")
  async getScanById(
    @Req() req: any,
    @Param("scanId") scanId: string
  ) {
    const userId = req.user?.sub;
    return this.extensionService.getScanById(userId, scanId);
  }

  // Extension Notifications
  @Get("notifications")
  async getNotifications(
    @Req() req: any,
    @Query("unreadOnly") unreadOnly?: string
  ) {
    const userId = req.user?.sub;
    return this.extensionService.getNotifications(userId, unreadOnly === "true");
  }

  @Put("notifications/:notificationId/read")
  async markNotificationAsRead(
    @Req() req: any,
    @Param("notificationId") notificationId: string
  ) {
    const userId = req.user?.sub;
    return this.extensionService.markNotificationAsRead(notificationId, userId);
  }

  @Put("notifications/read-all")
  async markAllAsRead(@Req() req: any) {
    const userId = req.user?.sub;
    return this.extensionService.markAllAsRead(userId);
  }

  @Get("notifications/unread-count")
  async getUnreadCount(@Req() req: any) {
    const userId = req.user?.sub;
    const count = await this.extensionService.getUnreadCount(userId);
    return { count };
  }

  // Extension Device Management
  @Put("device/heartbeat")
  async updateDeviceLastSeen(
    @Req() req: any,
    @Body() body: { deviceInfo: any }
  ) {
    const userId = req.user?.sub;
    return this.extensionService.updateDeviceLastSeen(userId, body.deviceInfo);
  }

  @Put("deactivate")
  async deactivateExtension(@Req() req: any) {
    const userId = req.user?.sub;
    return this.extensionService.deactivateExtension(userId);
  }
}
