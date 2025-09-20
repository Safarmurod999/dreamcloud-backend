import { HttpStatus } from '@nestjs/common';
import { TechnologiesServiceImpl } from './technology.service.impl';
import { TechnologiesRepository } from '../repository/technologies.repository';
import { TechnologyEntity } from '../../entities/technologies.entity';

// fs unlinkSync ni mock qilamiz
jest.mock('fs', () => ({
  unlinkSync: jest.fn(),
}));

describe('TechnologiesServiceImpl', () => {
  let service: TechnologiesServiceImpl;
  let technologiesRepository: jest.Mocked<TechnologiesRepository>;

  beforeEach(() => {
    technologiesRepository = {
      findAndCount: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
    } as any;

    service = new TechnologiesServiceImpl(technologiesRepository);
  });

  it('should return paginated technologies', async () => {
    const technologies = [{ id: 1, name: 'NestJS' } as TechnologyEntity];
    technologiesRepository.findAndCount.mockResolvedValue([technologies, 1]);

    const result = await service.findAll(1, 10);

    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data).toEqual(technologies);
    expect(result.pagination.totalCount).toBe(1);
  });
  it('should set default page and limit if NaN', async () => {
    const technologies = [{ id: 1, name: 'NestJS' } as TechnologyEntity];
    technologiesRepository.findAndCount.mockResolvedValue([technologies, 1]);
    const result = await service.findAll(NaN, NaN);
    expect(result.status).toBe(HttpStatus.OK);
    expect(result.data).toEqual(technologies);
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(10);
  });

  it('should create a new technology', async () => {
    const dto: any = { name: 'React', description: 'JS Library' };
    const video = 'react.mp4';

    technologiesRepository.findOneBy.mockResolvedValue(null);

    const fakeTech = {
      id: 1,
      ...dto,
      video,
      save: jest.fn().mockResolvedValue({ id: 1, ...dto, video }),
    };
    technologiesRepository.create.mockReturnValue(fakeTech);

    const result = await service.createTechnology(dto, video);

    expect(result.status).toBe(HttpStatus.CREATED);
    expect(result.data.name).toBe('React');
  });

  it('should return error if technology already exists', async () => {
    technologiesRepository.findOneBy.mockResolvedValue({
      id: 1,
      name: 'React',
    } as TechnologyEntity);

    const result = await service.createTechnology(
      { name: 'React', description: '' },
      'video.mp4',
    );

    expect(result.status).toBe(HttpStatus.BAD_REQUEST);
    expect(result.message).toBe('Technology already exists!');
  });

  it('should update a technology', async () => {
    const dto: any = { name: 'Updated Tech' };
    const tech = { id: 1, name: 'Old Tech', save: jest.fn() } as any;

    technologiesRepository.findOneBy.mockResolvedValue(tech);
    technologiesRepository.save.mockResolvedValue({ ...tech, ...dto });

    const result = await service.updateTechnology({ id: 1 }, dto, 'new.mp4');

    expect(result.status).toBe(HttpStatus.CREATED);
    expect(result.data.name).toBe('Updated Tech');
  });

  it('should return not found if technology does not exist', async () => {
    technologiesRepository.findOneBy.mockResolvedValue(null);

    const result = await service.updateTechnology({ id: 99 }, {} as any, null);

    expect(result.status).toBe(HttpStatus.NOT_FOUND);
    expect(result.message).toBe('Technology not found!');
  });

  it('should delete a technology', async () => {
    const tech = {
      id: 1,
      name: 'Angular',
      video: 'angular.mp4',
    } as TechnologyEntity;
    technologiesRepository.findOneBy.mockResolvedValue(tech);
    technologiesRepository.delete.mockResolvedValue({} as any);

    const result = await service.deleteTechnology({ id: 1 });

    expect(result.status).toBe(200);
    expect(result.message).toBe('Technology deleted successfully');
  });

  it('should return not found if technology does not exist', async () => {
    technologiesRepository.findOneBy.mockResolvedValue(null);

    const result = await service.deleteTechnology({ id: 99 });

    expect(result.status).toBe(HttpStatus.NOT_FOUND);
    expect(result.message).toBe('Technology not found!');
  });
});
