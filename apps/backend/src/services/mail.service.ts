import { Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { appConfig } from '../config/app.config.ts';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export class MailService {
    private readonly logger = new Logger(MailService.name);
    private readonly transporter: Transporter;

    constructor(
        @Inject(appConfig.KEY)
        private readonly config: ConfigType<typeof appConfig>,
    ) {
        this.logger.log('MailService initialized');

        this.transporter = nodemailer.createTransport({
            host: this.config.gmail.host,
            port: this.config.gmail.port,
            secure: this.config.gmail.port === 465,
            auth: {
                user: this.config.gmail.user,
                pass: this.config.gmail.password,
            },
        });
    }

    sendVerificationEmail = async (email: string, verificationUrl: string): Promise<{ status: number; message: string }> => {
        this.send({
            to: email,
            subject: 'Email Verification',
            body: `링크를 클릭해서 회원가입을 완료해 주세요.\n link: ${verificationUrl}`,
        });

        return {
            status: 200,
            message: 'Verification email sent successfully',
        };
    };

    private send = async (payload: { to: string; subject: string; body: string }): Promise<void> => {
        //

        this.logger.log(payload);
        this.logger.log(`SMTP Config: ${JSON.stringify(this.config.gmail)}`);

        await this.transporter.sendMail({
            from: {
                name: 'Jaubi Chat',
                address: this.config.gmail.user,
            },
            to: payload.to,
            subject: payload.subject,
            text: payload.body,
        });

        return Promise.resolve();
    };
}
