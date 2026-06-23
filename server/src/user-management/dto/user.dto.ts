export class CreateUserDto {
  email!: string;
  password!: string;
  name?: string;
  role?: string;
}

export class UpdateUserDto {
  email?: string;
  name?: string;
  role?: string;
  plan?: string;
  scansLimit?: number;
  isVerified?: boolean;
}

export class UserDto {
  id!: string;
  email!: string;
  name?: string;
  role!: string;
  plan!: string;
  scansUsed!: number;
  scansLimit!: number;
  isVerified!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export class ListUsersQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  plan?: string;
}
