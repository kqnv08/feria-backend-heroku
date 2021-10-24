import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm"
import { ObjectType, Field, ID } from "@nestjs/graphql"

import { BaseModel } from "../../../../core/lib"

@ObjectType()
@Entity({
  name: "sys_users",
})
export class User extends BaseModel {
  @Field(() => ID, { nullable: true })
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => String, { nullable: true })
  @Column()
  firstName: string

  @Field(() => String, { nullable: true })
  @Column()
  lastName: string

  @Field(() => String, { nullable: true })
  @Column()
  sub: string

  @Field(() => String, { nullable: true })
  @Column("int")
  roleId: number


  @Field(() => Date, { nullable: true })
  @CreateDateColumn({ type: "timestamp" })
  createdAt?: Date

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn({ type: "timestamp", default: null })
  updatedAt?: Date

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ type: "timestamp", default: null })
  deletedAt?: Date



  @Field(() => String, { nullable: true })
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }
}
