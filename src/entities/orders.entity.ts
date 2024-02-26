import { Entity, Column, OneToMany, OneToOne, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../utils/base.entity';
import { CustomerEntity } from './customers.entity';
import { ProductEntity } from './products.entity';

@Entity('orders')
export class OrdersEntity extends GeneralEntity {
  @ManyToOne(() => CustomerEntity, customer => customer.id)
  customer_id: number;

  @ManyToOne(() => ProductEntity, product => product.id)
  product_id: number;

  @Column({ type: 'integer', name: 'count', nullable: false })
  count: number;

  @Column({ type: 'boolean', name: 'recall', default: true })
  recall: boolean;

  @Column({ type: 'integer', name: 'state', nullable: false, default:1 })
  state: number;
}