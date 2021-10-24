import { Field, PartialType, ObjectType } from "@nestjs/graphql"

import { ListPageInfoResponse } from "../../../../core/lib/tables/criteria.table"
import { User } from "../entities/user.entity"

@ObjectType()
export class UserListPageInfoResponse extends PartialType(ListPageInfoResponse) {
  @Field(() => [User], { nullable: true })
  data?: User[]
}
