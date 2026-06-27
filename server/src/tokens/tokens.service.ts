import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiToken } from './api-token.entity';
import { User } from '../users/user.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(ApiToken) private apiTokenRepo: Repository<ApiToken>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async generateToken(userId: string, name?: string, expiresAt?: Date) {
    // Generate a random token
    const token = this.generateRandomToken();

    // Check if user exists
    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create the API token
    const apiToken = this.apiTokenRepo.create({
      token,
      userId,
      name: name || 'Default Token',
      dailyLimit: 50,
      usageCount: 0,
      lastResetDate: new Date(),
      isActive: true,
      expiresAt: expiresAt ?? undefined,
    });

    const savedToken = await this.apiTokenRepo.save(apiToken);

    return {
      id: savedToken.id,
      token: savedToken.token,
      name: savedToken.name,
      dailyLimit: savedToken.dailyLimit,
      usageCount: savedToken.usageCount,
      createdAt: savedToken.createdAt,
      expiresAt: savedToken.expiresAt,
    };
  }

  async getUserTokens(userId: string) {
    const tokens = await this.apiTokenRepo.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });

    return tokens.map((token) => ({
      id: token.id,
      token: token.token,
      name: token.name,
      dailyLimit: token.dailyLimit,
      usageCount: token.usageCount,
      lastResetDate: token.lastResetDate,
      createdAt: token.createdAt,
      expiresAt: token.expiresAt,
    }));
  }

  async deleteToken(tokenId: string, userId: string) {
    const token = await this.apiTokenRepo.findOne({
      where: { id: tokenId, userId },
    });

    if (!token) {
      throw new NotFoundException('Token not found');
    }

    await this.apiTokenRepo.update(tokenId, { isActive: false });

    return { message: 'Token deleted successfully' };
  }

  async validateToken(token: string) {
    const apiToken = await this.apiTokenRepo.findOne({
      where: { token, isActive: true },
      relations: { user: true },
    });

    if (!apiToken) {
      throw new BadRequestException('Invalid or inactive token');
    }

    // Check if daily limit is reached
    const now = new Date();
    const lastReset = new Date(apiToken.lastResetDate);
    const daysSinceReset = Math.floor(
      (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24),
    );

    // Reset usage count if 24 hours have passed
    if (daysSinceReset >= 1) {
      await this.apiTokenRepo.update(apiToken.id, {
        usageCount: 0,
        lastResetDate: now,
      });
      apiToken.usageCount = 0;
    }

    if (apiToken.usageCount >= apiToken.dailyLimit) {
      throw new BadRequestException('Daily usage limit reached');
    }

    // Increment usage count
    await this.apiTokenRepo.update(apiToken.id, {
      usageCount: apiToken.usageCount + 1,
    });

    return {
      userId: apiToken.userId,
      tokenId: apiToken.id,
      remaining: apiToken.dailyLimit - apiToken.usageCount - 1,
    };
  }

  async resetTokenUsage(tokenId: string) {
    const token = await this.apiTokenRepo.findOne({
      where: { id: tokenId },
    });

    if (!token) {
      throw new NotFoundException('Token not found');
    }

    await this.apiTokenRepo.update(tokenId, {
      usageCount: 0,
      lastResetDate: new Date(),
    });

    return { message: 'Token usage reset successfully' };
  }

  private generateRandomToken(): string {
    const bytes = randomBytes(32);
    return bytes.toString('hex');
  }

  private maskToken(token: string): string {
    return token.substring(0, 8) + '...' + token.substring(token.length - 8);
  }
}
