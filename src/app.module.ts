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
        host: "us-cdbr-east-04.cleardb.com",
        username: "b701a8f48cd566",
        password: "63ca3aa9",
        database: "heroku_f269a747be577ca",
        entities: [join(__dirname, "**/**.entity{.ts,.js}")],
        synchronize: true,
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
