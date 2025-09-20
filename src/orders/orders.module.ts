import { OrdersEntity } from '@entities/orders.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { ProductEntity } from '../entities/products.entity';
import { Tokens } from '../utils/tokens';
import { OrdersServiceImpl } from './service/orders.service.impl';
import { OrdersRepositoryImpl } from './repository/orders.repository.impl';
import { ProductsRepositoryImpl } from '../products/repository/products.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersEntity, ProductEntity])],
  providers: [
    {
      provide: Tokens.Orders.Service,
      useClass: OrdersServiceImpl,
    },
    {
      provide: Tokens.Orders.Repository,
      useClass: OrdersRepositoryImpl,
    },
    {
      provide: Tokens.Product.Repository,
      useClass: ProductsRepositoryImpl,
    },
  ],
  controllers: [OrdersController],
  exports: [
    {
      provide: Tokens.Orders.Service,
      useClass: OrdersServiceImpl,
    },
  ],
})
export class OrdersModule {}
