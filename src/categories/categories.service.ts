import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { CategoriesCreateDto } from './dto/categories.create.dto';
import { BaseResponse, BaseResponseGet } from 'src/utils/base.response';
import { DbExceptions } from 'src/utils/exceptions/db.exception';
import { CategoriesUpdateDto } from './dto/categories.update.dto';
import { ProductEntity } from '@entities/products.entity';
import { OrdersEntity } from '@entities/orders.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    @InjectRepository(OrdersEntity)
    private readonly ordersRepository: Repository<OrdersEntity>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<BaseResponseGet<CategoryEntity[]>> {
    try {
      if (Number.isNaN(page)) {
        page = 1;
      }
      if (Number.isNaN(limit)) {
        limit = 10;
      }
      const skip = (page - 1) * limit;

      const [data, totalCount] = await this.categoriesRepository.findAndCount({
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

  async createCategory(
    dto: CategoriesCreateDto,
  ): Promise<BaseResponse<CategoryEntity>> {
    try {
      let { category_name } = dto;

      let category = await this.categoriesRepository.findOneBy({
        category_name,
      });
      if (category) {
        return {
          status: HttpStatus.BAD_REQUEST,
          data: null,
          message: 'Category already exists!',
        };
      }
      const newCategory = await this.categoriesRepository
        .createQueryBuilder('categories')
        .insert()
        .into(CategoryEntity)
        .values({
          category_name,
        })
        .returning(['category_name', 'isActive', 'state'])
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: newCategory.raw,
        message: 'Category created successfully!',
      };
    } catch (err) {
      return DbExceptions.handle(err);
    }
  }

  async updateCategory(
    params: any,
    dto: CategoriesUpdateDto,
  ): Promise<BaseResponse<CategoryEntity[]>> {
    try {
      let { category_name, isActive, state } = dto;
      let { id } = params;
      let category = await this.categoriesRepository.findOneBy({ id });
      if (!category) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Category not found!',
        };
      }
      const { raw } = await this.categoriesRepository
        .createQueryBuilder('categories')
        .update(CategoryEntity)
        .set({
          category_name: category_name ?? category.category_name,
          isActive: isActive ?? category.isActive,
          state: state ?? category.state,
        })
        .where({ id })
        .returning('*')
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: raw,
        message: 'Category updated successfully!',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async deleteCategory(param: any): Promise<BaseResponse<CategoryEntity>> {
    try {
      const { id } = param;
      let product = await this.productsRepository
        .createQueryBuilder()
        .softDelete()
        .from(ProductEntity)
        .where({ category_id: id })
        .returning('*')
        .execute();

      let product_id = product.raw[0].id;

      let order = await this.ordersRepository
        .createQueryBuilder()
        .softDelete()
        .from(OrdersEntity)
        .where({ product_id: product_id })
        .execute();

      let { raw } = await this.categoriesRepository
        .createQueryBuilder()
        .softDelete()
        .from(CategoryEntity)
        .where({ id })
        .returning('*')
        .execute();

      return {
        status: 200,
        data: raw,
        message: 'Category deleted successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }
}
