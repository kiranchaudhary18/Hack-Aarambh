import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { History } from "./history.entity";

@Injectable()
export class HistoryService {
  constructor(@InjectRepository(History) private repo: Repository<History>) {}

  async getAll(userId?: string) {
    if (userId) {
      return this.repo.find({
        where: { userId },
        order: { createdAt: "DESC" },
      });
    }
    return this.repo.find({ order: { createdAt: "DESC" } });
  }

  async getById(id: string, userId?: string) {
    const query = this.repo
      .createQueryBuilder("history")
      .where("history.id = :id", { id });
    if (userId) {
      query.andWhere("history.userId = :userId", { userId });
    }
    return query.getOne();
  }

  async delete(id: string, userId?: string) {
    const query = this.repo
      .createQueryBuilder("history")
      .where("history.id = :id", { id });
    if (userId) {
      query.andWhere("history.userId = :userId", { userId });
    }
    const result = await query.getOne();
    if (result) {
      await this.repo.remove(result);
    }
    return { success: true };
  }
}
