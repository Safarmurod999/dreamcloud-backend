import { CustomersEntity } from '../../entities/customers.entity';
import { BaseResponse, BaseResponseGet } from '../../utils/base.response';

export interface CustomersService {
  findAll(
    page: number,
    limit: number,
  ): Promise<BaseResponseGet<CustomersEntity[]>>;
  createCustomer(
    dto: Partial<CustomersEntity>,
  ): Promise<BaseResponse<CustomersEntity>>;
  updateCustomer(
    params: any,
    dto: Partial<CustomersEntity>,
  ): Promise<BaseResponse<CustomersEntity | null>>;
  deleteCustomer(param: any): Promise<BaseResponse<CustomersEntity>>;
}
