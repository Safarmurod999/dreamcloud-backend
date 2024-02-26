import { Entity, Column, OneToMany } from 'typeorm';
import { GeneralEntity } from '../utils/base.entity';
import { ProductEntity } from './products.entity';

@Entity('categories')
export class CategoryEntity extends GeneralEntity {
  @Column({ type: 'varchar', name: 'category_name', nullable: false })
  category_name: string;

  @Column({ type: 'boolean', name: 'isActive', default: true })
  isActive: boolean;

  @Column({ type: 'integer', name: 'state', nullable: false, default:1 })
  state: number;

  @OneToMany(() => ProductEntity, (product) => {
    console.log('product-category')
    return product.category_id
  })
    products: ProductEntity[];
}