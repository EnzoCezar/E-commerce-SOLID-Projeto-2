export interface OrderItemData {
  id: number;
  name: string;
  type: string;
  price: number;
  quantity: number;
}

export interface CreateOrderData {
  customer: string;
  items: OrderItemData[];
  total: number;
  status: string;
}

export interface SavedOrder {
  id: number;
}

export interface IOrderRepository {
  create(data: CreateOrderData): Promise<SavedOrder>;
}