import { Entity, Column } from 'typeorm';
import { GeneralEntity } from '../utils/base.entity';

@Entity('admins')
export class AdminEntity extends GeneralEntity {
  @Column({ type: 'varchar', name: 'username', nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', name: 'email', nullable: true, unique: true })
  email: string;

  @Column({ type: 'varchar', name: 'image', nullable: true })
  image: string;

  @Column({ type: 'varchar', name: 'password', nullable: false })
  password: string;

  @Column({ type: 'boolean', name: 'isSuperAdmin', default: false })
  isSuperAdmin: boolean;
}
