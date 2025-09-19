import { AdminEntity } from '@entities/admin.entity';
import { BaseResponse, BaseResponseGet } from '@utils/base.response';

export interface AdminService {
  findAll(page: number, limit: number): Promise<BaseResponseGet<AdminEntity[]>>;
  findOne(id: string): Promise<BaseResponse<AdminEntity>>;
  createAdmin(data: Partial<AdminEntity>): Promise<BaseResponse<AdminEntity>>;
  updateAdmin(
    params: string,
    dto: Partial<AdminEntity>,
    image?: string,
  ): Promise<BaseResponse<AdminEntity>>;
  deleteAdmin(param: string): Promise<BaseResponse<AdminEntity>>;
}
