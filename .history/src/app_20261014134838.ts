import express from 'express';
import { PrismaClient } from '@prisma/client';

import { OrderController } from './controllers/OrderController';
import { ProductFactory } from './domain/ProductFactory';
import { PaymentMethodRegistry } from './payments/PaymentMethodRegistry';
import { EtherealMailProvider } from './providers/EtherealMailProvider';
import { PrismaOrderRepository } from './repositories/PrismaOrderRepository';
import { PrismaProductRepository } from './repositories/PrismaProductRepository';
import { NotificationService } from './services/NotificationService';
import { OrderService } from './services/OrderService';

const app = express();
app.use(express.json());

// ---------- Composition Root ----------
// Único lugar que conhece as implementações concretas.

// Infraestrutura
const prisma = new PrismaClient();
const mailProvider = new EtherealMailProvider();

// Repositórios
const orderRepository = new PrismaOrderRepository(prisma);
const productRepository = new PrismaProductRepository(prisma);

// Serviços
const notificationService = new NotificationService(mailProvider);
const productFactory = new ProductFactory();
const paymentMethods = new PaymentMethodRegistry();

const orderService = new OrderService(
  orderRepository,
  productRepository,
  productFactory,
  paymentMethods,
  notificationService,
);

// Controller
const orderController = new OrderController(orderService);

app.post('/orders', orderController.processOrder.bind(orderController));

export default app;