import { Controller, Get, Req, Delete, Param } from "@nestjs/common";
import { HistoryService } from "./history.service";

@Controller("history")
export class HistoryController {
  constructor(private svc: HistoryService) {}

  @Get()
  async getAll(@Req() req: any) {
    const userId = req.user?.sub;
    return this.svc.getAll(userId);
  }

  @Get("analytics")
  async getAnalytics(@Req() req: any) {
    const userId = req.user?.sub;
    return this.svc.getAnalytics(userId);
  }

  @Get(":id")
  async getById(@Param("id") id: string, @Req() req: any) {
    const userId = req.user?.sub;
    return this.svc.getById(id, userId);
  }

  @Delete(":id")
  async delete(@Param("id") id: string, @Req() req: any) {
    const userId = req.user?.sub;
    return this.svc.delete(id, userId);
  }
}
