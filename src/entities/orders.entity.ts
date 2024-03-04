import { Entity, Column, OneToMany, OneToOne, ManyToOne } from 'typeorm';
import { GeneralEntity } from '../utils/base.entity';
import { ProductEntity } from './products.entity';

@Entity('orders')
export class OrdersEntity extends GeneralEntity {
  @Column({ type: 'varchar', name: 'customer_name', nullable: false })
  customer_name: string;

  @Column({ type: 'varchar', name: 'mobile_phone', nullable: false })
  mobile_phone: string;

  @ManyToOne(() => ProductEntity, product => product.id)
  product_id: number;

  @Column({ type: 'integer', name: 'count', nullable: false })
  count: number;

  @Column({ type: 'boolean', name: 'recall', default: true })
  recall: boolean;

  @Column({ type: 'integer', name: 'state', nullable: false, default:1 })
  state: number;
}