import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MonitoringController } from './monitoring.controller';
import { MonitoringService } from './monitoring.service';
import { MonitoringGateway } from './websocket/monitoring.gateway';
import { MetricsSchedulerService } from './metrics-scheduler.service';
import { SystemMetrics } from './entities/system-metrics.entity';
import { AIMetrics } from './entities/ai-metrics.entity';
import { ExtensionMetrics } from './entities/extension-metrics.entity';
import { WebsiteMetrics } from './entities/website-metrics.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SystemMetrics,
      AIMetrics,
      ExtensionMetrics,
      WebsiteMetrics,
    ]),
  ],
  controllers: [MonitoringController],
  providers: [MonitoringService, MonitoringGateway, MetricsSchedulerService],
  exports: [MonitoringService],
})
export class MonitoringModule {}
