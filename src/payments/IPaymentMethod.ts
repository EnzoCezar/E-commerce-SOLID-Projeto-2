export interface PaymentDetails {
  cardNumber?: string;
  cvv?: string;
}

export interface IPaymentMethod {
  readonly name: string;
  process(details: PaymentDetails): Promise<void>;
}