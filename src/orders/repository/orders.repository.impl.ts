import { InjectRepository } from '@nestjs/typeorm';
import { OrdersRepository } from './orders.repository';
import { Repository } from 'typeorm';
import { OrdersEntity } from '../../entities/orders.entity';

export class OrdersRepositoryImpl implements OrdersRepository {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly repository: Repository<OrdersEntity>,
  ) {}
  find(options?: any): Promise<OrdersEntity[] | null> {
    return this.repository.find(options);
  }
  findOne(options?: any): Promise<OrdersEntity | null> {
    return this.repository.findOne(options);
  }
  findOneBy(options?: any): Promise<OrdersEntity | null> {
    return this.repository.findOneBy(options);
  }
  findAndCount(options?: any): Promise<[OrdersEntity[], number]> {
    return this.repository.findAndCount(options);
  }
  create(customer: Partial<OrdersEntity>): OrdersEntity {
    return this.repository.create(customer);
  }
  save(customer: OrdersEntity): Promise<OrdersEntity> {
    return this.repository.save(customer);
  }
  update(criteria: any, partialEntity: Partial<OrdersEntity>): Promise<any> {
    return this.repository.update(criteria, partialEntity);
  }
  softDelete(criteria: any): Promise<any> {
    return this.repository.softDelete(criteria);
  }
  delete(criteria: any): Promise<void> {
    return this.repository.delete(criteria).then(() => {});
  }
}
