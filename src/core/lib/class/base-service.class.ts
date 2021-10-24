import { Injectable, InternalServerErrorException } from "@nestjs/common"
import { getConnection, QueryRunner, Repository, UpdateResult } from "typeorm"
import { paginate } from "nestjs-typeorm-paginate"

import { FilterCriteriaInfo, ListPageInfoResponse } from "../tables/criteria.table"

import { BetweenValue, FilterTypesEnum } from "../tables/filter.table"
import { getInValue, setValueCriteria } from "../utils/value-criteria.util"
import { BaseModel } from "../class/base-model.class"

@Injectable()
export abstract class BaseService<T extends BaseModel> {

  _modelClass: typeof BaseModel

  get modelClass() {
    return this._modelClass
  }

  set modelClass(model) {
    this._modelClass = model
  }

  constructor(private readonly engineRepo: Repository<T>) { }

  async listPage(criteria: FilterCriteriaInfo): Promise<ListPageInfoResponse> {
    const queryBuilder = this.engineRepo.createQueryBuilder("c")

    if (criteria.filters.length > 0) {
      criteria.filters.forEach((filter) => {
        switch (filter.type) {
          case FilterTypesEnum.Equals:
            queryBuilder.andWhere(`c.${filter.property} = :${filter.property}`, {
              [filter.property]: setValueCriteria(filter.value, filter.typeValue),
            })
            break
          case FilterTypesEnum.NotEquals:
            queryBuilder.andWhere(`c.${filter.property} != :${filter.property}`, {
              [filter.property]: setValueCriteria(filter.value, filter.typeValue),
            })
            break
          case FilterTypesEnum.GreatherThan:
            queryBuilder.andWhere(`c.${filter.property} > :${filter.property}`, {
              [filter.property]: setValueCriteria(filter.value, filter.typeValue),
            })
            break
          case FilterTypesEnum.GreatherThanEquals:
            queryBuilder.andWhere(`c.${filter.property} >= :${filter.property}`, {
              [filter.property]: setValueCriteria(filter.value, filter.typeValue),
            })
            break
          case FilterTypesEnum.LowerThan:
            queryBuilder.andWhere(`c.${filter.property} < :${filter.property}`, {
              [filter.property]: setValueCriteria(filter.value, filter.typeValue),
            })
            break
          case FilterTypesEnum.LowerThanEquals:
            queryBuilder.andWhere(`c.${filter.property} <= :${filter.property}`, {
              [filter.property]: setValueCriteria(filter.value, filter.typeValue),
            })
            break
          case FilterTypesEnum.Like:
            queryBuilder.andWhere(`c.${filter.property} like :${filter.property}`, {
              [filter.property]: setValueCriteria(`%${filter.value}%`, filter.typeValue),
            })
            break
          case FilterTypesEnum.Between:
            const between = filter.bvalue as BetweenValue

            queryBuilder.andWhere(`c.${filter.property} BETWEEN :from AND :to`, {
              from: setValueCriteria(between.from, filter.typeValue),
              to: setValueCriteria(between.to, filter.typeValue),
            })
            break
        }
      })
    }

    const resPaginate = await paginate(queryBuilder, { page: criteria.page, limit: criteria.limit })

    return <ListPageInfoResponse>{
      page: criteria.page,
      limit: criteria.limit,
      totalRecords: resPaginate.meta.totalItems,
      totalPages: resPaginate.meta.totalPages,
      data: resPaginate.items as T[]
    }
  }

