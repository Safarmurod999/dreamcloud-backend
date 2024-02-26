import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoryEntity } from 'src/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports:[CategoriesService]
})
export class CategoriesModule {}
