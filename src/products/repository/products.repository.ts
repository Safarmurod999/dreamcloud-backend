import { ProductEntity } from './../../entities/products.entity';
export interface ProductsRepository {
  find(options?: any): Promise<ProductEntity[] | null>;
  findOne(options?: any): Promise<ProductEntity | null>;
  findOneBy(options?: any): Promise<ProductEntity | null>;
  findAndCount(options?: any): Promise<[ProductEntity[], number]>;
  create(customer: Partial<ProductEntity>): ProductEntity;
  save(customer: ProductEntity): Promise<ProductEntity>;
  update(criteria: any, partialEntity: Partial<ProductEntity>): Promise<any>;
  softDelete(criteria: any): Promise<any>;
  delete(criteria: any): Promise<void>;
}
