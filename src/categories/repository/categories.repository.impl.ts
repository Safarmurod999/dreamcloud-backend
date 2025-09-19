import { CategoryEntity } from '../../entities/category.entity';
import { CategoriesRepository } from './categories.repository';
import { Inject } from '@nestjs/common';
import { Tokens } from '../../utils/tokens';

export class CategoriesRepositoryImpl implements CategoriesRepository {
  constructor(
    @Inject(Tokens.Categories.Repository)
    private readonly repository: CategoriesRepository,
  ) {}
  findOne(options?: any): Promise<CategoryEntity | null> {
    return this.repository.findOne(options);
  }
  findOneBy(options?: any): Promise<CategoryEntity | null> {
    return this.repository.findOneBy(options);
  }
  findAndCount(options?: any): Promise<[CategoryEntity[], number]> {
    return this.repository.findAndCount(options);
  }
  create(category: Partial<CategoryEntity>): CategoryEntity {
    return this.repository.create(category);
  }
  save(category: CategoryEntity): Promise<CategoryEntity> {
    return this.repository.save(category);
  }
  update(criteria: any, partialEntity: Partial<CategoryEntity>): Promise<any> {
    return this.repository.update(criteria, partialEntity);
  }
  softDelete(criteria: any): Promise<any> {
    return this.repository.softDelete(criteria);
  }
  delete(criteria: any): Promise<void> {
    return this.repository.delete(criteria).then(() => {});
  }
}
