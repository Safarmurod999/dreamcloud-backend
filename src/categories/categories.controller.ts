import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesCreateDto } from './dto/categories.create.dto';
import { Request, Response } from 'express';
import { CategoriesUpdateDto } from './dto/categories.update.dto';
import { JwtGuard } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async addOne(@Body() dto: CategoriesCreateDto, @Res() res: Response) {
    let response = await this.categoriesService.createCategory(dto);

    res.status(response.status).send(response);
  }

  @Get()
  async findAll(req: Request, @Res() res: Response) {
    let response = await this.categoriesService.findAll();

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
