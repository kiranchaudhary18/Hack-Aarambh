import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { History } from '../history/history.entity';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class AnalysisService {
  constructor(@InjectRepository(History) private repo: Repository<History>) {}

  async analyzeText(input: string, userId?: string) {
    const result = this.score(input);
    const rec = this.repo.create({ input, result, userId });
    await this.repo.save(rec);
    return result;
  }

  async analyzePdf(buffer: Buffer, userId?: string, jobId?: string) {
    const parsed = await pdfParse(buffer);
    const text = parsed.text || '';
    const result = this.score(text);
    // create or update history record: if jobId provided, link by id
    const rec = this.repo.create({ input: text, result, userId, status: 'processed', processedAt: new Date() });
    await this.repo.save(rec);
    return result;
  }

  score(text: string) {
    const reasons: string[] = [];
    const lowered = text.toLowerCase();

    // salary pattern: look for large monthly/yearly amounts
    const salaryMatch = lowered.match(/\u20b9?\s?\d{2,3}[,\d]*/g);
    if (salaryMatch) {
      for (const s of salaryMatch) {
        const digits = s.replace(/[^0-9]/g, '');
        const v = Number(digits);
        if (v > 50000) {
          reasons.push('Unrealistic high salary for fresher');
          break;
        }
      }
    }

    if (lowered.includes('registration fee') || lowered.includes('training fee') || lowered.includes('pay now')) {
      reasons.push('Asking for payment');
    }

    if (lowered.includes('gmail.com') || lowered.includes('yahoo.com') || lowered.includes('hotmail.com')) {
      reasons.push('Unofficial email domain');
    }

    if (/(apply within|urgent|immediately|within 24 hours|quick response)/.test(lowered)) {
      reasons.push('Urgency pressure');
    }

    if (/(congratulations|you have been selected)/.test(lowered) && lowered.includes('offer') && !lowered.includes('interview')) {
      reasons.push('Generic congratulatory wording without process');
    }

    if ((lowered.match(/[\.!?]/g) || []).length < Math.max(1, lowered.split('\n').length / 3) && lowered.split(' ').length < 30) {
      // very short or oddly punctuated
      reasons.push('Suspicious wording or poor formatting');
    }

    const score = Math.min(100, 20 * reasons.length + this.keywordScore(lowered));
    return { isFake: score >= 50, score, reasons };
  }

  keywordScore(lowered: string) {
    let s = 0;
    const suspicious = ['scam', 'payment', 'fee', 'urgent', 'immediate', 'selected', 'congratulations', 'wire', 'upi', 'paytm'];
    for (const w of suspicious) if (lowered.includes(w)) s += 5;
    return s;
  }
}
