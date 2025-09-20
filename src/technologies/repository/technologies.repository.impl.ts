import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TechnologiesRepository } from './technologies.repository';
import { TechnologyEntity } from '@entities/technologies.entity';

export class TechnologiesRepositoryImpl implements TechnologiesRepository {
  constructor(
    @InjectRepository(TechnologyEntity)
    private readonly repository: Repository<TechnologyEntity>,
  ) {}
  find(options?: any): Promise<TechnologyEntity[] | null> {
    return this.repository.find(options);
  }

  findOne(options?: any): Promise<TechnologyEntity | null> {
    return this.repository.findOne(options);
  }
  findOneBy(options?: any): Promise<TechnologyEntity | null> {
    return this.repository.findOneBy(options);
  }
  findAndCount(options?: any): Promise<[TechnologyEntity[], number]> {
    return this.repository.findAndCount(options);
  }
  create(customer: Partial<TechnologyEntity>): TechnologyEntity {
    return this.repository.create(customer);
  }
  save(customer: TechnologyEntity): Promise<TechnologyEntity> {
    return this.repository.save(customer);
  }
  update(
    criteria: any,
    partialEntity: Partial<TechnologyEntity>,
  ): Promise<any> {
    return this.repository.update(criteria, partialEntity);
  }
  softDelete(criteria: any): Promise<any> {
    return this.repository.softDelete(criteria);
  }
  delete(criteria: any): Promise<void> {
    return this.repository.delete(criteria).then(() => {});
  }
}
