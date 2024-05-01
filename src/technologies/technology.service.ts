import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TechnologyEntity } from '../entities/technologies.entity';
import { Repository } from 'typeorm';
import { TechnologyCreateDto } from './dto/technology.create.dto';
import { BaseResponse } from 'src/utils/base.response';
import { DbExceptions } from 'src/utils/exceptions/db.exception';
import { TechnologyUpdateDto } from './dto/technology.update.dto';
import { unlinkSync } from 'fs';

@Injectable()
export class TechnologiesService {
  constructor(
    @InjectRepository(TechnologyEntity)
    private readonly technologiesRepository: Repository<TechnologyEntity>,
  ) {}

  async findAll(): Promise<BaseResponse<TechnologyEntity[]>> {
    try {
      let data = await this.technologiesRepository.find();
      return {
        status: HttpStatus.OK,
        data: data,
        message: 'Data fetched successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async createTechnology(
    dto: TechnologyCreateDto,
    video: string,
  ): Promise<BaseResponse<TechnologyEntity>> {
    try {
      let { name, description } = dto;

      let technology = await this.technologiesRepository.findOneBy({ name });
      if (technology) {
        return {
          status: HttpStatus.BAD_REQUEST,
          data: null,
          message: 'Technology already exists!',
        };
      }
      const newTechnology = await this.technologiesRepository
        .createQueryBuilder('technologies')
        .insert()
        .into(TechnologyEntity)
        .values({
          name,
          description,
          video,
        })
        .returning(['name', 'description', 'video'])
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: newTechnology.raw,
        message: 'Technology created successfully!',
      };
    } catch (err) {
      return DbExceptions.handle(err);
    }
  }

  async updateTechnology(
    params: any,
    dto: TechnologyUpdateDto,
    video: any,
  ): Promise<BaseResponse<TechnologyEntity[]>> {
    try {
      let { name, description, state } = dto;
      let { id } = params;
      let technology = await this.technologiesRepository.findOneBy({ id });
      if (!technology) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Technology not found!',
        };
      }
      const { raw } = await this.technologiesRepository
        .createQueryBuilder('technologies')
        .update(TechnologyEntity)
        .set({
          name: name ?? technology.name,
          description: description ?? technology.description,
          video: video ?? technology.video,
          state: state ?? technology.state,
        })
        .where({ id })
        .returning('*')
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: raw,
        message: 'Technology updated successfully!',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async deleteTechnology(param: any): Promise<BaseResponse<TechnologyEntity>> {
    try {
      const { id } = param;

      let { raw } = await this.technologiesRepository
        .createQueryBuilder()
        .softDelete()
        .from(TechnologyEntity)
        .where({ id })
        .returning('*')
        .execute();
      unlinkSync(process.cwd() + '/uploads/' + 'technologies/' + raw[0].video);
      return {
        status: 200,
        data: raw,
        message: 'Technology deleted successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }
}
