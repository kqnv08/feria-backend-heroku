import { Module } from "@nestjs/common"

import { MessageQueueModule } from "./message/message.module"

@Module({
  imports: [MessageQueueModule],
  exports: [MessageQueueModule],
})
export class QueueModule {}
