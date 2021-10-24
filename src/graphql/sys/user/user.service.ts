import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { BaseService } from "../../../core/lib"

import { User } from "./entities/user.entity"

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly engineRepository: Repository<User>
  ) {
    super(engineRepository)

    this.modelClass = User
  }

  async findBySub(sub: string): Promise<User> {
    const user = await this.engineRepository.findOne({
      sub,
    })

    return user
  }

  async search(query: string): Promise<User[]> {
    const results = await this.engineRepository
      .createQueryBuilder("us")
      .where(`concat(us.firstName, " ", us.lastName) like :fullName`, { fullName: `%${query}%` })
      .getMany()

    return results
  }
}
