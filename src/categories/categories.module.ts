import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesServiceImpl } from './service/categories.service.impl';
import { CategoriesController } from './categories.controller';
import { CategoryEntity } from 'src/entities/category.entity';
import { ProductEntity } from '@entities/products.entity';
import { OrdersEntity } from '@entities/orders.entity';
import { Tokens } from '@utils/tokens';
import { CategoriesRepositoryImpl } from './repository/categories.repository.impl';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity, ProductEntity, OrdersEntity]),
  ],
  providers: [
    {
      provide: Tokens.Categories.Service,
      useClass: CategoriesServiceImpl,
    },
    {
      provide: Tokens.Categories.Repository,
      useClass: CategoriesRepositoryImpl,
    },
  ],
  controllers: [CategoriesController],
  exports: [
    {
      provide: Tokens.Categories.Service,
      useClass: CategoriesServiceImpl,
    },
  ],
})
export class CategoriesModule {}
