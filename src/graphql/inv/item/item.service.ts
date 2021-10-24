import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { BaseService } from "src/core/lib"

import { Item } from "./entities/item.entity"

@Injectable()
export class ItemService extends BaseService<Item> {
  constructor(
    @InjectRepository(Item)
    private readonly engineRepository: Repository<Item>
  ) {
    super(engineRepository)

    this.modelClass = Item
  }
}
