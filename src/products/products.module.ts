import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsServiceImpl } from './service/products.service.impl';
import { ProductsController } from './products.controller';
import { ProductEntity } from '../entities/products.entity';
import { MulterModule } from '@nestjs/platform-express';
import { OrdersEntity } from '../entities/orders.entity';
import { Tokens } from '../utils/tokens';
import { ProductsRepositoryImpl } from './repository/products.repository.impl';
import { OrdersRepositoryImpl } from 'src/orders/repository/orders.repository.impl';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, OrdersEntity]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [
    {
      provide: Tokens.Product.Repository,
      useClass: ProductsRepositoryImpl,
    },
    {
      provide: Tokens.Orders.Repository,
      useClass: OrdersRepositoryImpl,
    },
    {
      provide: Tokens.Product.Service,
      useClass: ProductsServiceImpl,
    },
  ],
  controllers: [ProductsController],
  exports: [
    {
      provide: Tokens.Product.Service,
      useClass: ProductsServiceImpl,
    },
  ],
})
export class ProductsModule {}
