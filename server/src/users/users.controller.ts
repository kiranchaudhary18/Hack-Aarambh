import { Controller, Get, Put, Body, Req } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private svc: UsersService) {}

  @Get("profile")
  async getProfile(@Req() req: any) {
    const userId = req.user?.sub;
    const profile = await this.svc.getProfile(userId);
    if (!profile) {
      return { error: "User not found" };
    }
    return profile;
  }

  @Put("profile")
  async updateProfile(
    @Req() req: any,
    @Body() body: { name?: string; avatar?: string },
  ) {
    const userId = req.user?.sub;
    const profile = await this.svc.updateProfile(userId, body);
    if (!profile) {
      return { error: "User not found" };
    }
    const { password, ...profileData } = profile;
    return profileData;
  }
}
