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

    /**
     * 이메일 인증 링크를 텍스트 및 HTML 본문으로 구성하여 발송한다.
     */
    sendVerificationEmail = async (email: string, verificationUrl: string): Promise<{ status: number; message: string }> => {
        await this.send({
            to: email,
            subject: 'Email Verification',
            text: [
                'Jaubi Chat 회원가입을 진행해 주셔서 감사합니다.',
                '',
                '아래 링크를 열어 이메일 인증을 완료해 주세요.',
                verificationUrl,
                '',
                '이 링크는 1시간 동안 유효합니다.',
                '본인이 요청하지 않았다면 이 메일을 무시해 주세요.',
            ].join('\n'),
            html: this.createVerificationEmailHtml(verificationUrl),
        });

        return {
            status: 200,
            message: 'Verification email sent successfully',
        };
    };

    /**
     * 로컬 환경에서는 모든 메일을 개발용 수신자에게 전달하고,
     * 그 외 환경에서는 원래 수신자를 사용한다.
     */
    private resolveRecipient(originalRecipient: string): string {
        if (this.config.nodeEnv !== 'local') {
            return originalRecipient;
        }

        if (!this.config.gmail.devRecipient) {
            throw new Error('로컬 환경에서는 SMTP_DEV_RECIPIENT 설정이 필요합니다.');
        }

        return this.config.gmail.devRecipient;
    }

    /**
     * 실행 환경에 맞는 수신자와 제목을 결정하여 SMTP 메일을 발송한다.
     */
    private send = async (payload: { to: string; subject: string; text: string; html?: string }): Promise<void> => {
        const isLocal = this.config.nodeEnv === 'local';
        const recipient = this.resolveRecipient(payload.to);
        const subject = isLocal ? `[LOCAL][원래 수신자: ${payload.to}] ${payload.subject}` : payload.subject;

        await this.transporter.sendMail({
            from: {
                name: 'Jaubi Chat',
                address: this.config.gmail.user,
            },
            to: recipient,
            subject: subject,
            text: payload.text,
            html: payload.html,
        });

        return Promise.resolve();
    };

    /**
     * 이메일 인증 메일에 사용할 HTML 본문을 생성한다.
     */
    private createVerificationEmailHtml(verificationUrl: string): string {
        return `
<!doctype html>
<html lang="ko">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Jaubi Chat 이메일 인증</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8;">
    <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="background-color: #f4f6f8;"
    >
        <tr>
            <td align="center" style="padding: 40px 16px;">
                <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style="
                        max-width: 560px;
                        background-color: #ffffff;
                        border: 1px solid #e5e7eb;
                        border-radius: 16px;
                    "
                >
                    <tr>
                        <td style="padding: 40px 32px;">
                            <div
                                style="
                                    margin-bottom: 24px;
                                    color: #111827;
                                    font-family: Arial, sans-serif;
                                    font-size: 24px;
                                    font-weight: 700;
                                "
                            >
                                Jaubi Chat
                            </div>

                            <h1
                                style="
                                    margin: 0 0 16px;
                                    color: #111827;
                                    font-family: Arial, sans-serif;
                                    font-size: 22px;
                                    line-height: 1.4;
                                "
                            >
                                이메일 주소를 인증해 주세요
                            </h1>

                            <p
                                style="
                                    margin: 0 0 24px;
                                    color: #4b5563;
                                    font-family: Arial, sans-serif;
                                    font-size: 15px;
                                    line-height: 1.7;
                                "
                            >
                                Jaubi Chat 회원가입을 진행해 주셔서 감사합니다.<br>
                                아래 버튼을 눌러 이메일 인증을 완료해 주세요.
                            </p>

                            <table
                                role="presentation"
                                cellspacing="0"
                                cellpadding="0"
                                border="0"
                            >
                                <tr>
                                    <td
                                        bgcolor="#2563eb"
                                        style="border-radius: 8px;"
                                    >
                                        <a
                                            href="${verificationUrl}"
                                            target="_blank"
                                            style="
                                                display: inline-block;
                                                padding: 14px 24px;
                                                color: #ffffff;
                                                font-family: Arial, sans-serif;
                                                font-size: 15px;
                                                font-weight: 700;
                                                text-decoration: none;
                                            "
                                        >
                                            이메일 인증하기
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p
                                style="
                                    margin: 24px 0 0;
                                    color: #6b7280;
                                    font-family: Arial, sans-serif;
                                    font-size: 13px;
                                    line-height: 1.6;
                                "
                            >
                                인증 링크는 1시간 동안 유효합니다.<br>
                                본인이 회원가입을 요청하지 않았다면 이 메일을
                                무시해 주세요.
                            </p>

                            <hr
                                style="
                                    margin: 32px 0 24px;
                                    border: 0;
                                    border-top: 1px solid #e5e7eb;
                                "
                            >

                            <p
                                style="
                                    margin: 0 0 8px;
                                    color: #9ca3af;
                                    font-family: Arial, sans-serif;
                                    font-size: 12px;
                                    line-height: 1.6;
                                "
                            >
                                버튼이 동작하지 않으면 아래 주소를 브라우저에
                                복사해 주세요.
                            </p>

                            <p
                                style="
                                    margin: 0;
                                    color: #2563eb;
                                    font-family: Arial, sans-serif;
                                    font-size: 12px;
                                    line-height: 1.6;
                                    overflow-wrap: anywhere;
                                "
                            >
                                ${verificationUrl}
                            </p>
                        </td>
                    </tr>
                </table>

                <p
                    style="
                        margin: 16px 0 0;
                        color: #9ca3af;
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                    "
                >
                    © Jaubi Chat
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
    }
}
