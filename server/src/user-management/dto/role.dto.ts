export class CreateRoleDto {
  name!: string;
  description?: string;
  permissions!: string[];
}

export class UpdateRoleDto {
  name?: string;
  description?: string;
  permissions?: string[];
}

export class RoleDto {
  id!: string;
  name!: string;
  description?: string;
  permissions!: string[];
  createdAt!: Date;
  updatedAt!: Date;
}
