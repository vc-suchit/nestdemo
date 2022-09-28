import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Stripe, StripeSchema } from './entities/stripe.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

// check here
@Injectable()
export class StripesService {
  constructor(
    @InjectModel(Stripe.name)
    private readonly model: Model<Stripe>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Stripe> {
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
    console.log('id==', id);
    return await this.model.findById(new Types.ObjectId(id)).exec();
  }

  async update(
    id: string,
    updateContactDto: UpdateContactDto,
  ): Promise<Stripe> {
    return await this.model.findByIdAndUpdate(id, updateContactDto).exec();
  }

  async findOneByQuery(id: string) {
    return await this.model.findById(new Types.ObjectId(id)).exec();
  }

  async remove(id: string) {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
