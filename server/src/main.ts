import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { jwtMiddleware } from './common/jwt.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(jwtMiddleware);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors();
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
  console.log('Server running on port', process.env.PORT || 3000);
}

bootstrap();
