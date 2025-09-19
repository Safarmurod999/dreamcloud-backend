import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CategoryEntity } from '../../entities/category.entity';
import { Repository } from 'typeorm';
import { CategoriesCreateDto } from '../dto/categories.create.dto';
import { BaseResponse, BaseResponseGet } from 'src/utils/base.response';
import { CategoriesUpdateDto } from '../dto/categories.update.dto';
import { ProductEntity } from '@entities/products.entity';
import { OrdersEntity } from '@entities/orders.entity';
import { Tokens } from '../../utils/tokens';
import { CategoriesRepository } from '../repository/categories.repository';

@Injectable()
export class CategoriesServiceImpl {
  constructor(
    @Inject(Tokens.Categories.Repository)
    private readonly categoriesRepository: CategoriesRepository,
    @Inject(Tokens.Product.Repository)
    private readonly productsRepository: Repository<ProductEntity>,
    @Inject(Tokens.Orders.Repository)
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
  ): Promise<BaseResponse<CategoryEntity[]>> {
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
    const { raw } = await this.categoriesRepository.update(
      { id },
      {
        category_name: category_name ?? category.category_name,
        isActive: isActive ?? category.isActive,
        state: state ?? category.state,
      },
    );
    return {
      status: HttpStatus.CREATED,
      data: raw,
      message: 'Category updated successfully!',
    };
  }

  async deleteCategory(param: any): Promise<BaseResponse<CategoryEntity>> {
    const { id } = param;
    let product = await this.productsRepository.softDelete(id);

    let product_id = product.raw[0].id;

    await this.ordersRepository.softDelete(product_id);

    let { raw } = await this.categoriesRepository.softDelete(id);

    return {
      status: 200,
      data: raw,
      message: 'Category deleted successfully',
    };
  }
}
