import { CustomersEntity } from '../../entities/customers.entity';
export interface CustomersRepository {
  findOne(options?: any): Promise<CustomersEntity | null>;
  findOneBy(options?: any): Promise<CustomersEntity | null>;
  findAndCount(options?: any): Promise<[CustomersEntity[], number]>;
  create(customer: Partial<CustomersEntity>): CustomersEntity;
  save(customer: CustomersEntity): Promise<CustomersEntity>;
  update(criteria: any, partialEntity: Partial<CustomersEntity>): Promise<any>;
  softDelete(criteria: any): Promise<any>;
  delete(criteria: any): Promise<void>;
}
