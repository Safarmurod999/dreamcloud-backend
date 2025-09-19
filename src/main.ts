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
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept,Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    maxAge: 3600,
  });
  const config = new DocumentBuilder()
    .setTitle('Frontend : https://dream-cloud-matras.netlify.app')
    .setDescription('Backend : https://dreamcloud-backend-e4327b791528.herokuapp.com/api#/')
    .setDescription('Matraslar.uz sayti uchun NestJS,Typeorm va PostgreSQL dan foydalanib RESTful API.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ||  3000);
}
bootstrap()
    .then(() => {

        logger.log(`Server is running on port: [${process.env.PORT || '3000'}]`);
    
    })
    .catch((err) => {

        logger.log(`Error is occurred during initialization the server: [${err}]`);
    
    });
