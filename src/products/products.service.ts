import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/products.entity';
import { Repository } from 'typeorm';
import { ProductCreateDto } from './dto/products.create.dto';
import { BaseResponse, BaseResponseGet } from 'src/utils/base.response';
import { DbExceptions } from 'src/utils/exceptions/db.exception';
import { ProductUpdateDto } from './dto/product.update.dto';
import { OrdersEntity } from '@entities/orders.entity';
import { unlinkSync } from 'fs';
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(OrdersEntity)
    private readonly ordersRepository: Repository<OrdersEntity>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<BaseResponseGet<ProductEntity[]>> {
    try {
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
    } catch (error) {
      return DbExceptions.handleget(error);
    }
  }

  async createProduct(
    dto: ProductCreateDto,
    image: any,
  ): Promise<BaseResponse<ProductEntity>> {
    try {
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
      const newProduct = await this.productRepository
        .createQueryBuilder('customers')
        .insert()
        .into(ProductEntity)
        .values({
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
        })
        .returning('*')
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: newProduct.raw,
        message: 'Product created successfully!',
      };
    } catch (err) {
      return DbExceptions.handle(err);
    }
  }

  async updateProduct(
    params: any,
    dto: ProductUpdateDto,
    image: any,
  ): Promise<BaseResponse<ProductEntity[]>> {
    try {
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
      const { raw } = await this.productRepository
        .createQueryBuilder('customers')
        .update(ProductEntity)
        .set({
          product_name: product_name ?? product.product_name,
          category_id: category_id ?? product.category_id,
          price: price ?? product.price,
          count: count ?? product.count,
          discount: discount ?? product.discount,
          overweight: overweight ?? product.overweight,
          size: size ?? product.size,
          capacity: capacity ?? product.capacity,
          guarantee: guarantee ?? product.guarantee,
          description: description ?? product.description,
          image: image ?? product.image,
          status: status ?? product.status,
        })
        .where({ id })
        .returning('*')
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: raw,
        message: 'Product updated successfully!',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async deleteProduct(param: any): Promise<BaseResponse<ProductEntity>> {
    try {
      const { id } = param;
      let order = await this.ordersRepository
        .createQueryBuilder()
        .softDelete()
        .from(OrdersEntity)
        .where({ product_id: id })
        .returning('*')
        .execute();
      let { raw } = await this.productRepository
        .createQueryBuilder()
        .softDelete()
        .from(ProductEntity)
        .where({ id })
        .returning('*')
        .execute();
      unlinkSync(process.cwd() + '/uploads/' + 'products/' + raw[0].image);
      return {
        status: 200,
        data: raw,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }
}
