import { IProduct, ProductData } from './IProduct';

export class PhysicalProduct implements IProduct { 
    static readonly FREIGHT = 10;

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
        return PhysicalProduct.FREIGHT;
    }
}