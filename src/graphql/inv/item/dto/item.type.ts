import { Field, PartialType, ObjectType } from "@nestjs/graphql"

import { ListPageInfoResponse } from "src/core/lib"

import { Item } from "../entities/item.entity"

@ObjectType()
export class ItemListPageInfoResponse extends PartialType(ListPageInfoResponse) {
  @Field(() => [Item], { nullable: true })
  data?: Item[]
}
