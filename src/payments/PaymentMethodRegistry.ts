import { IPaymentMethod } from './IPaymentMethod';
import { CreditCardPayment } from './CreditCardPayment';
import { DebitCardPayment } from './DebitCardPayment';
import { PixPayment } from './PixPayment';
import { BusinessError } from '../domain/BusinessError';

export class PaymentMethodRegistry {
  private readonly methods: Record<string, IPaymentMethod> = {
    credit_card: new CreditCardPayment(),
    debit_card: new DebitCardPayment(),
    pix: new PixPayment(),
  };

  get(name: string): IPaymentMethod {
    const method = this.methods[name];

    if (!method) {
      throw new BusinessError('Método de pagamento não suportado');
    }

    return method;
  }
}