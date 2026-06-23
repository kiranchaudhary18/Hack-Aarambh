export class IntegrationSettingsDto {
  openaiApiKey?: string;
  openaiModel?: string;
  emailProvider?: string;
  emailApiKey?: string;
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  slackWebhook?: string;
}

export class UpdateIntegrationSettingsDto {
  openaiApiKey?: string;
  openaiModel?: string;
  emailProvider?: string;
  emailApiKey?: string;
  cloudinaryCloudName?: string;
  cloudinaryApiKey?: string;
  slackWebhook?: string;
}
