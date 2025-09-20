import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { OrdersCreateDto } from '../dto/orders.create.dto';
import { BaseResponse, BaseResponseGet } from 'src/utils/base.response';
import { OrdersUpdateDto } from '../dto/orders.update.dto';
import { OrdersEntity } from '../../entities/orders.entity';
import { Tokens } from '../../utils/tokens';
import { OrdersRepository } from '../repository/orders.repository';
import { OrdersService } from './orders.service';
import { ProductsRepository } from '../../products/repository/products.repository';

@Injectable()
export class OrdersServiceImpl implements OrdersService {
  constructor(
    @Inject(Tokens.Orders.Repository)
    private readonly ordersRepository: OrdersRepository,
    @Inject(Tokens.Product.Repository)
    private readonly productsRepository: ProductsRepository,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<BaseResponseGet<any>> {
    let products = await this.productsRepository.find();
    if (Number.isNaN(page)) {
      page = 1;
    }
    if (Number.isNaN(limit)) {
      limit = 10;
    }
    const skip = (page - 1) * limit;

    const [data, totalCount] = await this.ordersRepository.findAndCount({
      skip: skip ?? 0,
      take: limit,
    });
    let result = data.map((el) => {
      return {
        ...el,
        product_name: products.filter((item) => item.id == el.product_id)[0]
          .product_name,
      };
    });
    const totalPages = Math.ceil(totalCount / limit);
    return {
      status: HttpStatus.OK,
      data: result,
      message: 'Data fetched successfully',
      pagination: {
        page: page,
        limit: limit,
        totalCount: totalCount,
        totalPages: totalPages,
      },
    };
  }

  async findOne(params: any): Promise<BaseResponse<any>> {
    let { id } = params;
    let data = await this.ordersRepository.findOne({ where: { id: id } });
    let product;
    if (data) {
      product = await this.productsRepository.findOneBy({
        id: data.product_id,
      });
    }
    return {
      status: HttpStatus.OK,
      data: { data, product },
      message: 'Data fetched successfully',
    };
  }

  async createOrder(dto: OrdersCreateDto): Promise<BaseResponse<OrdersEntity>> {
    let { product_id, count, customer_name, mobile_phone } = dto;

    let product = await this.productsRepository.findOneBy({ id: product_id });

    if (product.count < count) {
      return {
        status: HttpStatus.OK,
        data: null,
        message: 'There is not enough products in stock!',
      };
    }

    product.count = product.count - count;
    await this.productsRepository.save(product);

    const newOrder = this.ordersRepository.create({
      product_id,
      count,
      customer_name,
      mobile_phone,
    });
    await this.ordersRepository.save(newOrder);

    return {
      status: HttpStatus.CREATED,
      data: newOrder,
      message: 'Order created successfully!',
    };
  }

  async updateOrder(
    params: any,
    dto: OrdersUpdateDto,
  ): Promise<BaseResponse<any>> {
    let { id } = params;
    let products = await this.productsRepository.find();
    let order = await this.ordersRepository.findOneBy({ id });

    if (!order) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: null,
        message: 'Order not found!',
      };
    }
    
    let product_name;
    if (order) {
      product_name = products.find((item) => item.id == order.product_id);
    }
    let { product_id, customer_name, count, state, recall, mobile_phone } = dto;

    order.product_id = product_id ?? order.product_id;
    order.customer_name = customer_name ?? order.customer_name;
    order.count = count ?? order.count;
    order.state = state ?? order.state;
    order.recall = recall ?? order.recall;
    order.mobile_phone = mobile_phone ?? order.mobile_phone;

    await this.ordersRepository.save(order);
    return {
      status: HttpStatus.OK,
      data: { ...order, product_name: product_name.product_name },
      message: 'Order updated successfully!',
    };
  }

  async deleteOrder(param: any): Promise<BaseResponse<OrdersEntity>> {
    const { id } = param;

    let data = await this.ordersRepository.findOneBy({ id });
    if (!data) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: null,
        message: 'Order not found!',
      };
    }
    await this.ordersRepository.delete(id);

    return {
      status: 200,
      data,
      message: 'Order deleted successfully',
    };
  }
}
