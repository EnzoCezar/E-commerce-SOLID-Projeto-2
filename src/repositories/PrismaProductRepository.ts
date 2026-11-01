import { PrismaClient } from '@prisma/client';
import { ProductData } from '../domain/IProduct';
import { IProductRepository } from './IProductRepository';

export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: number): Promise<ProductData | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }
}