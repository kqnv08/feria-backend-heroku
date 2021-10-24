import { ConnectionOptions } from "typeorm"
import * as dotenv from "dotenv"
import { SnakeNamingStrategy } from "../core/lib"

dotenv.config()

const config = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  entities: ["**/*.entity*{.ts, .js}"],
  synchronize: Boolean(process.env.BD_SYNCHRONIZE),
  logging: JSON.parse(`${process.env.DB_LOGGING}`),
  namingStrategy: new SnakeNamingStrategy(),
} as ConnectionOptions

export default config
