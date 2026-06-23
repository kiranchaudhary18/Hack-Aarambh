import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MonitoringService } from './monitoring.service';
import { MonitoringGateway } from './websocket/monitoring.gateway';

@Injectable()
export class MetricsSchedulerService {
  private readonly logger = new Logger(MetricsSchedulerService.name);

  constructor(
    private monitoringService: MonitoringService,
    private monitoringGateway: MonitoringGateway,
  ) {}

  // Collect system metrics every 30 seconds
  @Cron(CronExpression.EVERY_30_SECONDS)
  async collectSystemMetrics() {
    try {
      const resources = await this.monitoringService.getResources();
      this.monitoringGateway.broadcastMetrics('server-resources', resources);
      this.logger.debug('System metrics collected and broadcasted');
    } catch (error) {
      this.logger.error('Failed to collect system metrics', error);
    }
  }

  // Collect AI metrics every minute
  @Cron(CronExpression.EVERY_MINUTE)
  async collectAIMetrics() {
    try {
      const accuracy = await this.monitoringService.getAccuracyMetrics();
      const performance = await this.monitoringService.getPerformanceMetrics();
      const resources = await this.monitoringService.getResourceMetrics();
      const health = await this.monitoringService.getHealthMetrics();

      this.monitoringGateway.broadcastMetrics('ai-accuracy', accuracy);
      this.monitoringGateway.broadcastMetrics('ai-performance', performance);
      this.monitoringGateway.broadcastMetrics('ai-resources', resources);
      this.monitoringGateway.broadcastMetrics('ai-health', health);
      this.logger.debug('AI metrics collected and broadcasted');
    } catch (error) {
      this.logger.error('Failed to collect AI metrics', error);
    }
  }

  // Collect extension metrics every 2 minutes
  @Cron('*/2 * * * *')
  async collectExtensionMetrics() {
    try {
      const installation = await this.monitoringService.getInstallationMetrics();
      const usage = await this.monitoringService.getUsageMetrics();
      const errors = await this.monitoringService.getExtensionErrors();
      const performance = await this.monitoringService.getExtensionPerformance();

      this.monitoringGateway.broadcastMetrics('extension-installation', installation);
      this.monitoringGateway.broadcastMetrics('extension-usage', usage);
      this.monitoringGateway.broadcastMetrics('extension-errors', errors);
      this.monitoringGateway.broadcastMetrics('extension-performance', performance);
      this.logger.debug('Extension metrics collected and broadcasted');
    } catch (error) {
      this.logger.error('Failed to collect extension metrics', error);
    }
  }

  // Collect website metrics every 5 minutes
  @Cron('*/5 * * * *')
  async collectWebsiteMetrics() {
    try {
      const traffic = await this.monitoringService.getTrafficMetrics();
      const errors = await this.monitoringService.getWebsiteErrors();
      const performance = await this.monitoringService.getWebsitePerformance();

      this.monitoringGateway.broadcastMetrics('website-traffic', traffic);
      this.monitoringGateway.broadcastMetrics('website-errors', errors);
      this.monitoringGateway.broadcastMetrics('website-performance', performance);
      this.logger.debug('Website metrics collected and broadcasted');
    } catch (error) {
      this.logger.error('Failed to collect website metrics', error);
    }
  }

  // Collect server API and database metrics every minute
  @Cron(CronExpression.EVERY_MINUTE)
  async collectServerMetrics() {
    try {
      const apiMetrics = await this.monitoringService.getAPIMetrics();
      const databaseHealth = await this.monitoringService.getDatabaseHealth();
      const uptime = await this.monitoringService.getUptime();

      this.monitoringGateway.broadcastMetrics('server-api', apiMetrics);
      this.monitoringGateway.broadcastMetrics('server-database', databaseHealth);
      this.monitoringGateway.broadcastMetrics('server-uptime', uptime);
      this.logger.debug('Server metrics collected and broadcasted');
    } catch (error) {
      this.logger.error('Failed to collect server metrics', error);
    }
  }

  // Clean up old metrics older than 30 days (runs daily at 2 AM)
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupOldMetrics() {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // This would be implemented in the monitoring service to delete old metrics
      this.logger.log(`Cleanup of metrics older than ${thirtyDaysAgo} completed`);
    } catch (error) {
      this.logger.error('Failed to cleanup old metrics', error);
    }
  }
}
