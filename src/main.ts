import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { urlencoded, json } from 'express';
import { AppModule } from './app.module';
import { VALIDATION_PIPE_OPTIONS } from './shared/constants';
import { RequestIdMiddleware } from './shared/middlewares/request-id/request-id.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.use(RequestIdMiddleware);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  // Uncomment these lines to use the Redis adapter:

  const configService = app.get(ConfigService);
  const appPrefix = configService.get('prefix');
  app.setGlobalPrefix(appPrefix);
  const corsOptions = {
    origin: ['http://localhost:8888', 'https://ygo.petangpanjang.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };
  app.enableCors(corsOptions);

  /** Swagger configuration*/
  const options = new DocumentBuilder()
    .setTitle('YGO API')
    .setDescription('yet another API from ygopro db')
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const port = configService.get<number>('port');
  await app.listen(port);
}
bootstrap();
