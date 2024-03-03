import { ProductEntity } from 'src/entities/products.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersCreateDto } from './dto/orders.create.dto';
import { BaseResponse } from 'src/utils/base.response';
import { DbExceptions } from 'src/utils/exceptions/db.exception';
import { OrdersUpdateDto } from './dto/orders.update.dto';
import { OrdersEntity } from '@entities/orders.entity';
import { CustomerEntity } from '@entities/customers.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly ordersRepository: Repository<OrdersEntity>,
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    @InjectRepository(CustomerEntity)
    private readonly customersRepository: Repository<CustomerEntity>,
  ) {}

  async findAll(): Promise<BaseResponse<OrdersEntity[]>> {
    try {
      let data = await this.ordersRepository.find();
      return {
        status: HttpStatus.OK,
        data: data,
        message: 'Data fetched successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }
  async findOne(params: any): Promise<BaseResponse<any>> {
    try {
      let { id } = params;
      let data = await this.ordersRepository.findOne({ where: { id: id } });
      if (data) {
        var product = await this.productsRepository.findOneBy({
          id: data.product_id,
        });
        if (product.count >= data.count) {
          product.count = product.count - data.count;
        } else {
          return {
            status: HttpStatus.OK,
            data: null,
            message: 'Order count is larger than spare',
          };
        }
        var customer = await this.productsRepository.findOneBy({
          id: data.customer_id,
        });
      }
      return {
        status: HttpStatus.OK,
        data: { data, product, customer },
        message: 'Data fetched successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }
  async createOrder(
    dto: OrdersCreateDto[],
  ): Promise<BaseResponse<OrdersEntity[]>> {
    try {
      // let { product_id, customer_id, count } = dto;

      // var product = await this.productsRepository.findOneBy({
      //   id: product_id,
      // });
      // if (product.count >= count) {
      //   product.count = product.count - count;
      // } else {
      //   return {
      //     status: HttpStatus.OK,
      //     data: null,
      //     message: 'Order count is larger than spare',
      //   };
      // }
      const items = dto.map((item) => this.ordersRepository.create(item));
      const newUser = await this.ordersRepository.save(dto);
      return {
        status: HttpStatus.CREATED,
        data: newUser,
        message: 'Order created successfully!',
      };
    } catch (err) {
      return DbExceptions.handle(err);
    }
  }

  async updateOrder(
    params: any,
    dto: OrdersUpdateDto,
  ): Promise<BaseResponse<OrdersEntity[]>> {
    try {
      let { product_id, customer_id, count, state, recall } = dto;
      let { id } = params;
      let user = await this.ordersRepository.findOneBy({ id });
      if (!user) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Order not found!',
        };
      }
      const { raw } = await this.ordersRepository
        .createQueryBuilder('orders')
        .update(OrdersEntity)
        .set({ product_id, customer_id, count, state, recall })
        .where({ id })
        .returning(['product_id', 'customer_id', 'count', 'state', 'recall'])
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: raw,
        message: 'Order updated successfully!',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }
  async deleteOrder(param: any): Promise<BaseResponse<OrdersEntity>> {
    try {
      const { id } = param;

      let { raw } = await this.ordersRepository
        .createQueryBuilder()
        .softDelete()
        .from(OrdersEntity)
        .where({ id })
        .returning('*')
        .execute();

      return {
        status: 200,
        data: raw,
        message: 'Order deleted successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }
}
