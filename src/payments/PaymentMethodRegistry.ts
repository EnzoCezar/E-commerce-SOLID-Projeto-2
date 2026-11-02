import { injectable, multiInject } from 'inversify';
import { BusinessError } from '../domain/BusinessError';
import { TYPES } from '../container/types';
import { IPaymentMethod } from './IPaymentMethod';

@injectable()
export class PaymentMethodRegistry {
  private readonly methods: Map<string, IPaymentMethod>;

  constructor(@multiInject(TYPES.PaymentMethod) methods: IPaymentMethod[]) {
    this.methods = new Map(methods.map((m) => [m.name, m]));
  }

  get(name: string): IPaymentMethod {
    const method = this.methods.get(name);

    if (!method) {
      throw new BusinessError('Método de pagamento não suportado');
    }

    return method;
  }
}