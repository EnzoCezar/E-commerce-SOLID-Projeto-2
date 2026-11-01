import { BusinessError } from '../domain/BusinessError';
import { ProductFactory } from '../domain/ProductFactory';
import logger from '../lib/logger';
import { PaymentDetails } from '../payments/IPaymentMethod';
import { PaymentMethodRegistry } from '../payments/PaymentMethodRegistry';
import { IOrderRepository, OrderItemData } from '../repositories/IOrderRepository';
import { IProductRepository } from '../repositories/IProductRepository';
import { NotificationService } from './NotificationService';

export interface OrderItemInput {
  productId: number;
  quantity: number;
}

export interface ProcessOrderInput {
  customer: string;
  items: OrderItemInput[];
  paymentMethod: string;
  paymentDetails: PaymentDetails;
}

export interface ProcessOrderResult {
  orderId: number;
  emailPreview: string | false;
}

export class OrderService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository,
    private readonly productFactory: ProductFactory,
    private readonly paymentMethods: PaymentMethodRegistry,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(input: ProcessOrderInput): Promise<ProcessOrderResult> {
    const { customer, items, paymentMethod, paymentDetails } = input;

    // 1. Valida
    if (!items || items.length === 0) {
      logger.error('Tentativa de pedido sem itens');
      throw new BusinessError('Carrinho vazio');
    }

    // 2. Calcula
    let totalAmount = 0;
    const orderItems: OrderItemData[] = [];

    for (const item of items) {
      const data = await this.productRepository.findById(item.productId);

      if (!data) {
        throw new BusinessError(`Produto ${item.productId} não encontrado`);
      }

      const product = this.productFactory.create(data);

      totalAmount += product.price * item.quantity + product.calculateFreight();

      orderItems.push({
        id: product.id,
        name: product.name,
        type: product.type,
        price: product.price,
        quantity: item.quantity,
      });
    }

    // 3. Paga
    const payment = this.paymentMethods.get(paymentMethod);
    await payment.process(paymentDetails);

    // 4. Salva
    const order = await this.orderRepository.create({
      customer,
      items: orderItems,
      total: totalAmount,
      status: 'confirmed',
    });

    // 5. Notifica
    const emailPreview = await this.notificationService.sendOrderConfirmation({
      orderId: order.id,
      customer,
      total: totalAmount,
      productNames: orderItems.map((item) => item.name),
    });

    logger.info(`Email enviado: ${emailPreview}`);

    return { orderId: order.id, emailPreview };
  }
}