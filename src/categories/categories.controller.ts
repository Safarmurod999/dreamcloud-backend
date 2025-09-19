import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './service/categories.service';
import { CategoriesCreateDto } from './dto/categories.create.dto';
import { JwtGuard } from '../auth/auth.guard';
import { Tokens } from '../utils/tokens';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(
    @Inject(Tokens.Categories.Service)
    private readonly categoriesService: CategoriesService,
  ) {}

  @Post()
  async addOne(@Body() dto: CategoriesCreateDto, @Res() res: Response) {
    let response = await this.categoriesService.createCategory(dto);

    res.status(response.status).send(response);
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    let response = await this.categoriesService.findAll(page, limit);

    res.status(response.status).send(response);
  }

  @UseGuards(JwtGuard)
  @Put('/:id')
  async updateCategory(@Param() param, @Body() dto: any, @Res() res: Response) {
    let response = await this.categoriesService.updateCategory(param, dto);

    res.status(response.status).send(response);
  }

  @Delete('/:id')
  async deleteCategory(@Param() param: string) {
    return await this.categoriesService.deleteCategory(param);
  }
}
