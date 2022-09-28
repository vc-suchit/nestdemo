import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContactsModule } from './contacts/contacts.module';
import { ContactsService } from './contacts/contacts.service';
@Module({
  imports: [
    ConfigModule.forRoot({}),
    HttpModule,
    ConfigModule,
    MongooseModule.forRoot(process.env.DATABASE_URL),
    ContactsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() {}
}
