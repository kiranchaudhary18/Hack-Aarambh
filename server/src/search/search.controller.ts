import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { SearchService } from './search.service';
import { MigrationService } from './migration.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { SearchSuggestionDto } from './dto/search-suggestion.dto';
import { ReportScamDto } from './dto/report-scam.dto';

@Controller('search')
export class SearchController {
  constructor(
    private searchService: SearchService,
    private migrationService: MigrationService,
  ) {}

  @Get()
  async search(@Query() queryDto: SearchQueryDto) {
    return this.searchService.search(queryDto);
  }

  @Get('suggestions')
  async getSuggestions(@Query() queryDto: SearchSuggestionDto) {
    return this.searchService.getSuggestions(queryDto);
  }

  @Post('report')
  async reportScam(@Body() reportDto: ReportScamDto) {
    return this.searchService.reportScam(reportDto);
  }

  @Post('migrate')
  async migrateData() {
    return this.migrationService.runFullMigration();
  }
}
