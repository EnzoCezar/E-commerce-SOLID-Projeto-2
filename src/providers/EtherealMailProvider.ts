import nodemailer from 'nodemailer';
import logger from '../lib/logger';
import { IMailProvider, MailMessage } from './IMailProvider';

export class EtherealMailProvider implements IMailProvider {
  private transporter: nodemailer.Transporter | null = null;

  private async getTransporter(): Promise<nodemailer.Transporter> {
    if (this.transporter) return this.transporter;

    // Cria uma conta de teste no Ethereal automaticamente
    const testAccount = await nodemailer.createTestAccount();

    this.transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    logger.info(`Ethereal Mail configurado: ${testAccount.user}`);
    return this.transporter;
  }

  async sendMail(message: MailMessage): Promise<string | false> {
    const transporter = await this.getTransporter();
    const info = await transporter.sendMail(message);

    return nodemailer.getTestMessageUrl(info);
  }
}