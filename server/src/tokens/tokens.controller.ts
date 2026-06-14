import { Controller, Post, Get, Delete, Body, Req, UseGuards } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

class GenerateTokenDto {
  name?: string;
  expiresAt?: string;
}

@Controller('tokens')
@UseGuards(JwtAuthGuard)
export class TokensController {
  constructor(private tokensService: TokensService) {}

  @Post('generate')
  async generateToken(@Req() req: any, @Body() body: GenerateTokenDto) {
    const userId = req.user?.sub;
    const expiresAt = body.expiresAt ? new Date(body.expiresAt) : undefined;
    return this.tokensService.generateToken(userId, body.name, expiresAt);
  }

  @Get()
  async getUserTokens(@Req() req: any) {
    const userId = req.user?.sub;
    return this.tokensService.getUserTokens(userId);
  }

  @Delete(':id')
  async deleteToken(@Req() req: any, @Body('tokenId') tokenId: string) {
    const userId = req.user?.sub;
    return this.tokensService.deleteToken(tokenId, userId);
  }

  @Post(':id/reset')
  async resetTokenUsage(@Req() req: any, @Body('tokenId') tokenId: string) {
    return this.tokensService.resetTokenUsage(tokenId);
  }
}
