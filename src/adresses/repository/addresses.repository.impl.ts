import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddressesRepository } from './addresses.repository';
import { AddressesEntity } from '@entities/adresses.entity';

export class AddressesRepositoryImpl implements AddressesRepository {
  constructor(
    @InjectRepository(AddressesEntity)
    private readonly repository: Repository<AddressesEntity>,
  ) {}
  findOne(options?: any): Promise<AddressesEntity | null> {
    return this.repository.findOne(options);
  }
  findOneBy(options?: any): Promise<AddressesEntity | null> {
    return this.repository.findOneBy(options);
  }
  findAndCount(options?: any): Promise<[AddressesEntity[], number]> {
    return this.repository.findAndCount(options);
  }
  create(admin: Partial<AddressesEntity>): AddressesEntity {
    return this.repository.create(admin);
  }
  save(admin: AddressesEntity): Promise<AddressesEntity> {
    return this.repository.save(admin);
  }
  update(criteria: any, partialEntity: Partial<AddressesEntity>): Promise<any> {
    return this.repository.update(criteria, partialEntity);
  }
  softDelete(criteria: any): Promise<any> {
    return this.repository.softDelete(criteria);
  }
  delete(criteria: any): Promise<void> {
    return this.repository.delete(criteria).then(() => {});
  }
}
