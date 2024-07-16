import { Injectable, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { forgetPasswordTemplateUK } from './templates/forget-password-template-uk';
import { forgetPasswordTemplateEN } from './templates/forget-password-template-en';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { IMailOptions } from '../common/interfaces';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter<SentMessageInfo>;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS,
      },
    });
  }

  async sendMail(
    userName: string,
    link: string,
    locale: string,
    userEmail: string,
  ): Promise<void> {
    const mailOptions: IMailOptions = {
      from: `${process.env.MAIL_AUTH_USER}`,
      to: `${userEmail}`,
      subject:
        locale === `uk` ? 'Силка на зміну паролю' : 'Reset password link',
      html:
        locale === `uk`
          ? forgetPasswordTemplateUK(userName, link)
          : forgetPasswordTemplateEN(userName, link),
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (e) {
      throw new NotFoundException('inc_mailer');
    }
  }
}
