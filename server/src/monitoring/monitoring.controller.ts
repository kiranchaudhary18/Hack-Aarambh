import { Controller, Get, UseGuards } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { AdminGuard } from '../common/admin.guard';

@Controller('monitoring')
@UseGuards(AdminGuard)
export class MonitoringController {
  constructor(private monitoringService: MonitoringService) {}

  // AI Model Monitoring
  @Get('ai/accuracy')
  async getAccuracyMetrics() {
    return this.monitoringService.getAccuracyMetrics();
  }

  @Get('ai/performance')
  async getPerformanceMetrics() {
    return this.monitoringService.getPerformanceMetrics();
  }

  @Get('ai/resources')
  async getResourceMetrics() {
    return this.monitoringService.getResourceMetrics();
  }

  @Get('ai/health')
  async getHealthMetrics() {
    return this.monitoringService.getHealthMetrics();
  }

  // Server Monitoring
  @Get('server/resources')
  async getResources() {
    return this.monitoringService.getResources();
  }

  @Get('server/api')
  async getAPIMetrics() {
    return this.monitoringService.getAPIMetrics();
  }

  @Get('server/database')
  async getDatabaseHealth() {
    return this.monitoringService.getDatabaseHealth();
  }

  @Get('server/uptime')
  async getUptime() {
    return this.monitoringService.getUptime();
  }

  // Extension Monitoring
  @Get('extension/installation')
  async getInstallationMetrics() {
    return this.monitoringService.getInstallationMetrics();
  }

  @Get('extension/usage')
  async getUsageMetrics() {
    return this.monitoringService.getUsageMetrics();
  }

  @Get('extension/retention')
  async getRetentionMetrics() {
    return this.monitoringService.getRetentionMetrics();
  }

  @Get('extension/errors')
  async getExtensionErrors() {
    return this.monitoringService.getExtensionErrors();
  }

  @Get('extension/performance')
  async getExtensionPerformance() {
    return this.monitoringService.getExtensionPerformance();
  }

  // Website Monitoring
  @Get('website/traffic')
  async getTrafficMetrics() {
    return this.monitoringService.getTrafficMetrics();
  }

  @Get('website/errors')
  async getWebsiteErrors() {
    return this.monitoringService.getWebsiteErrors();
  }

  @Get('website/performance')
  async getWebsitePerformance() {
    return this.monitoringService.getWebsitePerformance();
  }
}
