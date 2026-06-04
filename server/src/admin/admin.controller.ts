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
}
