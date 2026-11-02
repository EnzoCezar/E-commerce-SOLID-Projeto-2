import { injectable } from 'inversify';
import logger from '../lib/logger';
import { IPaymentMethod, PaymentDetails } from './IPaymentMethod';

@injectable()
export class PixPayment implements IPaymentMethod {
  readonly name = 'pix';

  async process(details: PaymentDetails): Promise<void> {
    logger.info('Processando Pix...');
  }
}