import { Field, InputType, Int, ObjectType } from "@nestjs/graphql"
import { IsOptional } from "class-validator"

import { IFilterCriterion, ISortCriteria } from "./filter.table"

@ObjectType()
export class ListPageInfoResponse {
  @Field(() => Int, { nullable: true })
  page?: number

  @Field(() => Int, { nullable: true })
  limit?: number

  @Field(() => Int, { nullable: true })
  totalRecords?: number

  @Field(() => Int, { nullable: true })
  totalPages?: number
}

@InputType()
export class FilterCriteriaInfo {

  @Field(() => Int, { nullable: true })
  @IsOptional()
  page?: number

  @Field(() => Int, { nullable: true })
  @IsOptional()
  limit?: number

  @Field(() => [IFilterCriterion], { nullable: true })
  @IsOptional()
  filters?: Array<IFilterCriterion>

  @Field(() => ISortCriteria, { nullable: true })
  @IsOptional()
  sort?: ISortCriteria
}
