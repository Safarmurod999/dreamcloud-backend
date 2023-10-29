import { Entity, Column, OneToMany } from 'typeorm';
import { GeneralEntity } from '../utils/base.entity';

@Entity('customers')
export class CustomerEntity extends GeneralEntity {
  @Column({ type: 'varchar', name: 'fullname', nullable: false })
  fullname: string;

  @Column({ type: 'varchar', name: 'phone_number', nullable: false })
  phone_number: string;

  @Column({ type: 'boolean', name: 'isActive', default: true })
  isActive: boolean;

  // @OneToMany(() => BookingEntity, (booking) => booking.user)
  //     bookings: BookingEntity[];
}
