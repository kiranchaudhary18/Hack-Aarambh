export class GeneralSettingsDto {
  siteName!: string;
  siteDescription?: string;
  maintenanceMode!: boolean;
  maxScansPerUser!: number;
  defaultUserPlan!: string;
}

export class IntegrationSettingsDto {
  openaiApiKey?: string;
  openaiModel?: string;
  emailProvider?: string;
  emailApiKey?: string;
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
}

export class NotificationSettingsDto {
  emailAlerts!: boolean;
  smsAlerts!: boolean;
  pushNotifications!: boolean;
  alertChannels!: string[];
}

export class SecuritySettingsDto {
  twoFactorRequired!: boolean;
  passwordMinLength!: number;
  sessionTimeout!: number;
  maxLoginAttempts!: number;
  ipWhitelist!: string[];
}

export class UpdateSettingsDto {
  value: any;
}
