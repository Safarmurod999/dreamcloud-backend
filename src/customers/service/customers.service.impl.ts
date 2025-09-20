import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BaseResponse, BaseResponseGet } from '../../utils/base.response';
import { CustomersEntity } from '../../entities/customers.entity';
import { CustomersCreateDto } from '../dto/customers.create.dto';
import { CustomersUpdateDto } from '../dto/customers.update.dto';
import { CustomersService } from './customers.service';
import { Tokens } from '../../utils/tokens';
import { CustomersRepository } from '../repository/categories.repository';

@Injectable()
export class CustomersServiceImpl implements CustomersService {
  constructor(
    @Inject(Tokens.Customers.Repository)
    private readonly customersRepository: CustomersRepository,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<BaseResponseGet<CustomersEntity[]>> {
    if (Number.isNaN(page)) {
      page = 1;
    }
    if (Number.isNaN(limit)) {
      limit = 10;
    }
    const skip = (page - 1) * limit;

    const [data, totalCount] = await this.customersRepository.findAndCount({
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

  async createCustomer(
    dto: CustomersCreateDto,
  ): Promise<BaseResponse<CustomersEntity>> {
    let { mobile_phone } = dto;

    let customer = await this.customersRepository.findOneBy({ mobile_phone });
    if (customer) {
      return {
        status: HttpStatus.BAD_REQUEST,
        data: null,
        message: 'Customer already exists!',
      };
    }
    const newCustomer = this.customersRepository.create({
      mobile_phone,
    });
    await this.customersRepository.save(newCustomer);

    return {
      status: HttpStatus.CREATED,
      data: newCustomer,
      message: 'Customer created successfully!',
    };
  }

  async updateCustomer(
    params: any,
    dto: CustomersUpdateDto,
  ): Promise<BaseResponse<CustomersEntity>> {
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
    ((customer.mobile_phone = mobile_phone ?? customer.mobile_phone),
      (customer.recall = recall ?? customer.recall),
      await this.customersRepository.save(customer));
    return {
      status: HttpStatus.CREATED,
      data: customer,
      message: 'Customer updated successfully!',
    };
  }

  async deleteCustomer(param: any): Promise<BaseResponse<CustomersEntity>> {
    const { id } = param;
    let data = await this.customersRepository.findOneBy({ id });
    if (!data) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: null,
        message: 'Customer not found!',
      };
    }
    await this.customersRepository.delete(id);

    return {
      status: 200,
      data: data,
      message: 'Customer deleted successfully',
    };
  }
}
