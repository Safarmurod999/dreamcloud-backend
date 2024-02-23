import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductCreateDto } from './dto/products.create.dto';
import { Request, Response } from 'express';
import { ProductUpdateDto } from './dto/product.update.dto';
import { JwtGuard } from 'src/auth/auth.guard';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '@utils/multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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
  async findAll(req: Request, @Res() res: Response) {
    let response = await this.productsService.findAll();

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
    @Body() dto: ProductUpdateDto,
    @Res() res: Response,
  ) {
    let response = await this.productsService.updateProduct(
      param,
      dto,
      image.filename,
    );

    res.status(response.status).send(response);
  }

  @Delete('/:id')
  async deleteProduct(@Param() param: string) {
    return await this.productsService.deleteProduct(param);
  }
}
