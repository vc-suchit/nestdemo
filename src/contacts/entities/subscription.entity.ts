import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export enum TransactionType {
  Free = 'Free',
  PerTransaction = 'PerTransaction',
  OneToThreeTransactionPerMonth = 'OneToThreeTransactionPerMonth',
  OneToThreeTransactionPerYear = 'OneToThreeTransactionPerYear',
  ThreeToTenTransactionPerMonth = 'ThreeToTenTransactionPerMonth',
  ThreeToTenTransactionPerYear = 'ThreeToTenTransactionPerYear',
}

@Schema({ timestamps: true })
export class Subscriptions extends Document {
  @Prop({ type: String })
  description?: string;

  @Prop({ type: Number })
  amount: number;

  @Prop({ type: String, required: true, default: TransactionType.Free })
  tractionType: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const SubscriptionsSchema = SchemaFactory.createForClass(Subscriptions);
