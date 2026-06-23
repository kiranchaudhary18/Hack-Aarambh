import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScamDatabase } from './search.entity';
import { SearchQueryDto, SearchType, Severity } from './dto/search-query.dto';
import { SearchSuggestionDto } from './dto/search-suggestion.dto';
import { ReportScamDto } from './dto/report-scam.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(ScamDatabase)
    private scamDatabaseRepo: Repository<ScamDatabase>,
  ) {}

  async search(queryDto: SearchQueryDto) {
    const { q, type, severity, severities, source, limit = 20, offset = 0 } = queryDto;

    // Build the query
    const queryBuilder = this.scamDatabaseRepo.createQueryBuilder('scam');

    // Apply search filters
    if (type && type !== SearchType.ALL) {
      switch (type) {
        case SearchType.COMPANY:
          queryBuilder.andWhere('scam.companyName ILIKE :query', {
            query: `%${q}%`,
          });
          break;
        case SearchType.DOMAIN:
          queryBuilder.andWhere('scam.domain ILIKE :query', {
            query: `%${q}%`,
          });
          break;
        case SearchType.PATTERN:
          queryBuilder.andWhere(
            '(scam.description ILIKE :query OR scam.scamType ILIKE :query)',
            { query: `%${q}%` },
          );
          break;
      }
    } else {
      // Search across all fields
      queryBuilder.andWhere(
        '(scam.companyName ILIKE :query OR scam.domain ILIKE :query OR scam.description ILIKE :query OR scam.scamType ILIKE :query)',
        { query: `%${q}%` },
      );
    }

    // Apply severity filter
    if (severity) {
      queryBuilder.andWhere('scam.severity = :severity', { severity });
    } else if (severities && severities.length > 0) {
      queryBuilder.andWhere('scam.severity IN (:...severities)', { severities });
    }

    // Apply source filter
    if (source === 'internal') {
      queryBuilder.andWhere('scam.isExternal = false');
    } else if (source === 'external') {
      queryBuilder.andWhere('scam.isExternal = true');
    }

    // Only show approved reports in public search
    queryBuilder.andWhere('scam.status = :status', { status: 'approved' });

    // Order by relevance (report count, verification status, recency)
    queryBuilder
      .orderBy('scam.reportCount', 'DESC')
      .addOrderBy('scam.isVerified', 'DESC')
      .addOrderBy('scam.createdAt', 'DESC');

    // Apply pagination
    queryBuilder.skip(offset).take(limit);

    const [results, total] = await queryBuilder.getManyAndCount();

    // Calculate relevance scores for results
    const scoredResults = results.map((result) => ({
      ...result,
      relevanceScore: this.calculateRelevanceScore(result, q),
      matchedTerms: this.extractMatchedTerms(result, q),
    }));

    // Sort by relevance score
    scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return {
      results: scoredResults,
      total,
      query: q,
      filters: { type, severity, severities, source },
      limit,
      offset,
    };
  }

  async getSuggestions(queryDto: SearchSuggestionDto) {
    const { q, limit = 5 } = queryDto;

    if (q.length < 3) {
      return { suggestions: [] };
    }

    const suggestions = await this.scamDatabaseRepo
      .createQueryBuilder('scam')
      .select(['scam.companyName', 'scam.domain', 'scam.reportCount'])
      .where('scam.companyName ILIKE :query', { query: `${q}%` })
      .orWhere('scam.domain ILIKE :query', { query: `${q}%` })
      .distinct(true)
      .orderBy('scam.reportCount', 'DESC')
      .take(limit)
      .getMany();

    return {
      suggestions: suggestions.map((s) => ({
        companyName: s.companyName,
        domain: s.domain,
        type: s.domain ? 'domain' : 'company',
      })),
    };
  }

  async reportScam(reportDto: ReportScamDto) {
    const { companyName, domain, scamType, description, severity, isAnonymous } = reportDto;

    // Check if scam already exists
    const existingScam = await this.scamDatabaseRepo.findOne({
      where: [
        { companyName },
        ...(domain ? [{ domain }] : []),
      ],
    });

    if (existingScam) {
      // Update existing scam
      existingScam.reportCount += 1;
      existingScam.sources = [
        ...existingScam.sources,
        {
          type: 'user_report',
          isAnonymous,
          timestamp: new Date(),
        },
      ];
      return this.scamDatabaseRepo.save(existingScam);
    }

    // Create new scam entry with pending status
    const newScam = this.scamDatabaseRepo.create({
      companyName,
      domain,
      scamType,
      description,
      severity,
      reportCount: 1,
      sources: [
        {
          type: 'user_report',
          isAnonymous,
          timestamp: new Date(),
        },
      ],
      isVerified: false,
      isExternal: false,
      status: 'pending',
    });

    return this.scamDatabaseRepo.save(newScam);
  }

  async getPendingReports() {
    return this.scamDatabaseRepo.find({
      where: { status: 'pending' },
      order: { createdAt: 'DESC' },
    });
  }

  async approveReport(id: string, adminId: string) {
    const report = await this.scamDatabaseRepo.findOne({ where: { id } });
    if (!report) {
      throw new Error('Report not found');
    }

    report.status = 'approved';
    report.isVerified = true;
    report.reviewedBy = adminId;
    report.reviewedAt = new Date();

    return this.scamDatabaseRepo.save(report);
  }

  async rejectReport(id: string, adminId: string, reason?: string) {
    const report = await this.scamDatabaseRepo.findOne({ where: { id } });
    if (!report) {
      throw new Error('Report not found');
    }

    report.status = 'rejected';
    report.reviewedBy = adminId;
    report.reviewedAt = new Date();
    if (reason) {
      report.rejectionReason = reason;
    }

    return this.scamDatabaseRepo.save(report);
  }

  private calculateRelevanceScore(result: ScamDatabase, query: string): number {
    let score = 0;
    const lowerQuery = query.toLowerCase();
    const lowerCompanyName = result.companyName.toLowerCase();
    const lowerDomain = result.domain?.toLowerCase() || '';
    const lowerDescription = result.description.toLowerCase();
    const lowerScamType = result.scamType.toLowerCase();

    // Exact match bonus
    if (lowerCompanyName === lowerQuery) score += 50;
    else if (lowerCompanyName.startsWith(lowerQuery)) score += 30;
    else if (lowerCompanyName.includes(lowerQuery)) score += 20;

    if (lowerDomain === lowerQuery) score += 50;
    else if (lowerDomain.startsWith(lowerQuery)) score += 30;
    else if (lowerDomain.includes(lowerQuery)) score += 20;

    // Partial matches in description and scam type
    if (lowerDescription.includes(lowerQuery)) score += 10;
    if (lowerScamType.includes(lowerQuery)) score += 15;

    // Report count weight
    score += Math.min(result.reportCount, 10);

    // Verification bonus
    if (result.isVerified) score += 10;

    // Severity bonus (high severity ranked higher)
    if (result.severity === 'high') score += 5;
    else if (result.severity === 'medium') score += 3;

    // Recency bonus (entries from last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    if (result.createdAt > thirtyDaysAgo) score += 5;

    return score;
  }

  private extractMatchedTerms(result: ScamDatabase, query: string): string[] {
    const matchedTerms: string[] = [];
    const lowerQuery = query.toLowerCase();
    const lowerCompanyName = result.companyName.toLowerCase();
    const lowerDomain = result.domain?.toLowerCase() || '';
    const lowerDescription = result.description.toLowerCase();
    const lowerScamType = result.scamType.toLowerCase();

    if (lowerCompanyName.includes(lowerQuery)) matchedTerms.push('companyName');
    if (lowerDomain.includes(lowerQuery)) matchedTerms.push('domain');
    if (lowerDescription.includes(lowerQuery)) matchedTerms.push('description');
    if (lowerScamType.includes(lowerQuery)) matchedTerms.push('scamType');

    return matchedTerms;
  }
}
