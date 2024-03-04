import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';
import { GeneralEntity } from '../utils/base.entity';
import { OrdersEntity } from './orders.entity';

@Entity('products')
export class ProductEntity extends GeneralEntity {
  @Column({ type: 'varchar', name: 'product_name', nullable: false })
  product_name: string;

  @Column({ type: 'integer', name: 'category_id', nullable: false })
  category_id: number;

  @Column({ type: 'integer', name: 'count', nullable: false })
  count: number;

  @Column({ type: 'integer', name: 'price', nullable: false })
  price: number;

  @Column({ type: 'integer', name: 'discount', nullable: true })
  discount: number;

  @Column({ type: 'integer', name: 'overweight', nullable: false })
  overweight: number;

  @Column({ type: 'varchar', name: 'size', nullable: false })
  size: string;

  @Column({ type: 'integer', name: 'capacity', nullable: false })
  capacity: number;

  @Column({ type: 'varchar', name: 'guarantee', nullable: false })
  guarantee: string;

  @Column({ type: 'varchar', name: 'description', nullable: false })
  description: string;

  @Column({ type: 'text', name: 'image', nullable: false })
  image: string;

  @Column({ type: 'boolean', name: 'status', nullable: false })
  status: boolean;

  @Column({ type: 'integer', name: 'state', nullable: false, default: 1 })
  state: number;

  @OneToMany(() => OrdersEntity, (order) => order.product_id)
  orders: OrdersEntity[];
}
