export class Mapper {
  map<T>(source: any): T {
    return JSON.parse(JSON.stringify(source)) as T
  }

  mapDto<T>(dto: any, model: any): T {
    const dtoParse = JSON.parse(JSON.stringify(dto))

    return Object.assign(model, dtoParse) as T
  }
}
