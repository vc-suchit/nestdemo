import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: '*', methods: '*' },
  });
  app.setGlobalPrefix('/v1');
  await app.listen(process.env.PORT);
  console.log(`App Are Working On Port 3000`)
}

bootstrap();
