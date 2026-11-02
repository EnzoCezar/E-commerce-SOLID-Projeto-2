import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';

import { TYPES } from './types';
import { OrderController } from '../controllers/OrderController';
import { ProductFactory } from '../domain/ProductFactory';
import { CreditCardPayment } from '../payments/CreditCardPayment';
import { DebitCardPayment } from '../payments/DebitCardPayment';
import { PixPayment } from '../payments/PixPayment';
import { PaymentMethodRegistry } from '../payments/PaymentMethodRegistry';
import { ConsoleMailProvider } from '../providers/ConsoleMailProvider';
import { EtherealMailProvider } from '../providers/EtherealMailProvider';
import { InMemoryOrderRepository } from '../repositories/InMemoryOrderRepository';
import { PrismaOrderRepository } from '../repositories/PrismaOrderRepository';
import { PrismaProductRepository } from '../repositories/PrismaProductRepository';
import { NotificationService } from '../services/NotificationService';
import { OrderService } from '../services/OrderService';

const container = new Container();
const appEnv = process.env.APP_ENV ?? 'dev';

// Infraestrutura compartilhada
container.bind(TYPES.PrismaClient).toConstantValue(new PrismaClient());

// Infraestrutura que muda conforme o modo
if (appEnv === 'test') {
  container.bind(TYPES.MailProvider).to(ConsoleMailProvider).inSingletonScope();
  container.bind(TYPES.OrderRepository).to(InMemoryOrderRepository).inSingletonScope();
} else {
  container.bind(TYPES.MailProvider).to(EtherealMailProvider).inSingletonScope();
  container.bind(TYPES.OrderRepository).to(PrismaOrderRepository).inSingletonScope();
}

container.bind(TYPES.ProductRepository).to(PrismaProductRepository).inSingletonScope();

// Pagamentos: todos com o mesmo identificador
container.bind(TYPES.PaymentMethod).to(CreditCardPayment);
container.bind(TYPES.PaymentMethod).to(DebitCardPayment);
container.bind(TYPES.PaymentMethod).to(PixPayment);

// Domínio, serviços e controller
container.bind(TYPES.ProductFactory).to(ProductFactory);
container.bind(TYPES.PaymentMethodRegistry).to(PaymentMethodRegistry);
container.bind(TYPES.NotificationService).to(NotificationService);
container.bind(TYPES.OrderService).to(OrderService);
container.bind(TYPES.OrderController).to(OrderController);

export { container };