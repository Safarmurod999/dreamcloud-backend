import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '../entities/customers.entity';
import { Repository } from 'typeorm';
import { CustomerCreateDto } from './dto/customer.create.dto';
import { BaseResponse } from 'src/utils/base.response';
import { DbExceptions } from 'src/utils/exceptions/db.exception';
import { CustomerUpdateDto } from './dto/customer.update.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async findAll(): Promise<BaseResponse<CustomerEntity[]>> {
    try {
      let data = await this.customerRepository.find();
      return {
        status: HttpStatus.OK,
        data: data,
        message: 'Data fetched successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async createCustomer(
    dto: CustomerCreateDto,
  ): Promise<BaseResponse<CustomerEntity>> {
    try {
      let { fullname, phone_number } = dto;

      let user = await this.customerRepository.findOneBy({ fullname });
      if (user) {
        return {
          status: HttpStatus.BAD_REQUEST,
          data: null,
          message: 'Customer already exists!',
        };
      }
      const newUser = await this.customerRepository
        .createQueryBuilder('customers')
        .insert()
        .into(CustomerEntity)
        .values({
          fullname,
          phone_number,
        })
        .returning(['fullname', 'phone_number'])
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: newUser.raw,
        message: 'Customer created successfully!',
      };
    } catch (err) {
      return DbExceptions.handle(err);
    }
  }

  async updateCustomer(params:any,
    dto: CustomerUpdateDto
  ): Promise<BaseResponse<CustomerEntity[]>> {
    try {
      let { fullname, phone_number,isActive } = dto;
      let { id } = params;
      let user = await this.customerRepository.findOneBy({ id });
      if (!user) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Customer not found!',
        };
      }
      const {raw} = await this.customerRepository
        .createQueryBuilder('customers')
        .update(CustomerEntity)
        .set({ fullname, phone_number,isActive })
        .where({id})
        .returning(['fullname', 'phone_number','isActive'])
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: raw,
        message: 'Customer created successfully!',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async deleteCustomer(param:any): Promise<BaseResponse<CustomerEntity>> {
    try {
      const { id } = param;

      let {raw} = await this.customerRepository.createQueryBuilder().softDelete()
      .from(CustomerEntity)
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
