import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact, ContactSchema } from './entities/contact.entity';
import { Model, Types } from 'mongoose';
import { Stripe, StripeSchema } from './entities/stripe.entity';
import { Subscriptions, SubscriptionsSchema } from './entities/subscription.entity';
import { InjectModel } from '@nestjs/mongoose';

// check here
@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact.name)
    private readonly model: Model<Contact>,
    @InjectModel(Stripe.name)
    private readonly stripeModel: Model<Stripe>,
    @InjectModel(Subscriptions.name)
    private readonly SubscriptionModel: Model<Subscriptions>,
  ) { }

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const libraryDocument = new this.model({
      ...createContactDto,
      completedAt: new Date(),
    });
    return libraryDocument.save();
  }

  async findAll() {
    return await this.model.find().exec();
  }

  async findOne(id: number) {
    return await this.model.findById(new Types.ObjectId(id)).exec();
  }

  async update(
    id: string,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    return await this.model.findByIdAndUpdate(id, updateContactDto).exec();
  }

  async findOneByQuery(id: string) {
    return await this.model.findById(new Types.ObjectId(id)).exec();
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }

  async getSubscriptionDetails() {
    return await this.SubscriptionModel.find().exec();
  }

}
