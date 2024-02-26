import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';
import { forgetPasswordTemplateUk } from './templates/forget-password-template-uk';
@Injectable()
export class MailerService {
    private transporter;

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

    async sendMail(userName: string, link: string): Promise<void> {
        const mailOptions = {
            from: 'pupils-tracker@gmail.com',
            to: 'eugene.rich30@gmail.com',
            subject: 'Reset password link',
            html: forgetPasswordTemplateUk(userName, link)
        };

        await this.transporter.sendMail(mailOptions);
    }
}