  async findAll(criteria?: FilterCriteriaInfo): Promise<Array<T>> {

    if (criteria.filters && criteria.filters.length > 0) {

      const queryBuilder = this.engineRepo
        .createQueryBuilder('c')

      criteria.filters.forEach((filter) => {

        switch (filter.type) {
          case FilterTypesEnum.Equals:
            queryBuilder.andWhere(`c.${filter.property} = :${filter.property}`, {
              [filter.property]: setValueCriteria(filter.value, filter.typeValue)
            })
            break
          case FilterTypesEnum.NotEquals:
            queryBuilder.andWhere(`c.${filter.property} != :${filter.property}`, {
              [filter.property]: setValueCriteria(filter.value, filter.typeValue)
            })
            break
          case FilterTypesEnum.GreatherThan:
            queryBuilder.andWhere(`c.${filter.property} > :${filter.property}`, {
              [filter.property]: setValueCriteria(filter.value, filter.typeValue)
            })
            break
          case FilterTypesEnum.GreatherThanEquals:
            queryBuilder.andWhere(`c.${filter.property} >= :${filter.property}`, {
              [filter.property]: setValueCriteria(filter.value, filter.typeValue)
            })
            break
          case FilterTypesEnum.LowerThan:
            queryBuilder.andWhere(`c.${filter.property} < :${filter.property}`, {
              [filter.property]: setValueCriteria(filter.value, filter.typeValue)
            })
            break
          case FilterTypesEnum.LowerThanEquals:
            queryBuilder.andWhere(`c.${filter.property} <= :${filter.property}`, {
              [filter.property]: setValueCriteria(filter.value, filter.typeValue)
            })
            break
          case FilterTypesEnum.Like:
            queryBuilder.andWhere(`c.${filter.property} like :${filter.property}`, {
              [filter.property]: setValueCriteria(`${filter.value}`, filter.typeValue)
            })
            break
          case FilterTypesEnum.Between:

            const between = filter.bvalue as BetweenValue

            queryBuilder.andWhere(`c.${filter.property} BETWEEN :from AND :to`, {
              from: setValueCriteria(between.from, filter.typeValue),
              to: setValueCriteria(between.to, filter.typeValue)
            })

            break

          case FilterTypesEnum.In:
            const values = getInValue(filter.value)
            queryBuilder.andWhere(`c.${filter.property} IN (${values})`,
              {
                [filter.property]: setValueCriteria(filter.value, filter.typeValue)
              }
            )
            break
        }
      })

      if (criteria.sort) {
        queryBuilder.orderBy("`" + criteria.sort.column + "`", <"ASC" | "DESC">criteria.sort.order)
      }
      return await queryBuilder.getMany()
    }

    return await this.engineRepo.find({})
  }

  async findOne(id: number): Promise<T> {
    const base = await this.engineRepo.findOne(String(id))

    return base
  }

  async create(attrs: any, connect: QueryRunner = null): Promise<T | T[]> {

    const queryRunner = connect != null ? connect : getConnection().createQueryRunner()

    try {

      if (connect == null) {
        await queryRunner.startTransaction()
      }

      const payload: T = Object.assign(new this._modelClass(), attrs)

      const result = await queryRunner.manager.save(payload)

      if (connect == null) {
        await queryRunner.commitTransaction()
      }

      return result
    } catch (error) {
      console.log(error)

      await queryRunner.rollbackTransaction()

      throw error
    } finally {

      if (connect == null) {
        await queryRunner.release()
      }
    }
  }

  async update(id: number, attrs: any, connect: QueryRunner = null): Promise<T | T[]> {

    const queryRunner = connect != null ? connect : getConnection().createQueryRunner()

    try {

      if (connect == null) {
        await queryRunner.startTransaction()
      }

      const entity = await this.findOne(id)

      if (!entity) throw new InternalServerErrorException("No se encontró el registro a actualizar.")

      const payload = Object.assign(new this.modelClass(), entity, attrs)

      const result = await queryRunner.manager.save(payload)

      if (connect == null) {
        await queryRunner.commitTransaction()
      }

      return result
    } catch (error) {
      console.log(error)

      if (connect == null) {
        await queryRunner.rollbackTransaction()
      }

      throw error
    } finally {

      if (connect == null) {
        await queryRunner.release()
      }
    }
  }

  async remove(id: number, connect: QueryRunner = null): Promise<any> {

    const queryRunner = connect != null ? connect : getConnection().createQueryRunner()

    try {

      if (connect == null) {
        await queryRunner.startTransaction()
      }

      const entity = await this.findOne(id)

      const payload = Object.assign(new this.modelClass(), entity)

      await queryRunner.manager.softRemove(payload)

      if (connect == null) {
        await queryRunner.commitTransaction()
      }

      return payload
    } catch (error) {
      console.log("remove.catch", error, connect)

      if (connect == null) {
        await queryRunner.rollbackTransaction()
      }

      throw error
    } finally {

      if (connect == null) {
        await queryRunner.release()
      }
    }
  }

  async restore(id: number): Promise<UpdateResult> {
    try {
      const isRestored = await this.engineRepo.restore(String(id))

      return isRestored
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
