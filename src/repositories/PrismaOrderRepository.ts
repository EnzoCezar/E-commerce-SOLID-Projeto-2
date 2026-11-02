import { inject, injectable } from 'inversify';
import { TYPES } from '../container/types';
import { PrismaClient } from '@prisma/client';
import { CreateOrderData, IOrderRepository, SavedOrder } from './IOrderRepository';

@injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(@inject(TYPES.PrismaClient) private readonly prisma: PrismaClient) {}

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