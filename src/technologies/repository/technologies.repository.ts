import { TechnologyEntity } from '../../entities/technologies.entity';
export interface TechnologiesRepository {
  find(options?: any): Promise<TechnologyEntity[] | null>;
  findOne(options?: any): Promise<TechnologyEntity | null>;
  findOneBy(options?: any): Promise<TechnologyEntity | null>;
  findAndCount(options?: any): Promise<[TechnologyEntity[], number]>;
  create(customer: Partial<TechnologyEntity>): TechnologyEntity;
  save(customer: TechnologyEntity): Promise<TechnologyEntity>;
  update(criteria: any, partialEntity: Partial<TechnologyEntity>): Promise<any>;
  softDelete(criteria: any): Promise<any>;
  delete(criteria: any): Promise<void>;
}
