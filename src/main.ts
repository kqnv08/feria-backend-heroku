import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { json, text, urlencoded } from "express"
import { AppModule } from "./app.module"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(json({ limit: "50mb" }))
  app.use(text({ limit: "50mb" }))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  )
  app.use(urlencoded({ extended: true, limit: "50mb" }))

  await app.listen(5000)
}
bootstrap()
