import { IsNotEmpty } from "class-validator";

export class PushNotificationDto {

  @IsNotEmpty()
  token: string

  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  body: string
}
