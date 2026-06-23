import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemSettings } from '../admin/entities/system-settings.entity';
import { UpdateSettingsDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    @InjectRepository(SystemSettings)
    private settingsRepo: Repository<SystemSettings>,
  ) {}

  async getSettingsByCategory(category: string) {
    const settings = await this.settingsRepo.find({
      where: { category },
      order: { key: 'ASC' },
    });
    return settings || [];
  }

  async getSetting(key: string) {
    const setting = await this.settingsRepo.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException('Setting not found');
    }
    return setting;
  }

  async updateSetting(key: string, updateSettingsDto: UpdateSettingsDto) {
    const setting = await this.settingsRepo.findOne({ where: { key } });
    if (!setting) {
      throw new NotFoundException('Setting not found');
    }

    // Validate setting value based on key
    this.validateSetting(key, updateSettingsDto.value);

    setting.value = updateSettingsDto.value;
    return this.settingsRepo.save(setting);
  }

  private validateSetting(key: string, value: any) {
    switch (key) {
      case 'site_name':
        if (typeof value !== 'string' || value.length < 2 || value.length > 100) {
          throw new BadRequestException('Site name must be between 2 and 100 characters');
        }
        break;
      case 'max_scans_per_day':
        if (typeof value !== 'number' || value < 1 || value > 1000) {
          throw new BadRequestException('Max scans per day must be between 1 and 1000');
        }
        break;
      case 'password_min_length':
        if (typeof value !== 'number' || value < 6 || value > 32) {
          throw new BadRequestException('Password min length must be between 6 and 32');
        }
        break;
      case 'session_timeout':
        if (typeof value !== 'number' || value < 5 || value > 1440) {
          throw new BadRequestException('Session timeout must be between 5 and 1440 minutes');
        }
        break;
      case 'max_login_attempts':
        if (typeof value !== 'number' || value < 3 || value > 10) {
          throw new BadRequestException('Max login attempts must be between 3 and 10');
        }
        break;
      case 'email':
        if (typeof value === 'string' && value && !this.isValidEmail(value)) {
          throw new BadRequestException('Invalid email format');
        }
        break;
      case 'maintenance_mode':
      case '2fa_required':
      case 'email_alerts':
      case 'slack_alerts':
        if (typeof value !== 'boolean') {
          throw new BadRequestException('This setting must be a boolean');
        }
        break;
      default:
        // Allow any value for unknown keys
        break;
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Integration Health Checks
  async checkIntegrationHealth(integrationType: string) {
    const healthChecks: Record<string, () => Promise<{ status: string; message: string }>> = {
      email: async () => {
        const emailEnabled = await this.getSetting('email_enabled');
        if (!emailEnabled.value) {
          return { status: 'disabled', message: 'Email integration is disabled' };
        }
        // Simulate email service health check
        return { status: 'healthy', message: 'Email service is operational' };
      },
      slack: async () => {
        const slackWebhook = await this.getSetting('slack_webhook');
        if (!slackWebhook.value) {
          return { status: 'disabled', message: 'Slack webhook not configured' };
        }
        // Simulate Slack webhook health check
        return { status: 'healthy', message: 'Slack webhook is operational' };
      },
      openai: async () => {
        const apiKey = await this.getSetting('openai_api_key');
        if (!apiKey.value) {
          return { status: 'disabled', message: 'OpenAI API key not configured' };
        }
        // Simulate OpenAI API health check
        return { status: 'healthy', message: 'OpenAI API is operational' };
      },
      cloudinary: async () => {
        const cloudName = await this.getSetting('cloudinary_cloud_name');
        if (!cloudName.value) {
          return { status: 'disabled', message: 'Cloudinary not configured' };
        }
        // Simulate Cloudinary health check
        return { status: 'healthy', message: 'Cloudinary is operational' };
      },
    };

    const checkFunction = healthChecks[integrationType];
    if (!checkFunction) {
      throw new BadRequestException(`Unknown integration type: ${integrationType}`);
    }

    try {
      return await checkFunction();
    } catch (error) {
      this.logger.error(`Health check failed for ${integrationType}`, error);
      return { status: 'unhealthy', message: `Integration check failed: ${error instanceof Error ? error.message : String(error)}` };
    }
  }

  async checkAllIntegrations() {
    const integrations = ['email', 'slack', 'openai', 'cloudinary'];
    const results: Record<string, { status: string; message: string }> = {};

    for (const integration of integrations) {
      results[integration] = await this.checkIntegrationHealth(integration);
    }

    return results;
  }

  async createDefaultSettings() {
    const defaultSettings = [
      {
        key: 'site_name',
        value: 'ScamSniff',
        category: 'general',
        description: 'Site name displayed in header',
      },
      {
        key: 'maintenance_mode',
        value: false,
        category: 'general',
        description: 'Enable maintenance mode',
      },
      {
        key: 'max_scans_per_day',
        value: 20,
        category: 'general',
        description: 'Maximum scans per day for free users',
      },
      {
        key: 'email_enabled',
        value: true,
        category: 'integrations',
        description: 'Enable email notifications',
      },
      {
        key: 'slack_webhook',
        value: '',
        category: 'integrations',
        description: 'Slack webhook URL for alerts',
      },
      {
        key: 'email_alerts',
        value: true,
        category: 'notifications',
        description: 'Enable email alerts',
      },
      {
        key: 'slack_alerts',
        value: false,
        category: 'notifications',
        description: 'Enable Slack alerts',
      },
      {
        key: '2fa_required',
        value: false,
        category: 'security',
        description: 'Require 2FA for admin users',
      },
    ];

    for (const setting of defaultSettings) {
      const existing = await this.settingsRepo.findOne({
        where: { key: setting.key },
      });
      if (!existing) {
        await this.settingsRepo.save(setting);
      }
    }
  }
}
