import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { MigrationService } from './migration.service';
import { ScamDatabase } from './search.entity';
import { History } from '../history/history.entity';
import { ExtensionScan } from '../extension/extension-scan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ScamDatabase, History, ExtensionScan])],
  controllers: [SearchController],
  providers: [SearchService, MigrationService],
  exports: [SearchService, MigrationService],
})
export class SearchModule {}
