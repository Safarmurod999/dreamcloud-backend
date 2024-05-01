import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoryEntity } from 'src/entities/category.entity';
import { ProductEntity } from '@entities/products.entity';
import { OrdersEntity } from '@entities/orders.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, ProductEntity, OrdersEntity]),
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
