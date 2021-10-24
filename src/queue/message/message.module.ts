import { BullModule } from "@nestjs/bull"
import { Module } from "@nestjs/common"
import { QueueConfigModule } from "src/config/queue.config"
import { MessageProccessQueue } from "./message.proccess"
import { MessageProducerQueue } from "./message.producer"

@Module({
  imports: [
    QueueConfigModule,
    BullModule.registerQueue({
      name: "message",
    }),
  ],
  providers: [MessageProducerQueue, MessageProccessQueue],
  exports: [MessageProducerQueue, MessageProccessQueue],
})
export class MessageQueueModule {}
