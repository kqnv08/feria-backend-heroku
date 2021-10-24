import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql"
import { FilterCriteriaInfo } from "../../../core/lib"

import { UserService } from "./user.service"
import { User } from "./entities/user.entity"

import { UserInputDto } from "./dto/user.dto"
import { UserListPageInfoResponse } from "./dto/user.type"

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly engineService: UserService) { }

  @Query(() => UserListPageInfoResponse)
  async userListPage(@Args("userCriteria", { type: () => FilterCriteriaInfo }) userCriteria: FilterCriteriaInfo) {
    return await this.engineService.listPage(userCriteria)
  }

  @Query(() => [User], { name: "userSearch" })
  async search(@Args("query", { type: () => String }) query: string) {
    return await this.engineService.search(query)
  }

  @Query(() => User, { name: "userInfo" })
  async userInfo(@Args("sub", { type: () => String }) sub: string) {
    return await this.engineService.findBySub(sub)
  }

  @Query(() => [User], { name: "userFindAll" })
  async findAll(@Args("criteria", { type: () => FilterCriteriaInfo, nullable: true }) criteria: FilterCriteriaInfo) {
    return await this.engineService.findAll(criteria)
  }

  @Query(() => User, { name: "user" })
  async findOne(@Args("id", { type: () => Int }) id: number) {
    return await this.engineService.findOne(id)
  }

  @Mutation(() => User)
  async createUser(@Args("userInputDto") userInputDto: UserInputDto) {
    return await this.engineService.create(userInputDto)
  }

  @Mutation(() => User)
  async updateUser(@Args("id", { type: () => Int }) id: number, @Args("userInputDto") userInputDto: UserInputDto) {
    return await this.engineService.update(id, userInputDto)
  }

  @Mutation(() => User)
  async removeUser(@Args("id", { type: () => Int }) id: number) {
    return await this.engineService.remove(id)
  }
}
