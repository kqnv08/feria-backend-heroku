import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql"

import { FilterCriteriaInfo } from "src/core/lib"

import { ItemService } from "./item.service"
import { Item } from "./entities/item.entity"

import { ItemInputDto } from "./dto/item.dto"
import { ItemListPageInfoResponse } from "./dto/item.type"

@Resolver(() => Item)
export class ItemResolver {
  constructor(private readonly engineService: ItemService) { }

  @Query(() => ItemListPageInfoResponse)
  async itemListPage(@Args("itemCriteria", { type: () => FilterCriteriaInfo }) itemCriteria: FilterCriteriaInfo) {
    return await this.engineService.listPage(itemCriteria)
  }

  @Query(() => [Item], { name: "itemFindAll" })
  async findAll(@Args("criteria", { type: () => FilterCriteriaInfo, nullable: true }) criteria: FilterCriteriaInfo) {
    return await this.engineService.findAll(criteria)
  }

  @Query(() => Item, { name: "item" })
  async findOne(@Args("id", { type: () => Int }) id: number) {
    return await this.engineService.findOne(id)
  }

  @Mutation(() => Item)
  async createItem(@Args("itemInputDto") itemInputDto: ItemInputDto) {
    return await this.engineService.create(itemInputDto)
  }

  @Mutation(() => Item)
  async updateItem(@Args("id", { type: () => Int }) id: number, @Args("itemInputDto") itemInputDto: ItemInputDto) {
    return await this.engineService.update(id, itemInputDto)
  }

  @Mutation(() => Item)
  async removeItem(@Args("id", { type: () => Int }) id: number) {
    return await this.engineService.remove(id)
  }
}
