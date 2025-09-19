import { CategoryEntity } from '../../entities/category.entity';

export interface CategoriesRepository {
  findOne(options?: any): Promise<CategoryEntity | null>;
  findOneBy(options?: any): Promise<CategoryEntity | null>;
  findAndCount(options?: any): Promise<[CategoryEntity[], number]>;
  create(category: Partial<CategoryEntity>): CategoryEntity;
  save(category: CategoryEntity): Promise<CategoryEntity>;
  update(criteria: any, partialEntity: Partial<CategoryEntity>): Promise<any>;
  softDelete(criteria: any): Promise<any>;
  delete(criteria: any): Promise<void>;
}
