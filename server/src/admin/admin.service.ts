import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { History } from '../history/history.entity';
import { User } from '../users/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(History) private historyRepo: Repository<History>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getStats() {
    const total = await this.historyRepo.count();
    const scams = await this.historyRepo.count({ where: { } });
    // calculate scams by scanning result JSON
    const all = await this.historyRepo.find();
    const scamCount = all.filter(h => h.result?.isFake).length;
    const users = await this.userRepo.count();
    return {
      totalScans: total,
      scamCount,
      scamPercent: total > 0 ? Math.round((scamCount / total) * 100) : 0,
      totalUsers: users,
    };
  }

  async getFlagged(limit = 50) {
    const flagged = (await this.historyRepo.find({ order: { createdAt: 'DESC' } })).filter(h => h.result?.isFake);
    return flagged.slice(0, limit);
  }
}
