import { Module } from "@nestjs/common"
import { BullModule } from "@nestjs/bull"
import { ConfigModule, ConfigService } from "@nestjs/config"

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get("QUEUE_HOST"),
          port: +configService.get("QUEUE_PORT"),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class QueueConfigModule {}
