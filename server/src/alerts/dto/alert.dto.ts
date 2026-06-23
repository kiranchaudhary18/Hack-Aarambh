export class CreateAlertDto {
  name!: string;
  type!: string;
  threshold!: number;
  condition!: string;
  channels!: string[];
}

export class UpdateAlertDto {
  name?: string;
  type?: string;
  threshold?: number;
  condition?: string;
  enabled?: boolean;
  channels?: string[];
}

export class AlertDto {
  id!: string;
  name!: string;
  type!: string;
  threshold!: number;
  condition!: string;
  enabled!: boolean;
  channels!: string[];
  lastTriggered?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}
