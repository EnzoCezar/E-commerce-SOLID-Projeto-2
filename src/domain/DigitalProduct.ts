import { IProduct, ProductData } from './IProduct';

export class DigitalProduct implements IProduct {
    readonly id: number;
    readonly name: string;
    readonly type: string;
    readonly price: number;

    constructor(data: ProductData) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.price = data.price;
    }

    calculateFreight(): number {
        return 0;
    }
}