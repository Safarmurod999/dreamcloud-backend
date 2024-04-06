import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';
import { GeneralEntity } from '../utils/base.entity';
import { OrdersEntity } from './orders.entity';

@Entity('products')
export class ProductEntity extends GeneralEntity {
  @Column({ type: 'varchar', name: 'product_name', nullable: true })
  product_name: string;

  @Column({ type: 'integer', name: 'category_id', nullable: true })
  category_id: number;

  @Column({ type: 'integer', name: 'count', nullable: true })
  count: number;

  @Column({ type: 'integer', name: 'price', nullable: true })
  price: number;

  @Column({ type: 'integer', name: 'discount', nullable: true })
  discount: number;

  @Column({ type: 'integer', name: 'overweight', nullable: true })
  overweight: number;

  @Column({ type: 'varchar', name: 'size', nullable: true })
  size: string;

  @Column({ type: 'integer', name: 'capacity', nullable: true })
  capacity: number;

  @Column({ type: 'varchar', name: 'guarantee', nullable: true })
  guarantee: string;

  @Column({ type: 'varchar', name: 'description', nullable: true })
  description: string;

  @Column({ type: 'text', name: 'image', nullable: true })
  image: string;

  @Column({ type: 'boolean', name: 'status', nullable: true })
  status: boolean;

  @Column({ type: 'integer', name: 'state', nullable: true, default: 1 })
  state: number;

  @OneToMany(() => OrdersEntity, (order) => order.product_id)
  orders: OrdersEntity[];
}
