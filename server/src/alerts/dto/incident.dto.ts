export class CreateIncidentDto {
  title!: string;
  description!: string;
  severity!: string;
  alertId?: string;
}

export class UpdateIncidentDto {
  title?: string;
  description?: string;
  severity?: string;
  status?: string;
  resolvedBy?: string;
}

export class IncidentDto {
  id!: string;
  title!: string;
  description!: string;
  severity!: string;
  status!: string;
  alertId?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}
