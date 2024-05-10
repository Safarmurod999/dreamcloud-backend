import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseResponse, BaseResponseGet } from 'src/utils/base.response';
import { DbExceptions } from 'src/utils/exceptions/db.exception';
import { CustomersEntity } from '@entities/customers.entity';
import { CustomersCreateDto } from './dto/customers.create.dto';
import { CustomersUpdateDto } from './dto/customers.update.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomersEntity)
    private readonly customersRepository: Repository<CustomersEntity>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<BaseResponseGet<CustomersEntity[]>> {
    try {
      const skip = (page - 1) * limit;
      const [data, totalCount] = await this.customersRepository.findAndCount({
        skip: skip,
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
    } catch (error) {
      return DbExceptions.handleget(error);
    }
  }

  async createCustomer(
    dto: CustomersCreateDto,
  ): Promise<BaseResponse<CustomersEntity>> {
    try {
      let { mobile_phone } = dto;

      let customer = await this.customersRepository.findOneBy({ mobile_phone });
      if (customer) {
        return {
          status: HttpStatus.BAD_REQUEST,
          data: null,
          message: 'Customer already exists!',
        };
      }
      const newCustomer = await this.customersRepository
        .createQueryBuilder('customers')
        .insert()
        .into(CustomersEntity)
        .values({
          mobile_phone,
        })
        .returning('*')
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: newCustomer.raw,
        message: 'Customer created successfully!',
      };
    } catch (err) {
      return DbExceptions.handle(err);
    }
  }

  async updateCustomer(
    params: any,
    dto: CustomersUpdateDto,
  ): Promise<BaseResponse<CustomersEntity[]>> {
    try {
      let { mobile_phone, recall } = dto;
      let { id } = params;
      let customer = await this.customersRepository.findOneBy({ id });
      if (!customer) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Customer not found!',
        };
      }
      const { raw } = await this.customersRepository
        .createQueryBuilder('customers')
        .update(CustomersEntity)
        .set({
          mobile_phone: mobile_phone ?? customer.mobile_phone,
          recall: recall ?? customer.recall,
        })
        .where({ id })
        .returning('*')
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: raw,
        message: 'Customer updated successfully!',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async deleteCustomer(param: any): Promise<BaseResponse<CustomersEntity>> {
    try {
      const { id } = param;

      let { raw } = await this.customersRepository
        .createQueryBuilder()
        .softDelete()
        .from(CustomersEntity)
        .where({ id })
        .returning('*')
        .execute();

      return {
        status: 200,
        data: raw,
        message: 'Customer deleted successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }
}
