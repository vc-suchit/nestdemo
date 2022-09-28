import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ timestamps: true })
export class Contact extends Document {
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: Number })
  phone: number;

  @Prop({ unique: true, lowercase: true, required: true })
  email: string;

  @Prop({ type: String })
  stripeCustomerId?: string;

  @Prop({ type: Object })
  stripeCustomerIdRes?: object;

  @Prop()
  completedAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deletedAt?: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
