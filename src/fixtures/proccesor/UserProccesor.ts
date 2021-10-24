import { IProcessor } from "typeorm-fixtures-cli"
import * as bcrypt from "bcrypt"
import { User } from "src/graphql/sys/user/entities/user.entity"
export default class UserProccesor implements IProcessor<User> {
  preProcess(name: string, object: any): any {
    return { ...object }
  }

  async postProcess(name: string, object: { [key: string]: any }) {
    const hashedPassword = await bcrypt.hash(object.password, 10)
    object.password = hashedPassword
  }
}
