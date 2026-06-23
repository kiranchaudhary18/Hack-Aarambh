export class NotificationSettingsDto {
  emailAlerts!: boolean;
  slackAlerts!: boolean;
  pushNotifications!: boolean;
  alertChannels!: string[];
}

export class UpdateNotificationSettingsDto {
  emailAlerts?: boolean;
  slackAlerts?: boolean;
  pushNotifications?: boolean;
  alertChannels?: string[];
}
