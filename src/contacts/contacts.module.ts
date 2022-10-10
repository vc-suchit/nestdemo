import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ContactsService } from './contacts.service';
import { StripesService } from './common/stripe.service';
import { ContactsController } from './contacts.controller';
import { modelDefinitions } from './entities';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
// check here for Modules

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({}),
    MongooseModule.forFeature(modelDefinitions),
  ],
  controllers: [ContactsController],
  providers: [ContactsService, StripesService],
})
export class ContactsModule { }
