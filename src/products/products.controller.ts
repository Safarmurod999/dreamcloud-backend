import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { ProductsService } from './service/products.service';
import { ProductCreateDto } from './dto/products.create.dto';
import { JwtGuard } from '../auth/auth.guard';
import { Tokens } from '../utils/tokens';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    @Inject(Tokens.Product.Service)
    private readonly productsService: ProductsService,
  ) {}

  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Post()
  async addOne(
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: ProductCreateDto,
    @Res() res: Response,
  ) {
    let response = await this.productsService.createProduct(
      dto,
      image.filename,
    );
    res.status(response.status).send(response);
  }

  @Get()
  async findAll(
    req: Request,
    @Res() res: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    let response = await this.productsService.findAll(page, limit);

    res.status(response.status).send(response);
  }

  //   @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @Put('/:id')
  async updateProduct(
    @Param() param,
    @UploadedFile() image: Express.Multer.File,
    @Body() dto: any,
    @Res() res: Response,
  ) {
    let response = await this.productsService.updateProduct(
      param,
      dto,
      image?.filename,
    );

    res.status(response.status).send(response);
  }

  @Delete('/:id')
  async deleteProduct(@Param() param: string) {
    return await this.productsService.deleteProduct(param);
  }
}
