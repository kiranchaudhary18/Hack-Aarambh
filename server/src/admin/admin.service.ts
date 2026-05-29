import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { History } from "../history/history.entity";
import { User } from "../users/user.entity";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(History) private historyRepo: Repository<History>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getStats() {
    const total = await this.historyRepo.count();
    const all = await this.historyRepo.find();
    const scamCount = all.filter((h) => h.result?.isFake).length;
    const users = await this.userRepo.count();
    // Estimate saved dollars based on scam count (average scam loss ~$1000)
    const savedDollars = scamCount * 1000;
    return {
      totalScans: total,
      scamsDetected: scamCount,
      activeUsers: users,
      savedDollars,
    };
  }

  async getFlagged(limit = 50) {
    const flagged = (
      await this.historyRepo.find({ order: { createdAt: "DESC" } })
    ).filter((h) => h.result?.isFake);
    return flagged.slice(0, limit);
  }
}
