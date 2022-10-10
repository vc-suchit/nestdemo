import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { StripesService } from './common/stripe.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { StripeTransactionDto } from './dto/stripe-transaction.dto';
import { UpdateContactDto } from './dto/update-contact.dto';


@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService, private readonly stripesService: StripesService) { }

  @Post()
  async create(
    @Body() createContactDto: CreateContactDto,
  ): Promise<CreateContactDto> {
    return await this.contactsService.create(createContactDto);
  }

  @Get()
  async findAll() {
    return await this.contactsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.contactsService.findOne(+id);
  }

  @Get('user/query')
  async findOneByQuery(@Query('id') id: string) {
    return await this.contactsService.findOneByQuery(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return await this.contactsService.update(id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }


  @Post('stripe/createuser')
  async getorCreateUserCustomer(
    @Body() stripeTransactionDto: StripeTransactionDto,
  ): Promise<StripeTransactionDto> {
    return await this.stripesService.getorCreateUserCustomer(stripeTransactionDto);
  }

  @Get('stripe/customerCardDetails/:id')
  async getUserCustomerCardDetails(@Param('id') id: string) {
    return await this.stripesService.getUserCustomerCardDetails(id);
  }

  @Post('stripe/makePayment')
  async takePayment(
    @Body() stripeTransactionDto: object,
  ): Promise<unknown> {
    return await this.stripesService.takePayment(stripeTransactionDto);
  }

  @Get('stripe/getAllSubscription')
  async getSubscriptionDetails() {
    return await this.contactsService.getSubscriptionDetails();
  }

  @Post('stripe/subscription')
  async createSubscription(
    @Body() objSubscription: object,
  ): Promise<unknown> {
    return await this.stripesService.createSubscription(objSubscription);
  }



}
