import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { AdminGuard } from '../common/admin.guard';
import { CreateUserDto, UpdateUserDto, ListUsersQueryDto } from './dto/user.dto';
import { CreateRoleDto, UpdateRoleDto } from './dto/role.dto';
import { CreatePermissionDto, UpdatePermissionDto } from './dto/permission.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class UserManagementController {
  constructor(private userManagementService: UserManagementService) {}

  // User Endpoints
  @Get('users')
  async listUsers(@Query() query: ListUsersQueryDto) {
    return this.userManagementService.listUsers(query);
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.userManagementService.getUser(id);
  }

  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userManagementService.createUser(createUserDto);
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userManagementService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.userManagementService.deleteUser(id);
  }

  // Role Endpoints
  @Get('roles')
  async listRoles() {
    return this.userManagementService.listRoles();
  }

  @Get('roles/:id')
  async getRole(@Param('id') id: string) {
    return this.userManagementService.getRole(id);
  }

  @Post('roles')
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.userManagementService.createRole(createRoleDto);
  }

  @Put('roles/:id')
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.userManagementService.updateRole(id, updateRoleDto);
  }

  @Delete('roles/:id')
  async deleteRole(@Param('id') id: string) {
    return this.userManagementService.deleteRole(id);
  }

  // Permission Endpoints
  @Get('permissions')
  async listPermissions() {
    return this.userManagementService.listPermissions();
  }

  @Get('permissions/:id')
  async getPermission(@Param('id') id: string) {
    return this.userManagementService.getPermission(id);
  }

  @Post('permissions')
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.userManagementService.createPermission(createPermissionDto);
  }

  @Put('permissions/:id')
  async updatePermission(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.userManagementService.updatePermission(id, updatePermissionDto);
  }

  @Delete('permissions/:id')
  async deletePermission(@Param('id') id: string) {
    return this.userManagementService.deletePermission(id);
  }
}
