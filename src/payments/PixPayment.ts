import logger from '../lib/logger';
import { IPaymentMethod, PaymentDetails } from './IPaymentMethod';

export class PixPayment implements IPaymentMethod {
  async process(details: PaymentDetails): Promise<void> {
    logger.info('Processando Pix...');
  }
}