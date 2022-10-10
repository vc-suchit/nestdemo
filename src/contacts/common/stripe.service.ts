import { Injectable } from '@nestjs/common';
import { StripeTransactionDto, CreditCardDto } from '../dto/stripe-transaction.dto';
import { Stripe, StripeSchema } from '../entities/stripe.entity';
import { Contact, ContactSchema } from '../entities/contact.entity';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class StripesService {
  constructor(
    @InjectModel(Stripe.name)
    private readonly stripeModel: Model<Stripe>,
    @InjectModel(Contact.name)
    private readonly contactModel: Model<Contact>,
    private readonly configService: ConfigService,
  ) {
  }

  private readonly STRIPE_SECRET_KEY = this.configService.get('STRIPE_TEST_SECRET_KEY');
  private readonly STRIPE_PUBLIC_KEY = process.env.STRIPE_TEST_PUBLIC_KEY;
  private readonly stripeObj = require('stripe')(this.STRIPE_SECRET_KEY);

  /**
  * For Stripe Api
  * @param data
  * @param user
  * @returns
  */

  formate_CardInfo(objCreditCardInfo: CreditCardDto) {
    return {
      name: objCreditCardInfo.CardHolderName,
      number: objCreditCardInfo.CardNumber,
      exp_month: parseInt(objCreditCardInfo.expiry.split('/')[0]),
      exp_year: parseInt(objCreditCardInfo.expiry.split('/')[1]),
      cvc: objCreditCardInfo.cvv.toString(),
    };
  }

  createCreditCardToken(cardInfo: any, user: any) {
    if (!cardInfo || !cardInfo.number || !cardInfo.exp_month || !cardInfo.exp_year || !cardInfo.cvc)
      return Promise.resolve({ success: false, message: 'Invalid Card detail', });
    return this.stripeObj.tokens.create({
      card: {
        name: cardInfo.name,
        number: cardInfo.number,
        exp_month: cardInfo.exp_month,
        exp_year: cardInfo.exp_year,
        cvc: cardInfo.cvc,
      }
    }).then((res: any) => {
      return Promise.resolve({ success: true, response: res });
    }).catch((err: { message: any }) => {
      return Promise.resolve({ success: false, message: err.message });
    });
  }


  /**
   *  for 1st time we are not geeting any card form client we just add in stripe and getting response back
   * @param stripeTransactionDto 
   * @returns 
   */
  async getorCreateUserCustomer(stripeTransactionDto: StripeTransactionDto,) {
    let user: any = await this.stripeModel.findOne({ userId: stripeTransactionDto.userId }).exec();
    let customer: any = user ? user.stripeCustomerIdRes : null;
    if (!user) {
      // Allow to free access 1st time
      var resCreateCustomer: any = await this.createCustomer(stripeTransactionDto.userId)
      if (resCreateCustomer.success == true) {
        // user.stripeCustomerId = resCreateCustomer.response.id;
        // user.stripeCustomerIdRes = resCreateCustomer.response;
        customer = user ? user.stripeCustomerIdRes ? user.stripeCustomerIdRes : null : null;
        var new_user = new this.stripeModel({
          userId: stripeTransactionDto.userId,
          stripeCustomerId: resCreateCustomer.response.id,
          expiryDate: stripeTransactionDto.expiryDate,
          stripeCustomerIdRes: resCreateCustomer.response,
          amount: 0,
          subscriptionId: new Types.ObjectId(stripeTransactionDto.subscriptionId)
        })
        let data = await new_user.save()
        if (data) {
          return Promise.resolve({ success: true, "data": data });
        } else {
          return Promise.resolve({ success: false, "data": [] });
        }
      } else {
        return Promise.resolve(resCreateCustomer);
      }
    } else {
      // stripeTransactionDto.cardInfo --> will add to schema
      var cardInfo = this.formate_CardInfo(stripeTransactionDto);
      return await this.createCreditCardToken(cardInfo, user).then((resCard) => {
        if (resCard.success == true) {
          let isNew = false
          var resCardToken = resCard.response;

          let card = resCardToken.card
          if (!customer.cardInfo) {
            isNew = true
          } else {
            var cardExist = customer.cardInfo;
            if (cardExist.fingerprint == card.fingerprint && cardExist.exp_year == card.exp_year && cardExist.exp_month == card.exp_month) {
              card = cardExist;
              card.exist = true
            } else {
              isNew = true;
            }
          }
          if (isNew) {
            return this.stripeObj.customers.createSource(customer.id, { source: resCardToken.id })
          } else {
            return card;
          }
        } else {
          return Promise.resolve({ success: false, message: resCard.message });
        }
      }).then(async (cardInfo: any) => {
        if (cardInfo.success == false) {
          return Promise.resolve(cardInfo)
        } else {
          if (cardInfo.exist) {
            return Promise.resolve({
              card: cardInfo,
              newInfoCustomer: customer
            })
          } else {
            var DataStrip = await this.stripeObj.customers.update(customer.id, {
              default_source: cardInfo.id
            })

            return Promise.resolve({
              card: cardInfo,
              newInfoCustomer: DataStrip
            })
          }
        }
      }).then(async (data: any) => {
        if (data.success == false) {
          return Promise.resolve(data);
        } else {

          // user.userId = user.userId
          // user.stripeCustomerIdRes = data.newInfoCustomer
          // user.stripeCustomerIdRes.cardInfo = data.card
          // user.save()
          // stripeCustomerIdRes.cardInfo : data.card
          let newTransactionsAdded: any = await this.stripeModel.create({
            userId: user.userId,
            stripeCustomerIdRes: data.newInfoCustomer,
            stripeCustomerId: data.newInfoCustomer.id,
            amount: stripeTransactionDto.amount,
            expiryDate: stripeTransactionDto.expiryDate,
            subscriptionId: new Types.ObjectId(stripeTransactionDto.subscriptionId)
          })
          newTransactionsAdded.cardInfo = data.card
          newTransactionsAdded.save()
          return Promise.resolve({ success: true, data: data });
        }
      })
    }
  }


  async createCustomer(user_id: any) {
    return await this.contactModel.findOne({ _id: user_id }).then(async (user: any) => {
      // return this.stripeObj.customers.create(this.addMetadata({
      //   description: 'Create Klaviss Customer and Email is' + user.email,
      //   email: user.email
      // }, user)).then((res: any) => {

      return this.stripeObj.customers.create({
        description: 'Create Klaviss Customer and Email is' + user.email,
        email: user.email
      }).then((res: any) => {
        return Promise.resolve({ success: true, response: res });
      }).catch((err: { message: any; }) => {
        return Promise.resolve({ success: false, message: err.message });
      });
    });
  }

  async getUserCustomerCardDetails(userId: any) {
    let user: any = await this.stripeModel.findOne({ userId: userId }).exec();
    if (user.stripeCustomerId) {
      let existingCustomers = await this.stripeObj.customers.listSources(user.stripeCustomerId, { object: 'card' });
      if (existingCustomers.data.length) {
        return Promise.resolve({ success: true, data: existingCustomers });
      } else {
        return Promise.resolve({ success: false, data: [] });
      }
    } else {
      return Promise.resolve({ success: false, data: [] });
    }
  }

  async takePayment(objPayment: any) {
    if (!objPayment.CustomerId || !objPayment || !objPayment.amount) return Promise.resolve({ success: false, message: "Invalid Parameter" });
    return this.stripeObj.charges.create({
      amount: objPayment.amount * 100, // convert point in to natural number 
      currency: objPayment.currency ? objPayment.currency : 'USD',
      customer: objPayment.CustomerId,
      description: objPayment.description ? objPayment.description : "Klaviss payment for Purchase Subscriptions."
    }).then((resCharge: any) => {
      if (resCharge.paid == true) {
        return Promise.resolve({ success: true, resCharge: resCharge });;
      } else {
        return Promise.resolve({ success: false, resCharge: resCharge });;
      }
    }).catch((err: any) => {
      return Promise.resolve({ success: false, message: err.message });;
    });
  }

  async createSubscription(objSubscription: any) {
    const subscription = await this.stripeObj.subscriptions.create({
      customer: objSubscription.CUSTOMER_ID,
      items: [{ price: objSubscription.RECURRING_PRICE_ID }],
    });
    if (subscription && subscription.id) {
      return { "subscription": subscription, "success": true }
    } else {
      return { "subscription": [], "success": false }
    }

  }
}
