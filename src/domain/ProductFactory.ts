import { IProduct, ProductData } from './IProduct';
import { PhysicalProduct } from './PhysicalProduct';
import { DigitalProduct } from './DigitalProduct';
import { BusinessError } from './BusinessError';

type ProductBuilder = (data: ProductData) => IProduct;

export class ProductFactory {
    private readonly builders: Record<string, ProductBuilder> = {
        physical: (data) => new PhysicalProduct(data),
        digital: (data) => new DigitalProduct(data),
    };

    create(data: ProductData): IProduct {
        const build = this.builders[data.type];

        if (!build) {
            throw new BusinessError(`Tipo de produto não suportado: ${data.type}`);
        }

        return build(data);
    }
}