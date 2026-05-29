import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.users.findByEmail(email);
    if (existing) throw new UnauthorizedException("Email already in use");
    const user = await this.users.create(email, password);
    const token = this.sign(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email }, token };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");
    const token = this.sign(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email }, token };
  }

  sign(id: string, email: string, role: string) {
    return this.jwt.sign({ sub: id, email, role });
  }
}
