import { AddressesEntity } from '@entities/adresses.entity';

export interface AddressesRepository {
  findOne(options?: any): Promise<AddressesEntity | null>;
  findOneBy(options?: any): Promise<AddressesEntity | null>;
  findAndCount(options?: any): Promise<[AddressesEntity[], number]>;
  create(Addresses: Partial<AddressesEntity>): AddressesEntity;
  save(Addresses: AddressesEntity): Promise<AddressesEntity>;
  update(criteria: any, partialEntity: Partial<AddressesEntity>): Promise<any>;
  softDelete(criteria: any): Promise<any>;
  delete(criteria: any): Promise<void>;
}
