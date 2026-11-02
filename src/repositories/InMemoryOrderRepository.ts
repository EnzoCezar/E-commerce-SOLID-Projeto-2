import { injectable } from 'inversify';
import { CreateOrderData, IOrderRepository, SavedOrder } from './IOrderRepository';

@injectable()
export class InMemoryOrderRepository implements IOrderRepository {
  private readonly orders: (CreateOrderData & { id: number })[] = [];
  private nextId = 1;

  async create(data: CreateOrderData): Promise<SavedOrder> {
    const order = { id: this.nextId++, ...data };
    this.orders.push(order);
    return { id: order.id };
  }
}