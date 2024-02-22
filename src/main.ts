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
  const config = new DocumentBuilder()
    .setTitle('Products example')
    .setDescription('The Products API description')
    .setVersion('1.0')
    .addTag('Productss')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);
  await app.listen(3000);
}
bootstrap()
    .then(() => {

        logger.log(`Server is running on port: [${process.env.PORT}]`);
    
    })
    .catch((err) => {

        logger.log(`Error is occurred during initialization the server: [${err}]`);
    
    });
