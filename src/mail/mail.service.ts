import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CryptoService } from 'src/core/services/crypto.service';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private cryptoService: CryptoService,
    private configService: ConfigService
  ) { }

  async sendConfirmation(recipients: string[], date: string, timeslot: string) {
    await this.mailerService.sendMail({
      to: recipients,
      subject: 'APPOINTMENT CONFIRMATION',
      template: './confirmation',
      context: {
        date: date,
        timeslot: timeslot
      }
    })
      .then((success) => {
        console.log(success)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  async sendConfirmationRepresentative(addresses: string, linkConfirmation: string, data: { timeslot: string, date: string, id: number }) {
    const url = this.configService.get("URL")
    const token = this.cryptoService.encrypt(JSON.stringify({
      id: data.id
    }))
    const tokenEncode = encodeURIComponent(token)
    const link = `${url}${linkConfirmation}?q=${tokenEncode}`

    const htmlMail = `<p>Dear,</p>
    <p>I am writing to inform you about the appointment of the day and time listed below:</p>
    <p><b>Date: </b>${data.date}</p>
    <p><b>Time slot: </b>${data.timeslot}</p>
    <p>To confirm <a href=${link}>Click here</a></p>
    <p>Yours sincerely.</p>
    <p>KAYAK POOLS</p>`

    await this.mailerService.sendMail({
      to: addresses,
      subject: "APPOINTMENT CONFIRMATION",
      template: './confirmationRepresentative',
      html: htmlMail
    })
      .then((success) => {
        console.log(success)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  getLinkUrl(type: string, data: any): string {
    const url = this.configService.get("URL")
    const token = this.cryptoService.encrypt(JSON.stringify({
      id: data.id,

    }))
    console.log('token', token)
    const tokenEncoded = encodeURIComponent(token)
    console.log('tokenEncoded', tokenEncoded)

    return `${url}${type}?q=${tokenEncoded}`
  }
  async sendEmail(address: string, htmlContent: string, subject: string, template?: string) {

    await this.mailerService.sendMail({
      to: address,
      subject: subject,
      template: template,
      html: htmlContent,
    })
      .then((success) => {
        console.log(success)
      })
      .catch((err) => {
        console.error(err)
      })
  }
}
