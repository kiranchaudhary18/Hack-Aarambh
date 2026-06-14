import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { ApiToken } from './api-token.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApiToken, User])],
  controllers: [TokensController],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
