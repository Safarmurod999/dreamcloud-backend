import { CategoryEntity } from '@entities/category.entity';
import { BaseResponse, BaseResponseGet } from '@utils/base.response';

export interface CategoriesService {
  createCategory(
    data: Partial<CategoryEntity>,
  ): Promise<BaseResponse<CategoryEntity>>;
  findAll(
    page: number,
    limit: number,
  ): Promise<BaseResponseGet<CategoryEntity[]>>;
  updateCategory(
    params: string,
    dto: Partial<CategoryEntity>,
  ): Promise<BaseResponse<CategoryEntity> | null>;
  deleteCategory(param: string): Promise<BaseResponse<CategoryEntity> | null>;
}
