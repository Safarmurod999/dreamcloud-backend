import { Entity, Column, OneToMany, OneToOne, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../utils/base.entity';
import { ProductEntity } from './products.entity';

@Entity('orders')
export class OrdersEntity extends GeneralEntity {
  @Column({ type: 'varchar', name: 'customer_name', nullable: true })
  customer_name: string;

  @Column({ type: 'varchar', name: 'mobile_phone', nullable: true })
  mobile_phone: string;

  @Column({ type: 'integer', name: 'product_id', nullable: true })
  product_id: number;

  @Column({ type: 'integer', name: 'count', nullable: true })
  count: number;

  @Column({ type: 'boolean', name: 'recall', default: true })
  recall: boolean;

  @Column({ type: 'integer', name: 'state', nullable: true, default:1 })
  state: number;
}