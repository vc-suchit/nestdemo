import { Types } from 'mongoose';
export class StripeTransactionDto {
  userId: Types.ObjectId;

  stripeCustomerId?: string;

  stripeCustomerIdRes?: JSON;

  amount: number;

  transactionStatus: string;

  subscriptionId: string;

  expiryDate: Date;
}
