import { AdminEntity } from '@entities/admin.entity';

export interface AdminRepository {
  findOne(options?: any): Promise<AdminEntity | null>;
  findOneBy(options?: any): Promise<AdminEntity | null>;
  findAndCount(options?: any): Promise<[AdminEntity[], number]>;
  create(admin: Partial<AdminEntity>): AdminEntity;
  save(admin: AdminEntity): Promise<AdminEntity>;
  update(criteria: any, partialEntity: Partial<AdminEntity>): Promise<any>;
  softDelete(criteria: any): Promise<any>;
  delete(criteria: any): Promise<void>;
}
