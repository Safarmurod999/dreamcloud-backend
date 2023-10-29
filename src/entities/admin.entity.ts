import { Entity, Column } from 'typeorm';
import { GeneralEntity } from '../utils/base.entity';

@Entity('admins')
export class AdminEntity extends GeneralEntity {
  @Column({ type: 'varchar', name: 'username', nullable: false,unique: true })
  username: string;

  @Column({ type: 'varchar', name: 'password', nullable: false })
  password: string;

  @Column({ type: 'boolean', name: 'isActive', default: false })
  isSuperAdmin: boolean;
  // @OneToMany(() => BookingEntity, (booking) => booking.user)
  //     bookings: BookingEntity[];
}
