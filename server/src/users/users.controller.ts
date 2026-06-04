import { Controller, Get, Put, Body, Req, Post, UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
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

  @Post("avatar")
  @UseInterceptors(FileInterceptor("file"))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    const userId = req.user?.sub;
    if (!file) {
      return { error: "No file uploaded" };
    }

    // Convert image to base64 string for storage
    const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    const profile = await this.svc.updateProfile(userId, { avatar: base64 });
    
    if (!profile) {
      return { error: "User not found" };
    }
    
    const { password, ...profileData } = profile;
    return profileData;
  }
}
