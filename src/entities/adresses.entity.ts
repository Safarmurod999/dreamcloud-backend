import { Entity, Column } from 'typeorm';
import { GeneralEntity } from '../utils/base.entity';

@Entity('addresses')
export class AddressesEntity extends GeneralEntity {
  @Column({ type: 'varchar', name: 'address', nullable: false })
  address: string;

  @Column({ type: 'varchar', name: 'description', nullable: false })
  description: string;

  @Column({ type: 'varchar', name: 'location', nullable: false })
  location: string;

  @Column({ type: 'text', name: 'image', default: true })
  image: string;

  @Column({ type: 'boolean', name: 'isActive', nullable: false, default: true })
  isActive: boolean;

  @Column({ type: 'integer', name: 'state', nullable: false, default: 1 })
  state: number;
}
