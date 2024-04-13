import { ProductEntity } from 'src/entities/products.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersCreateDto } from './dto/orders.create.dto';
import { BaseResponse } from 'src/utils/base.response';
import { DbExceptions } from 'src/utils/exceptions/db.exception';
import { OrdersUpdateDto } from './dto/orders.update.dto';
import { OrdersEntity } from '@entities/orders.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly ordersRepository: Repository<OrdersEntity>,
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<BaseResponse<any>> {
    try {
      let data = await this.ordersRepository.find();
      let products = await this.productsRepository.find();

      let result = data.map((el) => {
        return {
          ...el,
          product_name: products.filter((item) => item.id == el.product_id)[0].product_name,
        };
      });
      
      return {
        status: HttpStatus.OK,
        data: result,
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
      }
      return {
        status: HttpStatus.OK,
        data: { data, product },
        message: 'Data fetched successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }
  async createOrder(dto: OrdersCreateDto): Promise<BaseResponse<OrdersEntity>> {
    try {
      let { product_id, count, customer_name, mobile_phone } = dto;

      console.log(dto);

      var product = await this.productsRepository.findOneBy({
        id: product_id,
      });
      // if (product.count >= count) {
      //   product.count = product.count - count;
      // } else {
      //   return {
      //     status: HttpStatus.OK,
      //     data: null,
      //     message: 'Order count is larger than spare',
      //   };
      // }
      const newOrder = await this.ordersRepository
        .createQueryBuilder('orders')
        .insert()
        .into(OrdersEntity)
        .values({ product_id, count, customer_name, mobile_phone })
        .returning('*')
        .execute();

      return {
        status: HttpStatus.CREATED,
        data: newOrder.raw,
        message: 'Order created successfully!',
      };
    } catch (err) {
      return DbExceptions.handle(err);
    }
  }

  async updateOrder(
    params: any,
    dto: OrdersUpdateDto,
  ): Promise<BaseResponse<OrdersEntity>> {
    try {
      let { id } = params;
      let user = await this.ordersRepository.findOneBy({ id });
      console.log(user);
      let { product_id, customer_name, count, state, recall, mobile_phone } =
        dto;

      
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
        .set({
          product_id: product_id ?? user.product_id,
          customer_name: customer_name ?? user.customer_name,
          count: count ?? user.count,
          state: state ?? user.state,
          recall: recall ?? user.recall,
          mobile_phone: mobile_phone ?? user.mobile_phone,
        })
        .where({ id })
        .returning([
          'product_name',
          'customer_name',
          'count',
          'state',
          'recall',
          'mobile_phone',
        ])
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
