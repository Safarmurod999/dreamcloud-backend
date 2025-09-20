import { OrdersEntity } from '../../entities/orders.entity';
export interface OrdersRepository {
  find(options?: any): Promise<OrdersEntity[] | null>;
  findOne(options?: any): Promise<OrdersEntity | null>;
  findOneBy(options?: any): Promise<OrdersEntity | null>;
  findAndCount(options?: any): Promise<[OrdersEntity[], number]>;
  create(customer: Partial<OrdersEntity>): OrdersEntity;
  save(customer: OrdersEntity): Promise<OrdersEntity>;
  update(criteria: any, partialEntity: Partial<OrdersEntity>): Promise<any>;
  softDelete(criteria: any): Promise<any>;
  delete(criteria: any): Promise<void>;
}
