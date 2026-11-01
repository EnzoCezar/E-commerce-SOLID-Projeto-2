export interface PaymentDetails {
  cardNumber?: string;
  cvv?: string;
}

export interface IPaymentMethod {
  process(details: PaymentDetails): Promise<void>;
}