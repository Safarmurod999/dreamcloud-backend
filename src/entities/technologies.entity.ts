import { Entity, Column, OneToMany } from 'typeorm';
import { GeneralEntity } from '../utils/base.entity';

@Entity('technologies')
export class TechnologyEntity extends GeneralEntity {
  @Column({ type: 'varchar', name: 'name', nullable: false })
  name: string;

  @Column({ type: 'varchar', name: 'description', nullable: false })
  description: string;

  @Column({ type: 'text', name: 'video', default: true })
  video: string;

  @Column({ type: 'integer', name: 'state', nullable: false,default:1 })
  state: number;
}
