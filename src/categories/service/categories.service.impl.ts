import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CategoryEntity } from '../../entities/category.entity';
import { Repository } from 'typeorm';
import { CategoriesCreateDto } from '../dto/categories.create.dto';
import { BaseResponse, BaseResponseGet } from 'src/utils/base.response';
import { CategoriesUpdateDto } from '../dto/categories.update.dto';
import { ProductEntity } from '../../entities/products.entity';
import { OrdersEntity } from '../../entities/orders.entity';
import { Tokens } from '../../utils/tokens';
import { CategoriesRepository } from '../repository/categories.repository';
import { CategoriesService } from './categories.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesServiceImpl implements CategoriesService {
  constructor(
    @Inject(Tokens.Categories.Repository)
    private readonly categoriesRepository: CategoriesRepository,
    @InjectRepository(ProductEntity)
    private readonly productsRepository: Repository<ProductEntity>,
    @InjectRepository(OrdersEntity)
    private readonly ordersRepository: Repository<OrdersEntity>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<BaseResponseGet<CategoryEntity[]>> {
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
  }

  async createCategory(
    dto: CategoriesCreateDto,
  ): Promise<BaseResponse<CategoryEntity>> {
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
    const newCategory = this.categoriesRepository.create({
      category_name,
    });

    await this.categoriesRepository.save(newCategory);
    return {
      status: HttpStatus.CREATED,
      data: newCategory,
      message: 'Category created successfully!',
    };
  }

  async updateCategory(
    params: any,
    dto: CategoriesUpdateDto,
  ): Promise<BaseResponse<CategoryEntity>> {
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

    category.category_name = category_name ?? category.category_name;
    category.isActive = isActive ?? category.isActive;
    category.state = state ?? category.state;
    await this.categoriesRepository.save(category);

    return {
      status: HttpStatus.OK,
      data: category,
      message: 'Category updated successfully!',
    };
  }

  async deleteCategory(param: any): Promise<BaseResponse<CategoryEntity>> {
    const { id } = param;

    let product = await this.productsRepository.find({
      where: { category_id: id },
    });
    await this.productsRepository.delete({ category_id: id });

    let product_id = product[0].id;

    await this.ordersRepository.delete({ product_id });

    let data = await this.categoriesRepository.findOneBy({ id });
    if (!data) {
      return {
        status: HttpStatus.NOT_FOUND,
        data: null,
        message: 'Category not found!',
      };
    }
    await this.categoriesRepository.delete(id);

    return {
      status: HttpStatus.OK,
      data: data,
      message: 'Category deleted successfully',
    };
  }
}
