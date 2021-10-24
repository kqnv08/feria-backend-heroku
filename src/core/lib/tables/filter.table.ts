import { Field, Float, InputType } from "@nestjs/graphql"

export enum FilterTypesEnum {
  GreatherThan = "gt",
  GreatherThanEquals = "gte",
  LowerThan = "lt",
  LowerThanEquals = "lte",
  Like = "like",
  Equals = "eq",
  NotEquals = "neq",
  Between = "between",
  In = "in"
}

export enum FilterTypeValue {
  NUMBER = "number",
  STRING = "string",
  BOOLEAN = "bool",
  DATE = "date",
}

@InputType()
export class BetweenValue {
  @Field(() => String || Number || Date, { nullable: true })
  from?: string | number | Date
  @Field(() => String || Number || Date, { nullable: true })
  to?: string | number | Date
}

@InputType()
export class IFilterCriterion {
  @Field()
  type?: string

  @Field()
  property?: string

  @Field()
  typeValue?: string

  @Field(() => String || Float || BetweenValue, { nullable: true })
  value?: string | number | BetweenValue

  @Field(() => BetweenValue, { nullable: true })
  bvalue?: BetweenValue
}

@InputType()
export class ISortCriteria {

  @Field()
  column: string
  @Field()
  order: string
}
