import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductEntity } from 'src/entities/products.entity';
import { MulterModule } from '@nestjs/platform-express';
import { OrdersEntity } from '@entities/orders.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity,OrdersEntity]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
