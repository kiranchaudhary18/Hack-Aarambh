export class UpdateSettingsDto {
  value!: any;
}

export class SystemSettingsDto {
  id!: string;
  key!: string;
  value!: any;
  category!: string;
  description?: string;
  updatedAt!: Date;
}
