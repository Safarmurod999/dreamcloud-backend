import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../entities/products.entity';
import { Repository } from 'typeorm';
import { ProductCreateDto } from './dto/products.create.dto';
import { BaseResponse } from 'src/utils/base.response';
import { DbExceptions } from 'src/utils/exceptions/db.exception';
import { ProductUpdateDto } from './dto/product.update.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<BaseResponse<ProductEntity[]>> {
    try {
      let data = await this.productRepository.find();
      return {
        status: HttpStatus.OK,
        data: data,
        message: 'Data fetched successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
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
      const newUser = await this.productRepository
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
        data: newUser.raw,
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
        .returning([
          'product_name',
          'category_id',
          'price',
          'count',
          'discount',
          'overweight',
          'size',
          'capacity',
          'guarantee',
          'description',
          'image',
          'status',
        ])
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

  async deleteProduct(param: any): Promise<BaseResponse<ProductEntity>> {
    try {
      const { id } = param;

      let { raw } = await this.productRepository
        .createQueryBuilder()
        .softDelete()
        .from(ProductEntity)
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
