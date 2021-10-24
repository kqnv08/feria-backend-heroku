import { ObjectType } from "@nestjs/graphql"

@ObjectType({
  isAbstract: true,
})
export class BaseModel { }
