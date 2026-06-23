import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminGuard } from "../common/admin.guard";

@Controller("admin")
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private svc: AdminService) {}

  @Get("stats")
  async stats(@Req() req: any) {
    return this.svc.getStats();
  }

  @Get("flagged")
  async flagged(@Req() req: any) {
    return this.svc.getFlagged();
  }

  @Get("analytics")
  async analytics(@Req() req: any) {
    return this.svc.getAnalytics();
  }

  @Get("live-feed")
  async liveFeed(@Req() req: any) {
    return this.svc.getLiveFeed();
  }

  @Get("regions")
  async regions(@Req() req: any) {
    return this.svc.getRegions();
  }

  @Get("system-health")
  async systemHealth(@Req() req: any) {
    return this.svc.getSystemHealth();
  }
}
