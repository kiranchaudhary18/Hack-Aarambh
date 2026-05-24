import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';

interface AIAnalysisResult {
  success: boolean;
  is_fake: boolean;
  scam_score: number;
  verdict: string;
  reasons: string[];
  detailed_reasons: any[];
  confidence: string;
}

@Injectable()
export class AIEngineService {
  /**
   * Call Python AI engine to analyze job offer text
   * Returns structured analysis result with scam score and reasons
   */
  async analyzeText(text: string): Promise<AIAnalysisResult> {
    return new Promise((resolve, reject) => {
      const pythonScriptPath = path.join(
        __dirname,
        '..',
        'ai-engine',
        'api',
        'predict.py'
      );

      // Spawn Python process
      const pythonProcess = spawn('python3', [pythonScriptPath, text]);

      let output = '';
      let error = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          // Fallback to rule-based scoring if Python fails
          console.warn(`Python process exited with code ${code}: ${error}`);
          return resolve(this.fallbackAnalysis(text));
        }

        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (e) {
          console.error('Error parsing AI result:', e);
          resolve(this.fallbackAnalysis(text));
        }
      });

      // Send input via stdin
      pythonProcess.stdin.write(JSON.stringify({ text }));
      pythonProcess.stdin.end();

      // Timeout after 10 seconds
      setTimeout(() => {
        pythonProcess.kill();
        reject(new Error('AI analysis timeout'));
      }, 10000);
    });
  }

  /**
   * Fallback to basic heuristic analysis if Python fails
   */
  private fallbackAnalysis(text: string): AIAnalysisResult {
    const score = this.calculateBasicScore(text);
    
    return {
      success: true,
      is_fake: score > 60,
      scam_score: score,
      verdict: score > 70 ? 'Likely Scam' : score > 50 ? 'Suspicious' : 'Likely Real',
      reasons: this.extractBasicReasons(text),
      detailed_reasons: [],
      confidence: score > 80 || score < 20 ? 'high' : 'medium'
    };
  }

  private calculateBasicScore(text: string): number {
    let score = 0;
    const textLower = text.toLowerCase();

    // Payment keywords
    if (textLower.includes('pay') || textLower.includes('fee')) score += 20;
    if (textLower.includes('registration')) score += 15;

    // Urgency
    if (textLower.includes('urgent') || textLower.includes('limited time')) score += 15;

    // Salary suspicious patterns
    if (textLower.match(/₹\s*[0-9]{5,}/)) score += 15;

    // Email checks
    if (textLower.includes('gmail') || textLower.includes('yahoo')) score += 10;

    // Phrase checks
    if (textLower.includes('work from home') || textLower.includes('easy money')) score += 10;

    return Math.min(score, 100);
  }

  private extractBasicReasons(text: string): string[] {
    const reasons: string[] = [];
    const textLower = text.toLowerCase();

    if (textLower.includes('pay') || textLower.includes('fee')) {
      reasons.push('Payment request detected');
    }
    if (textLower.includes('urgent')) {
      reasons.push('Urgency tactics detected');
    }
    if (textLower.match(/₹\s*[0-9]{5,}/)) {
      reasons.push('Unrealistic salary claim');
    }
    if (textLower.includes('gmail') || textLower.includes('yahoo')) {
      reasons.push('Free email domain used');
    }

    return reasons;
  }
}
