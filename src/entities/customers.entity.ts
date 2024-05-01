import { Entity, Column } from 'typeorm';
import { GeneralEntity } from '../utils/base.entity';

@Entity('customers')
export class CustomersEntity extends GeneralEntity {

  @Column({ type: 'varchar', name: 'mobile_phone', nullable: true })
  mobile_phone: string;

  @Column({ type: 'boolean', name: 'recall', default: true })
  recall: boolean;

}