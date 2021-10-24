import { Module } from "@nestjs/common"

import { SysCronModule } from "./sys/sys.cron"

@Module({
  imports: [
    SysCronModule
  ]
})
export class CronModule { }
