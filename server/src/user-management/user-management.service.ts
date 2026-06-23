import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../users/user.entity';
import { Role } from '../admin/entities/role.entity';
import { Permission } from '../admin/entities/permission.entity';
import { CreateUserDto, UpdateUserDto, ListUsersQueryDto } from './dto/user.dto';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserManagementService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Role)
    private roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {}

  // User Management
  async listUsers(query: ListUsersQueryDto) {
    const { page = 1, limit = 10, search, role, plan } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepo.createQueryBuilder('user');

    if (search) {
      queryBuilder.andWhere(
        '(user.email ILIKE :search OR user.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (plan) {
      queryBuilder.andWhere('user.plan = :plan', { plan });
    }

    queryBuilder.orderBy('user.createdAt', 'DESC').skip(skip).take(limit);

    const [users, total] = await queryBuilder.getManyAndCount();

    return {
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        plan: u.plan,
        scansUsed: u.scansUsed,
        scansLimit: u.scansLimit,
        isVerified: u.isVerified,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUser(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      plan: user.plan,
      scansUsed: user.scansUsed,
      scansLimit: user.scansLimit,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepo.create({
      ...createUserDto,
      password: hashedPassword,
      role: createUserDto.role || 'user',
      plan: 'free',
      scansLimit: 20,
      scansUsed: 0,
    });

    const savedUser = await this.userRepo.save(user);

    return {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role,
      plan: savedUser.plan,
      createdAt: savedUser.createdAt,
    };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepo.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    const savedUser = await this.userRepo.save(user);

    return {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role,
      plan: savedUser.plan,
      scansUsed: savedUser.scansUsed,
      scansLimit: savedUser.scansLimit,
      isVerified: savedUser.isVerified,
      updatedAt: savedUser.updatedAt,
    };
  }

  async deleteUser(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.remove(user);
    return { success: true, message: 'User deleted successfully' };
  }

  // Role Management
  async listRoles() {
    const roles = await this.roleRepo.find({
      order: { createdAt: 'DESC' },
    });
    return roles || [];
  }

  async getRole(id: string) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    return role;
  }

  async createRole(createRoleDto: CreateRoleDto) {
    const existingRole = await this.roleRepo.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new BadRequestException('Role already exists');
    }

    const role = this.roleRepo.create(createRoleDto);
    return this.roleRepo.save(role);
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepo.findOne({
        where: { name: updateRoleDto.name },
      });
      if (existingRole) {
        throw new BadRequestException('Role name already exists');
      }
    }

    Object.assign(role, updateRoleDto);
    return this.roleRepo.save(role);
  }

  async deleteRole(id: string) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Check if role is in use
    const usersWithRole = await this.userRepo.count({
      where: { role: role.name },
    });

    if (usersWithRole > 0) {
      throw new BadRequestException('Cannot delete role that is in use');
    }

    await this.roleRepo.remove(role);
    return { success: true, message: 'Role deleted successfully' };
  }

  // Permission Management
  async listPermissions() {
    const permissions = await this.permissionRepo.find({
      order: { createdAt: 'DESC' },
    });
    return permissions || [];
  }

  async getPermission(id: string) {
    const permission = await this.permissionRepo.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }

  async createPermission(createPermissionDto: CreatePermissionDto) {
    const existingPermission = await this.permissionRepo.findOne({
      where: { name: createPermissionDto.name },
    });

    if (existingPermission) {
      throw new BadRequestException('Permission already exists');
    }

    const permission = this.permissionRepo.create(createPermissionDto);
    return this.permissionRepo.save(permission);
  }

  async updatePermission(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.permissionRepo.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    if (updatePermissionDto.name && updatePermissionDto.name !== permission.name) {
      const existingPermission = await this.permissionRepo.findOne({
        where: { name: updatePermissionDto.name },
      });
      if (existingPermission) {
        throw new BadRequestException('Permission name already exists');
      }
    }

    Object.assign(permission, updatePermissionDto);
    return this.permissionRepo.save(permission);
  }

  async deletePermission(id: string) {
    const permission = await this.permissionRepo.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    await this.permissionRepo.remove(permission);
    return { success: true, message: 'Permission deleted successfully' };
  }
}
