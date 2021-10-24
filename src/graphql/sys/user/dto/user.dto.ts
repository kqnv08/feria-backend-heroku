import { InputType, Field } from "@nestjs/graphql"
import { IsNotEmpty } from "class-validator"

@InputType()
export class UserInputDto {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  firstName: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  lastName: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  sub: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  roleId: number
}
