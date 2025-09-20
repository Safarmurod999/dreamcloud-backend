import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../../entities/products.entity';
import { ProductsRepository } from './products.repository';

export class ProductsRepositoryImpl implements ProductsRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}
  find(options?: any): Promise<ProductEntity[] | null> {
    return this.repository.find(options);
  }

  findOne(options?: any): Promise<ProductEntity | null> {
    return this.repository.findOne(options);
  }
  findOneBy(options?: any): Promise<ProductEntity | null> {
    return this.repository.findOneBy(options);
  }
  findAndCount(options?: any): Promise<[ProductEntity[], number]> {
    return this.repository.findAndCount(options);
  }
  create(customer: Partial<ProductEntity>): ProductEntity {
    return this.repository.create(customer);
  }
  save(customer: ProductEntity): Promise<ProductEntity> {
    return this.repository.save(customer);
  }
  update(criteria: any, partialEntity: Partial<ProductEntity>): Promise<any> {
    return this.repository.update(criteria, partialEntity);
  }
  softDelete(criteria: any): Promise<any> {
    return this.repository.softDelete(criteria);
  }
  delete(criteria: any): Promise<void> {
    return this.repository.delete(criteria).then(() => {});
  }
}
