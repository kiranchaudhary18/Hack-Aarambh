import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { AnalysisService } from "../analysis/analysis.service";

type Job = { id: string; buffer: Buffer; userId?: string };

@Injectable()
export class JobQueueService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger("JobQueue");
  private queue: Job[] = [];
  private timer: NodeJS.Timeout;

  constructor(private analysis: AnalysisService) {}

  enqueue(job: Job) {
    this.queue.push(job);
    this.logger.log(`Enqueued job ${job.id}`);
  }

  async processOne(job: Job) {
    try {
      await this.analysis.analyzePdf(job.buffer, job.userId, job.id);
      this.logger.log(`Processed job ${job.id}`);
    } catch (e) {
      this.logger.error(`Failed job ${job.id}: ${e}`);
    }
  }

  async tick() {
    if (this.queue.length === 0) return;
    const job = this.queue.shift();
    if (job) await this.processOne(job);
  }

  onModuleInit() {
    this.timer = setInterval(() => this.tick(), 1000);
  }

  onModuleDestroy() {
    clearInterval(this.timer);
  }
}
