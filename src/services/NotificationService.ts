import { IMailProvider } from '../providers/IMailProvider';

export interface OrderConfirmation {
  orderId: number;
  customer: string;
  total: number;
  productNames: string[];
}

export class NotificationService {
  constructor(private readonly mailProvider: IMailProvider) {}

  async sendOrderConfirmation(order: OrderConfirmation): Promise<string | false> {
    return this.mailProvider.sendMail({
      from: '"DevStore" <noreply@devstore.com>',
      to: order.customer,
      subject: `Confirmação do Pedido #${order.orderId}`,
      text: `Olá, seu pedido #${order.orderId} no valor de R$ ${order.total} foi confirmado.`,
      html: `
        <h1>Pedido Confirmado!</h1>
        <p>Olá, seu pedido <b>#${order.orderId}</b> foi processado com sucesso.</p>
        <p>Total: <strong>R$ ${order.total}</strong></p>
        <ul>
          ${order.productNames.map((name) => `<li>${name}</li>`).join('')}
        </ul>
      `,
    });
  }
}