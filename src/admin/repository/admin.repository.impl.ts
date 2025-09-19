import { Repository } from 'typeorm';
import { AdminEntity } from '@entities/admin.entity';
import { AdminRepository } from './admin.repository';
import { InjectRepository } from '@nestjs/typeorm';

export class AdminRepositoryImpl implements AdminRepository {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly repository: Repository<AdminEntity>,
  ) {}
  findOne(options?: any): Promise<AdminEntity | null> {
    return this.repository.findOne(options);
  }
  findOneBy(options?: any): Promise<AdminEntity | null> {
    return this.repository.findOneBy(options);
  }
  findAndCount(options?: any): Promise<[AdminEntity[], number]> {
    return this.repository.findAndCount(options);
  }
  create(admin: Partial<AdminEntity>): AdminEntity {
    return this.repository.create(admin);
  }
  save(admin: AdminEntity): Promise<AdminEntity> {
    return this.repository.save(admin);
  }
  update(criteria: any, partialEntity: Partial<AdminEntity>): Promise<any> {
    return this.repository.update(criteria, partialEntity);
  }
  softDelete(criteria: any): Promise<any> {
    return this.repository.softDelete(criteria);
  }
  delete(criteria: any): Promise<void> {
    return this.repository.delete(criteria).then(() => {});
  }
}
