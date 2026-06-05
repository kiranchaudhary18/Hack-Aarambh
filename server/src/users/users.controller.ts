import { Controller, Get, Put, Body, Req, Post, UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UsersService } from "./users.service";
import { CloudinaryService } from "../cloudinary/cloudinary.service";

@Controller("users")
export class UsersController {
  constructor(
    private svc: UsersService,
    private cloudinaryService: CloudinaryService,
  ) {}

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
    @Body() body: { name?: string; avatar?: string; email?: string },
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

    try {
      // Upload to Cloudinary
      const avatarUrl = await this.cloudinaryService.uploadImage(file.buffer, 'avatars');
      
      const profile = await this.svc.updateProfile(userId, { avatar: avatarUrl });
      
      if (!profile) {
        return { error: "User not found" };
      }
      
      const { password, ...profileData } = profile;
      return profileData;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      return { error: "Failed to upload avatar" };
    }
  }
}
