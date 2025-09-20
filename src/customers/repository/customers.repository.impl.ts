import { InjectRepository } from '@nestjs/typeorm';
import { CustomersRepository } from './categories.repository';
import { Repository } from 'typeorm';
import { CustomersEntity } from '../../entities/customers.entity';

export class CustomersRepositoryImpl implements CustomersRepository {
  constructor(
    @InjectRepository(CustomersEntity)
    private readonly repository: Repository<CustomersEntity>,
  ) {}
  findOne(options?: any): Promise<CustomersEntity | null> {
    return this.repository.findOne(options);
  }
  findOneBy(options?: any): Promise<CustomersEntity | null> {
    return this.repository.findOneBy(options);
  }
  findAndCount(options?: any): Promise<[CustomersEntity[], number]> {
    return this.repository.findAndCount(options);
  }
  create(customer: Partial<CustomersEntity>): CustomersEntity {
    return this.repository.create(customer);
  }
  save(customer: CustomersEntity): Promise<CustomersEntity> {
    return this.repository.save(customer);
  }
  update(criteria: any, partialEntity: Partial<CustomersEntity>): Promise<any> {
    return this.repository.update(criteria, partialEntity);
  }
  softDelete(criteria: any): Promise<any> {
    return this.repository.softDelete(criteria);
  }
  delete(criteria: any): Promise<void> {
    return this.repository.delete(criteria).then(() => {});
  }
}
