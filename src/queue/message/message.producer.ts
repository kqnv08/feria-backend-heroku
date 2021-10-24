import { InjectQueue } from "@nestjs/bull"
import { Injectable } from "@nestjs/common"
import { Queue } from "bull"

@Injectable()
export class MessageProducerQueue {
  constructor(@InjectQueue("message") private readonly messageQueue: Queue) {}

  async addProducerJob(data: any) {
    await this.messageQueue.add("message-job", data, {
      delay: 5000,
    })
  }
}
