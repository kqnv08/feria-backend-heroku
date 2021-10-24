import { Module } from "@nestjs/common"

import { InvModule } from "./inv/inv.module"
import { SysModule } from "./sys/sys.module"

@Module({
  imports: [InvModule, SysModule],
})
export class HQLModule {}
