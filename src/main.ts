import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe,Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as process from 'process';
import 'dotenv/config';
const logger = new Logger('Main'); 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: '*', // You can set specific origins, e.g., ['http://example1.com', 'https://example2.com']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept,Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true, // Set this to true if you need cookies or authentication headers to be sent cross-origin
    maxAge: 3600, // Cache preflight requests for 1 hour (in seconds)
  });
  const config = new DocumentBuilder()
    .setTitle('Products example')
    .setDescription('The Products API description')
    .setVersion('1.0')
    .addTag('Products')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap()
    .then(() => {

        logger.log(`Server is running on port: [${process.env.PORT}]`);
    
    })
    .catch((err) => {

        logger.log(`Error is occurred during initialization the server: [${err}]`);
    
    });
