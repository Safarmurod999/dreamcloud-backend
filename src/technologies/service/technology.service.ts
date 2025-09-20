import { TechnologyEntity } from '@entities/technologies.entity';
import { BaseResponse, BaseResponseGet } from '@utils/base.response';
import { TechnologyCreateDto } from '../dto/technology.create.dto';
import { TechnologyUpdateDto } from '../dto/technology.update.dto';

export interface TechnologyService {
  findAll(
    page: number,
    limit: number,
  ): Promise<BaseResponseGet<TechnologyEntity[]>>;
  createTechnology(
    dto: TechnologyCreateDto,
    video: string,
  ): Promise<BaseResponse<TechnologyEntity>>;
  updateTechnology(
    params: any,
    dto: TechnologyUpdateDto,
    video: any,
  ): Promise<BaseResponse<TechnologyEntity | null>>;
  deleteTechnology(param: any): Promise<BaseResponse<TechnologyEntity>>;
}
