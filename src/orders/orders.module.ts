import { OrdersEntity } from '@entities/orders.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ProductEntity } from '@entities/products.entity';
import { CustomerEntity } from '@entities/customers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersEntity,ProductEntity,CustomerEntity])],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports:[OrdersService]
})
export class OrdersModule {}
