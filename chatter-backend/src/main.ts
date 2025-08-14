import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { config } from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {bufferLogs: true}); // bufferLogs to ensure logs are captured before the app starts
  app.useGlobalPipes(
    new ValidationPipe()
  );
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow<string>('PORT', '3000')); // Default to 3000 if PORT is not set
}
bootstrap();
