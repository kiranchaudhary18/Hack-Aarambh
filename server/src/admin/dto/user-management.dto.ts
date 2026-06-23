export class CreateUserDto {
  email!: string;
  password!: string;
  name?: string;
  role?: string;
  plan?: string;
}

export class UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  role?: string;
  plan?: string;
  isVerified?: boolean;
  scansLimit?: number;
}

export class ListUsersQueryDto {
  page?: number = 1;
  limit?: number = 10;
  search?: string;
  role?: string;
  plan?: string;
}

export class UserDto {
  id!: string;
  email!: string;
  name?: string;
  role!: string;
  plan!: string;
  isVerified!: boolean;
  scansUsed!: number;
  scansLimit!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export class RoleDto {
  id!: string;
  name!: string;
  description?: string;
  permissions!: string[];
  createdAt!: Date;
  updatedAt!: Date;
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
