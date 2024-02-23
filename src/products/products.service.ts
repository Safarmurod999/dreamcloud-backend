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
      let user = await this.productRepository.findOneBy({ id });
      if (!user) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Customer not found!',
        };
      }
      const { raw } = await this.productRepository
        .createQueryBuilder('customers')
        .update(ProductEntity)
        .set({
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
        .where({ id })
        .returning(['fullname', 'phone_number', 'isActive'])
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
