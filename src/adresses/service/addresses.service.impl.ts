import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BaseResponse, BaseResponseGet } from 'src/utils/base.response';
import { unlinkSync } from 'fs';
import { AddressesEntity } from '../../entities/adresses.entity';
import { DbExceptions } from '../../utils/exceptions/db.exception';
import { AddressCreateDto } from '../dto/address.create.dto';
import { AddressUpdateDto } from '../dto/address.update.dto';
import { AddressesService } from './addresses.service';
import { AddressesRepository } from '../repository/addresses.repository';
import { Tokens } from '../../utils/tokens';

@Injectable()
export class AddressesServiceImpl implements AddressesService {
  constructor(
    @Inject(Tokens.Addresses.Repository)
    private readonly addressesRepository: AddressesRepository,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<BaseResponseGet<AddressesEntity[]>> {
    if (Number.isNaN(page)) {
      page = 1;
    }
    if (Number.isNaN(limit)) {
      limit = 10;
    }
    const skip = (page - 1) * limit;

    const [data, totalCount] = await this.addressesRepository.findAndCount({
      skip: skip ?? 0,
      take: limit,
    });

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

  async createAddress(
    dto: AddressCreateDto,
    image: string,
  ): Promise<BaseResponse<AddressesEntity>> {
    let { address, description, location } = dto;

    let item = await this.addressesRepository.findOneBy({ address });
    if (item) {
      return {
        status: HttpStatus.BAD_REQUEST,
        data: null,
        message: 'Address already exists!',
      };
    }
    const newAddress = await this.addressesRepository
      .create({
        address,
        description,
        location,
        image,
      })
      .save();
    return {
      status: HttpStatus.CREATED,
      data: newAddress,
      message: 'Address created successfully!',
    };
  }

  async updateAddress(
    params: any,
    dto: AddressUpdateDto,
    image: any,
  ): Promise<BaseResponse<AddressesEntity>> {
    let { address, description, location, isActive, state } = dto;
    let { id } = params;
    let item = await this.addressesRepository.findOneBy({ id });
    if (!item) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: null,
        message: 'Address not found!',
      };
    }

    item.address = address ?? item.address;
    item.description = description ?? item.description;
    item.location = location ?? item.location;
    item.image = image ?? item.image;
    item.isActive = isActive ?? item.isActive;
    item.state = state ?? item.state;
    const data = await this.addressesRepository.save(item);

    return {
      status: HttpStatus.OK,
      data: data,
      message: 'Address updated successfully!',
    };
  }

  async deleteAddress(param: any): Promise<BaseResponse<AddressesEntity>> {
    const { id } = param;
    let item = await this.addressesRepository.findOneBy({ id });
    if (!item) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: null,
        message: 'Address not found!',
      };
    }

    await this.addressesRepository.delete(id);
    unlinkSync(process.cwd() + '/uploads/' + 'addresses/' + item.image);

    return {
      status: 200,
      data: item,
      message: 'Address deleted successfully',
    };
  }
}
