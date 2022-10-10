import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ timestamps: true })
export class Stripe extends Document {
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String })
  stripeCustomerId?: string;

  @Prop({ type: JSON })
  stripeCustomerIdRes?: JSON;

  @Prop({ type: Number })
  amount: number;

  @Prop({ type: String })
  transactionStatus: string;

  @Prop({ type: Types.ObjectId, required: true })
  subscriptionId: Types.ObjectId;

  @Prop({ type: Date })
  expiryDate: Date;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const StripeSchema = SchemaFactory.createForClass(Stripe);
