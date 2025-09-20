import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ProductEntity } from '../../entities/products.entity';
import { ProductCreateDto } from '../dto/products.create.dto';
import { BaseResponse, BaseResponseGet } from '../../utils/base.response';
import { DbExceptions } from '../../utils/exceptions/db.exception';
import { ProductUpdateDto } from '../dto/product.update.dto';
import { unlinkSync } from 'fs';
import { ProductsService } from './products.service';
import { Tokens } from '../../utils/tokens';
import { ProductsRepository } from '../repository/products.repository';
import { OrdersRepository } from '../../orders/repository/orders.repository';

@Injectable()
export class ProductsServiceImpl implements ProductsService {
  constructor(
    @Inject(Tokens.Product.Repository)
    private readonly productRepository: ProductsRepository,
    @Inject(Tokens.Orders.Repository)
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<BaseResponseGet<ProductEntity[]>> {
    if (Number.isNaN(page)) {
      page = 1;
    }
    if (Number.isNaN(limit)) {
      limit = 10;
    }
    const skip = (page - 1) * limit;
    const [data, totalCount] = await this.productRepository.findAndCount({
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

  async createProduct(
    dto: ProductCreateDto,
    image: any,
  ): Promise<BaseResponse<ProductEntity>> {
    let {
      product_name,
      category_id,
      price,
      count,
      discount,
      overweight,
      size,
      capacity,
      guarantee,
      description,
      status,
    } = dto;
    let product = await this.productRepository.findOneBy({ product_name });
    if (product) {
      return {
        status: HttpStatus.BAD_REQUEST,
        data: null,
        message: 'Product already exists!',
      };
    }
    const newProduct = this.productRepository.create({
      product_name,
      category_id,
      price,
      count,
      discount,
      overweight,
      size,
      capacity,
      guarantee,
      description,
      image,
      status,
    });
    await this.productRepository.save(newProduct);
    return {
      status: HttpStatus.CREATED,
      data: newProduct,
      message: 'Product created successfully!',
    };
  }

  async updateProduct(
    params: any,
    dto: ProductUpdateDto,
    image: any,
  ): Promise<BaseResponse<ProductEntity>> {
    let {
      product_name,
      category_id,
      price,
      count,
      discount,
      overweight,
      size,
      capacity,
      guarantee,
      description,
      status,
    } = dto;
    let { id } = params;
    let product = await this.productRepository.findOneBy({ id });
    if (!product) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: null,
        message: 'Product not found!',
      };
    }
    product.product_name = product_name ?? product.product_name;
    product.category_id = category_id ?? product.category_id;
    product.price = price ?? product.price;
    product.count = count ?? product.count;
    product.discount = discount ?? product.discount;
    product.overweight = overweight ?? product.overweight;
    product.size = size ?? product.size;
    product.capacity = capacity ?? product.capacity;
    product.guarantee = guarantee ?? product.guarantee;
    product.description = description ?? product.description;
    product.image = image ?? product.image;
    product.status = status ?? product.status;
    await this.productRepository.save(product);
    return {
      status: HttpStatus.CREATED,
      data: product,
      message: 'Product updated successfully!',
    };
  }

  async deleteProduct(param: any): Promise<BaseResponse<ProductEntity>> {
    const { id } = param;
    let order = await this.ordersRepository.findOneBy({ product_id: id });
    if (order) {
      return {
        status: HttpStatus.BAD_REQUEST,
        data: null,
        message:
          'You cannot delete this product because there is an order for it!',
      };
    }
    await this.ordersRepository.delete({ product_id: id });
    let raw = await this.productRepository.findOneBy({ id });
    if (!raw) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: null,
        message: 'Product not found!',
      };
    }

    await this.productRepository.delete(id);

    unlinkSync(process.cwd() + '/uploads/' + 'products/' + raw.image);
    return {
      status: 200,
      data: raw,
      message: 'Product deleted successfully',
    };
  }
}
