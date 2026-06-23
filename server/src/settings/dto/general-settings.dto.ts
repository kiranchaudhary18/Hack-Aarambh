export class GeneralSettingsDto {
  siteName!: string;
  siteDescription?: string;
  maintenanceMode!: boolean;
  maxScansPerUser!: number;
  defaultUserPlan!: string;
}

export class UpdateGeneralSettingsDto {
  siteName?: string;
  siteDescription?: string;
  maintenanceMode?: boolean;
  maxScansPerUser?: number;
  defaultUserPlan?: string;
}
