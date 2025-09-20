import { OrdersEntity } from '../../entities/orders.entity';
import { BaseResponse, BaseResponseGet } from '../../utils/base.response';

export interface OrdersService {
  findAll(
    page: number,
    limit: number,
  ): Promise<BaseResponseGet<OrdersEntity[]>>;
  findOne(params: any): Promise<BaseResponse<OrdersEntity | null>>;
  createOrder(dto: Partial<OrdersEntity>): Promise<BaseResponse<OrdersEntity>>;
  updateOrder(
    params: any,
    dto: Partial<OrdersEntity>,
  ): Promise<BaseResponse<OrdersEntity | null>>;
  deleteOrder(param: any): Promise<BaseResponse<OrdersEntity>>;
}
