import { AddressesEntity } from '@entities/adresses.entity';
import { BaseResponse, BaseResponseGet } from '@utils/base.response';
import { AddressCreateDto } from '../dto/address.create.dto';
import { AddressUpdateDto } from '../dto/address.update.dto';

export interface AddressesService {
  findAll(
    page?: number,
    limit?: number,
  ): Promise<BaseResponseGet<AddressesEntity[]>>;
  createAddress(
    dto: AddressCreateDto,
    image: string,
  ): Promise<BaseResponse<AddressesEntity>>;
  updateAddress(
    params: string,
    dto: AddressUpdateDto,
    image?: string,
  ): Promise<BaseResponse<AddressesEntity>>;
  deleteAddress(param: any): Promise<BaseResponse<AddressesEntity>>;
}
