import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { ItemService } from "./item.service"
import { ItemResolver } from "./item.resolver"

import { Item } from "./entities/item.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  providers: [ItemResolver, ItemService],
  exports: [ItemResolver, ItemService],
})
export class ItemModule {}
