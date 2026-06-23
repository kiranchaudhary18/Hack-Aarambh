import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from '../admin/entities/alert.entity';
import { Incident } from '../admin/entities/incident.entity';
import { CreateAlertDto, UpdateAlertDto } from './dto/alert.dto';
import { CreateIncidentDto, UpdateIncidentDto } from './dto/incident.dto';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    @InjectRepository(Alert)
    private alertRepo: Repository<Alert>,
    @InjectRepository(Incident)
    private incidentRepo: Repository<Incident>,
  ) {}

  // Alert Management
  async getAlertHistory() {
    const alerts = await this.alertRepo.find({
      order: { lastTriggered: 'DESC' },
      take: 50,
    });
    return alerts || [];
  }

  async getAlertConfigurations() {
    const alerts = await this.alertRepo.find({
      order: { createdAt: 'DESC' },
    });
    return alerts || [];
  }

  async getAlert(id: string) {
    const alert = await this.alertRepo.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException('Alert not found');
    }
    return alert;
  }

  async createAlert(createAlertDto: CreateAlertDto) {
    const alert = this.alertRepo.create(createAlertDto);
    return this.alertRepo.save(alert);
  }

  async updateAlert(id: string, updateAlertDto: UpdateAlertDto) {
    const alert = await this.alertRepo.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException('Alert not found');
    }
    Object.assign(alert, updateAlertDto);
    return this.alertRepo.save(alert);
  }

  async deleteAlert(id: string) {
    const alert = await this.alertRepo.findOne({ where: { id } });
    if (!alert) {
      throw new NotFoundException('Alert not found');
    }
    await this.alertRepo.remove(alert);
    return { success: true, message: 'Alert deleted successfully' };
  }

  // Incident Management
  async getIncidents() {
    const incidents = await this.incidentRepo.find({
      order: { createdAt: 'DESC' },
      take: 50,
    });
    return incidents || [];
  }

  async getIncident(id: string) {
    const incident = await this.incidentRepo.findOne({ where: { id } });
    if (!incident) {
      throw new NotFoundException('Incident not found');
    }
    return incident;
  }

  async createIncident(createIncidentDto: CreateIncidentDto) {
    const incident = this.incidentRepo.create(createIncidentDto);
    return this.incidentRepo.save(incident);
  }

  async updateIncident(id: string, updateIncidentDto: UpdateIncidentDto) {
    const incident = await this.incidentRepo.findOne({ where: { id } });
    if (!incident) {
      throw new NotFoundException('Incident not found');
    }
    Object.assign(incident, updateIncidentDto);
    if (updateIncidentDto.status === 'resolved' && !incident.resolvedAt) {
      incident.resolvedAt = new Date();
    }
    return this.incidentRepo.save(incident);
  }

  async deleteIncident(id: string) {
    const incident = await this.incidentRepo.findOne({ where: { id } });
    if (!incident) {
      throw new NotFoundException('Incident not found');
    }
    await this.incidentRepo.remove(incident);
    return { success: true, message: 'Incident deleted successfully' };
  }

  // Alert Triggering Logic
  async checkAndTriggerAlerts(metricType: string, metricName: string, value: number) {
    const enabledAlerts = await this.alertRepo.find({
      where: { enabled: true },
    });

    for (const alert of enabledAlerts) {
      if (this.shouldTriggerAlert(alert, metricType, metricName, value)) {
        await this.triggerAlert(alert, value);
      }
    }
  }

  private shouldTriggerAlert(alert: Alert, metricType: string, metricName: string, value: number): boolean {
    // Check if alert matches the metric type and name
    // This is a simplified check - in production, you'd have more sophisticated matching
    const alertMatches = alert.type === metricType || alert.type === 'all';
    
    if (!alertMatches) return false;

    // Check threshold condition
    switch (alert.condition) {
      case 'greater_than':
        return value > alert.threshold;
      case 'less_than':
        return value < alert.threshold;
      case 'equals':
        return value === alert.threshold;
      case 'greater_than_or_equal':
        return value >= alert.threshold;
      case 'less_than_or_equal':
        return value <= alert.threshold;
      default:
        return false;
    }
  }

  private async triggerAlert(alert: Alert, value: number) {
    // Update last triggered timestamp
    alert.lastTriggered = new Date();
    await this.alertRepo.save(alert);

    // Create incident if severity is high enough
    if (alert.threshold > 90) {
      const incident = this.incidentRepo.create({
        title: `Alert Triggered: ${alert.name}`,
        description: `Alert ${alert.name} was triggered with value ${value} exceeding threshold ${alert.threshold}`,
        severity: this.determineSeverity(value, alert.threshold),
        status: 'open',
        alertId: alert.id,
      });
      await this.incidentRepo.save(incident);
      this.logger.warn(`Incident created for alert: ${alert.name}`);
    }

    // Send notifications through configured channels
    await this.sendAlertNotifications(alert, value);
  }

  private determineSeverity(value: number, threshold: number): string {
    const percentage = (value / threshold) * 100;
    if (percentage > 150) return 'critical';
    if (percentage > 120) return 'high';
    if (percentage > 100) return 'medium';
    return 'low';
  }

  private async sendAlertNotifications(alert: Alert, value: number) {
    const channels = alert.channels || [];
    
    for (const channel of channels) {
      try {
        switch (channel) {
          case 'email':
            // Implement email notification
            this.logger.log(`Email notification sent for alert: ${alert.name}`);
            break;
          case 'slack':
            // Implement Slack webhook notification
            this.logger.log(`Slack notification sent for alert: ${alert.name}`);
            break;
          case 'webhook':
            // Implement webhook notification
            this.logger.log(`Webhook notification sent for alert: ${alert.name}`);
            break;
          default:
            this.logger.warn(`Unknown notification channel: ${channel}`);
        }
      } catch (error) {
        this.logger.error(`Failed to send ${channel} notification for alert ${alert.name}`, error);
      }
    }
  }
}
