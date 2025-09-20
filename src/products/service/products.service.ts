import { ProductEntity } from '@entities/products.entity';
import { BaseResponse, BaseResponseGet } from '@utils/base.response';
import { ProductUpdateDto } from '../dto/product.update.dto';
import { ProductCreateDto } from '../dto/products.create.dto';

export interface ProductsService {
  findAll(
    page: number,
    limit: number,
  ): Promise<BaseResponseGet<ProductEntity[]>>;
  createProduct(
    dto: ProductCreateDto,
    image: any,
  ): Promise<BaseResponse<ProductEntity>>;
  updateProduct(
    params: any,
    dto: ProductUpdateDto,
    image: any,
  ): Promise<BaseResponse<ProductEntity>>;
  deleteProduct(param: any): Promise<BaseResponse<ProductEntity>>;
}
