import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { unlinkSync } from 'fs';
import { TechnologyEntity } from '../../entities/technologies.entity';
import { TechnologyCreateDto } from '../dto/technology.create.dto';
import { BaseResponse, BaseResponseGet } from '../../utils/base.response';
import { DbExceptions } from '../../utils/exceptions/db.exception';
import { TechnologyUpdateDto } from '../dto/technology.update.dto';
import { TechnologyService } from './technology.service';
import { Tokens } from '../../utils/tokens';
import { TechnologiesRepository } from '../repository/technologies.repository';

@Injectable()
export class TechnologiesServiceImpl implements TechnologyService {
  constructor(
    @Inject(Tokens.Technologies.Repository)
    private readonly technologiesRepository: TechnologiesRepository,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<BaseResponseGet<TechnologyEntity[]>> {
    if (Number.isNaN(page)) {
      page = 1;
    }
    if (Number.isNaN(limit)) {
      limit = 10;
    }
    const skip = (page - 1) * limit;

    const [data, totalCount] = await this.technologiesRepository.findAndCount(
      {
        skip: skip ?? 0,
        take: limit,
      },
    );

    const totalPages = Math.ceil(totalCount / limit);
    return {
      status: HttpStatus.OK,
      data: data,
      message: 'Data fetched successfully',
      pagination: {
        page: page,
        limit: limit,
        totalCount: totalCount,
        totalPages: totalPages,
      },
    };
  }

  async createTechnology(
    dto: TechnologyCreateDto,
    video: string,
  ): Promise<BaseResponse<TechnologyEntity>> {
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
      .create({
        name,
        description,
        video,
      })
      .save();
    return {
      status: HttpStatus.CREATED,
      data: newTechnology,
      message: 'Technology created successfully!',
    };
  }

  async updateTechnology(
    params: any,
    dto: TechnologyUpdateDto,
    video: any,
  ): Promise<BaseResponse<TechnologyEntity | null>> {
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
    technology.name = name ?? technology.name;
    technology.description = description ?? technology.description;
    technology.video = video ?? technology.video;
    technology.state = state ?? technology.state;

    await this.technologiesRepository.save(technology);
    return {
      status: HttpStatus.CREATED,
      data: technology,
      message: 'Technology updated successfully!',
    };
  }

  async deleteTechnology(param: any): Promise<BaseResponse<TechnologyEntity>> {
    const { id } = param;
    let data = await this.technologiesRepository.findOneBy({ id });
    if (!data) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: null,
        message: 'Technology not found!',
      };
    }
    await this.technologiesRepository.delete(id);
    unlinkSync(process.cwd() + '/uploads/' + 'technologies/' + data.video);
    return {
      status: 200,
      data: data,
      message: 'Technology deleted successfully',
    };
  }
}
