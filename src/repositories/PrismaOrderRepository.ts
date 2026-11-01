import { PrismaClient } from '@prisma/client';
import { CreateOrderData, IOrderRepository, SavedOrder } from './IOrderRepository';

export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateOrderData): Promise<SavedOrder> {
    const order = await this.prisma.order.create({
      data: {
        customer: data.customer,
        items: JSON.stringify(data.items),
        total: data.total,
        status: data.status,
      },
    });

    return { id: order.id };
  }
}