import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(email: string, password: string, name?: string) {
    console.log("UsersService.create called with:", { email, password: password ? "***" : "undefined", name });
    if (!password) {
      throw new Error("Password is required");
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = this.repo.create({ email, password: hashed, name });
    return this.repo.save(user);
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: string) {
    if (!id) return null;
    return this.repo.findOne({ where: { id } });
  }

  async updateProfile(id: string, data: { name?: string | null; avatar?: string | null }) {
    if (!id) return null;
    const user = await this.findById(id);
    if (!user) return null;

    if (data.name !== undefined) user.name = data.name;
    if (data.avatar !== undefined) user.avatar = data.avatar;

    return this.repo.save(user);
  }

  async incrementScans(id: string) {
    if (!id) return null;
    const user = await this.findById(id);
    if (!user) return null;

    user.scansUsed = (user.scansUsed || 0) + 1;
    return this.repo.save(user);
  }

  async getProfile(id: string) {
    if (!id) return null;
    const user = await this.findById(id);
    if (!user) return null;

    const { password, ...profile } = user;
    return profile;
  }
}
