import { injectable } from 'inversify';
import { IMailProvider, MailMessage } from './IMailProvider';

@injectable()
export class ConsoleMailProvider implements IMailProvider {
  async sendMail(message: MailMessage): Promise<string | false> {
    console.log('========== E-MAIL (modo test) ==========');
    console.log(`De: ${message.from}`);
    console.log(`Para: ${message.to}`);
    console.log(`Assunto: ${message.subject}`);
    console.log(message.text);
    console.log('========================================');

    return 'e-mail impresso no console';
  }
}