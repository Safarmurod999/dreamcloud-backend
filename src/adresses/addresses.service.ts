import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/utils/base.response';
import { AddressesEntity } from '@entities/adresses.entity';
import { DbExceptions } from 'src/utils/exceptions/db.exception';
import { AddressCreateDto } from './dto/address.create.dto';
import { AddressUpdateDto } from './dto/address.update.dto';
import { unlinkSync } from 'fs';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(AddressesEntity)
    private readonly addressesRepository: Repository<AddressesEntity>,
  ) {}

  async findAll(): Promise<BaseResponse<AddressesEntity[]>> {
    try {
      let data = await this.addressesRepository.find();
      return {
        status: HttpStatus.OK,
        data: data,
        message: 'Data fetched successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async createAddress(
    dto: AddressCreateDto,
    image: string,
  ): Promise<BaseResponse<AddressesEntity>> {
    try {
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
        .createQueryBuilder('technologies')
        .insert()
        .into(AddressesEntity)
        .values({
          address,
          description,
          location,
          image,
        })
        .returning(['address', 'description', 'location', 'image'])
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: newAddress.raw,
        message: 'Address created successfully!',
      };
    } catch (err) {
      return DbExceptions.handle(err);
    }
  }

  async updateAddress(
    params: any,
    dto: AddressUpdateDto,
    image: any,
  ): Promise<BaseResponse<AddressesEntity[]>> {
    try {
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
      const { raw } = await this.addressesRepository
        .createQueryBuilder('addresses')
        .update(AddressesEntity)
        .set({
          address: address ?? item.address,
          description: description ?? item.description,
          location: location ?? item.location,
          image: image ?? item.image,
          isActive: isActive ?? item.isActive,
          state: state ?? item.state,
        })
        .where({ id })
        .returning('*')
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: raw,
        message: 'Address updated successfully!',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async deleteAddress(param: any): Promise<BaseResponse<AddressesEntity>> {
    try {
      const { id } = param;

      let { raw } = await this.addressesRepository
        .createQueryBuilder()
        .softDelete()
        .from(AddressesEntity)
        .where({ id })
        .returning('*')
        .execute();

      unlinkSync(process.cwd() + '/uploads/' + 'addresses/' + raw[0].image);
      return {
        status: 200,
        data: raw,
        message: 'Address deleted successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }
}
