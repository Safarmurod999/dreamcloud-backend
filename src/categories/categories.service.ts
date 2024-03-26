import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { CategoriesCreateDto } from './dto/categories.create.dto';
import { BaseResponse } from 'src/utils/base.response';
import { DbExceptions } from 'src/utils/exceptions/db.exception';
import { CategoriesUpdateDto } from './dto/categories.update.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<BaseResponse<CategoryEntity[]>> {
    try {
      let data = await this.categoriesRepository.find();
      return {
        status: HttpStatus.OK,
        data: data,
        message: 'Data fetched successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async createCategory(
    dto: CategoriesCreateDto,
  ): Promise<BaseResponse<CategoryEntity>> {
    try {
      let { category_name } = dto;

      let user = await this.categoriesRepository.findOneBy({ category_name });
      if (user) {
        return {
          status: HttpStatus.BAD_REQUEST,
          data: null,
          message: 'Category already exists!',
        };
      }
      const newUser = await this.categoriesRepository
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
        data: newUser.raw,
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
      let user = await this.categoriesRepository.findOneBy({ id });
      if (!user) {
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
          category_name: category_name ?? user.category_name,
          isActive: isActive ?? user.isActive,
          state: state ?? user.state,
        })
        .where({ id })
        .returning(['category_name', 'isActive', 'state'])
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
