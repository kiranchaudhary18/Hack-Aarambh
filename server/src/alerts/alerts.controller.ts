import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AdminGuard } from '../common/admin.guard';
import { CreateAlertDto, UpdateAlertDto } from './dto/alert.dto';
import { CreateIncidentDto, UpdateIncidentDto } from './dto/incident.dto';

@Controller('admin/alerts')
@UseGuards(AdminGuard)
export class AlertsController {
  constructor(private alertsService: AlertsService) {}

  // Alert Endpoints
  @Get('history')
  async getAlertHistory() {
    return this.alertsService.getAlertHistory();
  }

  @Get('configuration')
  async getAlertConfigurations() {
    return this.alertsService.getAlertConfigurations();
  }

  @Get('configuration/:id')
  async getAlert(@Param('id') id: string) {
    return this.alertsService.getAlert(id);
  }

  @Post('configuration')
  async createAlert(@Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.createAlert(createAlertDto);
  }

  @Put('configuration/:id')
  async updateAlert(@Param('id') id: string, @Body() updateAlertDto: UpdateAlertDto) {
    return this.alertsService.updateAlert(id, updateAlertDto);
  }

  @Delete('configuration/:id')
  async deleteAlert(@Param('id') id: string) {
    return this.alertsService.deleteAlert(id);
  }

  // Incident Endpoints
  @Get('incidents')
  async getIncidents() {
    return this.alertsService.getIncidents();
  }

  @Get('incidents/:id')
  async getIncident(@Param('id') id: string) {
    return this.alertsService.getIncident(id);
  }

  @Post('incidents')
  async createIncident(@Body() createIncidentDto: CreateIncidentDto) {
    return this.alertsService.createIncident(createIncidentDto);
  }

  @Put('incidents/:id')
  async updateIncident(@Param('id') id: string, @Body() updateIncidentDto: UpdateIncidentDto) {
    return this.alertsService.updateIncident(id, updateIncidentDto);
  }

  @Delete('incidents/:id')
  async deleteIncident(@Param('id') id: string) {
    return this.alertsService.deleteIncident(id);
  }
}
