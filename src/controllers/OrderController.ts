import { Request, Response } from 'express';
import { BusinessError } from '../domain/BusinessError';
import logger from '../lib/logger';
import { OrderService } from '../services/OrderService';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  async processOrder(req: Request, res: Response) {
    try {
      const { customer, items, paymentMethod, paymentDetails } = req.body;

      const result = await this.orderService.execute({
        customer,
        items,
        paymentMethod,
        paymentDetails,
      });

      return res.json({
        message: 'Pedido processado com sucesso',
        orderId: result.orderId,
        emailPreview: result.emailPreview,
      });
    } catch (error: any) {
      if (error instanceof BusinessError) {
        return res.status(400).json({ error: error.message });
      }

      logger.error(`Erro ao processar pedido: ${error.message}`);
      return res.status(500).json({ error: 'Erro interno' });
    }
  }
}