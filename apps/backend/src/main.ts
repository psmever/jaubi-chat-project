import 'reflect-metadata';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('BACKEND_PORT', 4000);
  const corsOrigin = configService.get<string>('BACKEND_CORS_ORIGIN', 'http://localhost:3000');

  app.enableCors({
    origin: corsOrigin,
    credentials: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );

  await app.listen(port);
  Logger.log(`Backend is running on http://localhost:${port}`, 'Bootstrap');
}

void bootstrap();
