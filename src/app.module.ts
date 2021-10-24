import { Module } from "@nestjs/common"
import { GraphQLModule } from "@nestjs/graphql"
import { ConfigModule } from "@nestjs/config"

import { ScheduleModule } from "@nestjs/schedule"
import { SnakeNamingStrategy } from "./core/lib"
import { ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { join } from "path"
import { HQLModule } from "./graphql/hql.module"
import { CronModule } from "./cron/cron.module"
import { MailModule } from './mail/mail.module';
import { CryptoService } from "./core/services/crypto.service"

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot({
      context: ({ req }) => ({ req }),
      installSubscriptionHandlers: true,
      autoSchemaFile: "schema.gql",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("DB_HOST"),
        port: +configService.get("DB_PORT"),
        username: configService.get("DB_USER"),
        password: configService.get("DB_PASS"),
        database: configService.get("DB_DATABASE"),
        entities: [join(__dirname, "**/**.entity{.ts,.js}")],
        synchronize: JSON.parse(`${configService.get("BD_SYNCHRONIZE")}`),
        logging: JSON.parse(`${configService.get("DB_LOGGING")}`),
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    HQLModule,
    CronModule,
    MailModule,
    CryptoService
  ],
})
export class AppModule { }
