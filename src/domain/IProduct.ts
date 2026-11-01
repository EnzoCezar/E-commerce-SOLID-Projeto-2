export interface ProductData {
    id: number;
    name: string;
    type: string;
    price: number;
}

export interface IProduct {
    readonly id: number;
    readonly name: string;
    readonly type: string;
    readonly price: number;

    calculateFreight(): number;
}