import { ModelDefinition } from '@nestjs/mongoose';
import { Stripe, StripeSchema } from './stripe.entity';
import { SubscriptionsSchema, Subscriptions } from './subscription.entity';
import { Contact, ContactSchema } from './contact.entity';
export const modelDefinitions: ModelDefinition[] = [
    {
        name: Subscriptions.name,
        schema: SubscriptionsSchema,
    },
    {
        name: Contact.name,
        schema: ContactSchema,
    },
    {
        name: Stripe.name,
        schema: StripeSchema,
    },
];
