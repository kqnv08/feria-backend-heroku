import { Injectable, Logger } from "@nestjs/common"
import { Cron } from "@nestjs/schedule"

import moment from "moment"


@Injectable()
export class TaskExampleService {
  private readonly logger = new Logger(TaskExampleService.name)

  @Cron("*/10 * * * * *")
  async handleCron() {

    const nowDAte = moment(new Date).toDate()



    this.logger.debug(`Called when the  ${nowDAte}`)
  }
}
