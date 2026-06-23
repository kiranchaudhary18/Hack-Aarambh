export class CreatePermissionDto {
  name!: string;
  description?: string;
  resource!: string;
  action!: string;
}

export class UpdatePermissionDto {
  name?: string;
  description?: string;
  resource?: string;
  action?: string;
}

export class PermissionDto {
  id!: string;
  name!: string;
  description?: string;
  resource!: string;
  action!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
