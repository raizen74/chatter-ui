import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true }); // bufferLogs to ensure logs are captured before the app starts
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger));
  app.use(cookieParser()); // middleware is similar to guards, but they are executed before the request reaches the route handler
  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow<string>('PORT', '3000')); // Default to 3000 if PORT is not set
}
bootstrap();
