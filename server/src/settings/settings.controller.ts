import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AdminGuard } from '../common/admin.guard';
import { UpdateSettingsDto } from './dto/settings.dto';

@Controller('admin/settings')
@UseGuards(AdminGuard)
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('general')
  async getGeneralSettings() {
    return this.settingsService.getSettingsByCategory('general');
  }

  @Put('general/:key')
  async updateGeneralSetting(@Param('key') key: string, @Body() updateSettingsDto: UpdateSettingsDto) {
    return this.settingsService.updateSetting(key, updateSettingsDto);
  }

  @Get('integrations')
  async getIntegrationSettings() {
    return this.settingsService.getSettingsByCategory('integrations');
  }

  @Put('integrations/:key')
  async updateIntegrationSetting(@Param('key') key: string, @Body() updateSettingsDto: UpdateSettingsDto) {
    return this.settingsService.updateSetting(key, updateSettingsDto);
  }

  @Get('notifications')
  async getNotificationSettings() {
    return this.settingsService.getSettingsByCategory('notifications');
  }

  @Put('notifications/:key')
  async updateNotificationSetting(@Param('key') key: string, @Body() updateSettingsDto: UpdateSettingsDto) {
    return this.settingsService.updateSetting(key, updateSettingsDto);
  }

  @Get('security')
  async getSecuritySettings() {
    return this.settingsService.getSettingsByCategory('security');
  }

  @Put('security/:key')
  async updateSecuritySetting(@Param('key') key: string, @Body() updateSettingsDto: UpdateSettingsDto) {
    return this.settingsService.updateSetting(key, updateSettingsDto);
  }

  @Get('integrations/health/:type')
  async checkIntegrationHealth(@Param('type') type: string) {
    return this.settingsService.checkIntegrationHealth(type);
  }

  @Get('integrations/health')
  async checkAllIntegrations() {
    return this.settingsService.checkAllIntegrations();
  }
}
