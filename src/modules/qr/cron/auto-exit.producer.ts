import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AutoExitProducer {
  constructor(
    @InjectQueue('auto-exit')
    private readonly autoExitQueue: Queue,
  ) {}

  // ENTRY sonrası job ekler
  async addAutoExitJob(memberId: string, tenantId: string, delayMs: number) {
    console.log(`Adding auto-exit job for member ${memberId}`);
    return await this.autoExitQueue.add(
      'auto-exit',
      { memberId, tenantId },
      { delay: delayMs, removeOnComplete: true, removeOnFail: true },
    );
  }

  // EXIT yapılırsa job iptal edilir
  async removeAutoExitJob(memberId: string) {
    const jobs = await this.autoExitQueue.getDelayed();
    for (const job of jobs) {
      if (job.data.memberId === memberId) {
        await job.remove();
      }
    }
  }
}
