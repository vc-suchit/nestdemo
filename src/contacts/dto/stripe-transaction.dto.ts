import { Types } from 'mongoose';
export class StripeTransactionDto {
  userId: Types.ObjectId;

  stripeCustomerId?: string;

  stripeCustomerIdRes?: object;

  amount: number;

  expiryDate?: Date;

  transactionStatus: string;

  subscriptionId: Types.ObjectId;
}

export class CreditCardDto {
  CardHolderName?: string;

  CardNumber: number;

  expiry: string;

  cvv?: string;
}
