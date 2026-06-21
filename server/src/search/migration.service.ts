import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScamDatabase } from './search.entity';
import { History } from '../history/history.entity';
import { ExtensionScan } from '../extension/extension-scan.entity';

@Injectable()
export class MigrationService {
  constructor(
    @InjectRepository(ScamDatabase)
    private scamDatabaseRepo: Repository<ScamDatabase>,
    @InjectRepository(History)
    private historyRepo: Repository<History>,
    @InjectRepository(ExtensionScan)
    private extensionScanRepo: Repository<ExtensionScan>,
  ) {}

  async migrateFromHistory() {
    const historyRecords = await this.historyRepo.find({
      where: { status: 'processed' },
    });

    let migratedCount = 0;

    for (const record of historyRecords) {
      try {
        const result = typeof record.result === 'string' ? JSON.parse(record.result) : record.result;
        
        if (!result || !result.isFake) continue; // Only migrate scams

        const companyName = this.extractCompanyName(record.input);
        const domain = this.extractDomain(record.input);
        const scamType = this.categorizeScamType(result.reasons || []);
        const severity = this.calculateSeverity(result.score || 0);
        const description = this.generateDescription(record.input, result.reasons || []);

        // Check if already exists
        const whereConditions: any = [{ companyName }];
        if (domain) {
          whereConditions.push({ domain });
        }
        
        const existing = await this.scamDatabaseRepo.findOne({
          where: whereConditions,
        });

        if (existing) {
          existing.reportCount += 1;
          existing.sources.push({
            type: 'history_migration',
            historyId: record.id,
            timestamp: new Date(),
          });
          await this.scamDatabaseRepo.save(existing);
        } else {
          const newScam = this.scamDatabaseRepo.create({
            companyName: companyName || 'Unknown Company',
            domain: domain || undefined,
            scamType,
            severity,
            description,
            reportCount: 1,
            sources: [
              {
                type: 'history_migration',
                historyId: record.id,
                timestamp: new Date(),
              },
            ],
            isVerified: false,
            isExternal: false,
          });
          await this.scamDatabaseRepo.save(newScam);
        }

        migratedCount++;
      } catch (error) {
        console.error(`Error migrating history record ${record.id}:`, error);
      }
    }

    return { migratedCount, total: historyRecords.length };
  }

  async migrateFromExtensionScan() {
    const extensionScans = await this.extensionScanRepo.find({
      where: { isScam: true },
    });

    let migratedCount = 0;

    for (const scan of extensionScans) {
      try {
        const companyName = scan.pageTitle || 'Unknown Company';
        const domain = scan.domain;
        const scamType = this.categorizeScamTypeFromScan(scan.scanType);
        const severity = 'medium'; // Default for extension scans
        const description = `Scam detected via browser extension at ${scan.url}`;

        // Check if already exists
        const whereConditions: any = [{ companyName }];
        if (domain) {
          whereConditions.push({ domain });
        }
        
        const existing = await this.scamDatabaseRepo.findOne({
          where: whereConditions,
        });

        if (existing) {
          existing.reportCount += 1;
          existing.sources.push({
            type: 'extension_migration',
            scanId: scan.id,
            timestamp: new Date(),
          });
          await this.scamDatabaseRepo.save(existing);
        } else {
          const newScam = this.scamDatabaseRepo.create({
            companyName,
            domain: domain || undefined,
            scamType,
            severity,
            description,
            reportCount: 1,
            sources: [
              {
                type: 'extension_migration',
                scanId: scan.id,
                timestamp: new Date(),
              },
            ],
            isVerified: false,
            isExternal: false,
          });
          await this.scamDatabaseRepo.save(newScam);
        }

        migratedCount++;
      } catch (error) {
        console.error(`Error migrating extension scan ${scan.id}:`, error);
      }
    }

    return { migratedCount, total: extensionScans.length };
  }

  async runFullMigration() {
    const historyResult = await this.migrateFromHistory();
    const extensionResult = await this.migrateFromExtensionScan();

    return {
      history: historyResult,
      extension: extensionResult,
      totalMigrated: historyResult.migratedCount + extensionResult.migratedCount,
    };
  }

  private extractCompanyName(input: string): string | null {
    if (!input) return null;
    
    const patterns = [
      /(?:at|@)\s+([A-Z][A-Za-z\s]+?)(?:\n|$|,|\.)/i,
      /(?:company|organization|firm)\s*[:\-]?\s*([A-Z][A-Za-z\s]+?)(?:\n|$|,|\.)/i,
      /^([A-Z][A-Za-z\s]+?)(?:\n|$)/i,
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match && match[1]) {
        const company = match[1].trim();
        if (company.length > 2 && company.length < 50) {
          return company;
        }
      }
    }

    return null;
  }

  private extractDomain(input: string): string | null {
    if (!input) return null;
    
    const domainPattern = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/;
    const match = input.match(domainPattern);
    
    return match ? match[1] : null;
  }

  private categorizeScamType(reasons: string[]): string {
    const lowerReasons = reasons.map(r => r.toLowerCase());
    
    if (lowerReasons.some(r => r.includes('fee') || r.includes('payment') || r.includes('pay'))) {
      return 'Advance-fee fraud';
    }
    if (lowerReasons.some(r => r.includes('gmail') || r.includes('yahoo') || r.includes('hotmail'))) {
      return 'Brand impersonation';
    }
    if (lowerReasons.some(r => r.includes('crypto') || r.includes('wallet') || r.includes('bitcoin'))) {
      return 'Crypto wallet scam';
    }
    if (lowerReasons.some(r => r.includes('hr') || r.includes('call') || r.includes('interview'))) {
      return 'Fake HR call';
    }
    if (lowerReasons.some(r => r.includes('salary') || r.includes('unrealistic'))) {
      return 'Fake salary offer';
    }
    if (lowerReasons.some(r => r.includes('urgent') || r.includes('immediate'))) {
      return 'Urgency tactics';
    }
    
    return 'Other';
  }

  private categorizeScamTypeFromScan(scanType: string): string {
    switch (scanType) {
      case 'url':
        return 'Phishing URL';
      case 'email':
        return 'Email scam';
      case 'text':
        return 'Text message scam';
      default:
        return 'Other';
    }
  }

  private calculateSeverity(score: number): string {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  }

  private generateDescription(input: string, reasons: string[]): string {
    const truncatedInput = input.length > 200 ? input.substring(0, 200) + '...' : input;
    return `Suspicious job offer detected. ${reasons.join(', ')}. Original content: ${truncatedInput}`;
  }
}
