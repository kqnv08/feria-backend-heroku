import { Process, Processor } from "@nestjs/bull"
import { Logger } from "@nestjs/common"
import { Job } from "bull"

@Processor("message")
export class MessageProccessQueue {
  private readonly logger = new Logger(MessageProccessQueue.name)

  @Process("message-job")
  async handle(job: Job) {
    this.logger.debug("Start transcoding...")

    this.logger.debug(job.data)

    this.logger.debug("Transcoding completed")
  }
}
