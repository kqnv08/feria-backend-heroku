import { Module } from '@nestjs/common'
import { ConfigService } from "@nestjs/config"
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

import { MailService } from './mail.service'
import { join } from 'path'
import { CryptoService } from 'src/core/services/crypto.service'

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get("MAILING_HOST"),
          port: configService.get("MAILING_PORT"),
          debug: configService.get("MAILING_DEBUG"),
          auth: {
            user: configService.get("MAILING_AUTH_USER"),
            pass: configService.get("MAILING_AUTH_PASS"),
          },
          tls: {
            rejectUnauthorized: false
          }
        },
        defaults: {
          from: '"No Reply" <noreply@gmail.com>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService,CryptoService],
  exports: [MailService,CryptoService],
})
export class MailModule { }
