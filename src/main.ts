import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe,Logger } from '@nestjs/common';
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
  await app.listen(3000);
}
bootstrap()
    .then(() => {

        logger.log(`Server is running on port: [${process.env.PORT}]`);
    
    })
    .catch((err) => {

        logger.log(`Error is occurred during initialization the server: [${err}]`);
    
    });
