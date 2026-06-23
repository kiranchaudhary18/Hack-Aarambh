import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { Alert } from '../admin/entities/alert.entity';
import { Incident } from '../admin/entities/incident.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alert, Incident]),
  ],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}
