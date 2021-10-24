import { Module } from "@nestjs/common"
// import { DayModule } from "src/graphql/adm/day/day.module"

//import { TaskExampleService } from "./example.task"

@Module({
  imports: [
    //forwardRef(() => DayModule)
  ],
  providers: [
    //TaskExampleService
  ],
})
export class SysCronModule { }
