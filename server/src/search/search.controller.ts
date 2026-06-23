import { Controller, Get, Post, Query, Body, Param, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { MigrationService } from './migration.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { SearchSuggestionDto } from './dto/search-suggestion.dto';
import { ReportScamDto } from './dto/report-scam.dto';
import { ApproveReportDto, RejectReportDto } from './dto/approve-reject.dto';
import { AdminGuard } from '../common/admin.guard';

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

  @Get('pending')
  @UseGuards(AdminGuard)
  async getPendingReports() {
    return this.searchService.getPendingReports();
  }

  @Post(':id/approve')
  @UseGuards(AdminGuard)
  async approveReport(@Param('id') id: string, @Body() dto: ApproveReportDto) {
    return this.searchService.approveReport(id, dto.adminId);
  }

  @Post(':id/reject')
  @UseGuards(AdminGuard)
  async rejectReport(@Param('id') id: string, @Body() dto: RejectReportDto) {
    return this.searchService.rejectReport(id, dto.adminId, dto.reason);
  }
}
