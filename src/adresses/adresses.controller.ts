import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AddressesService } from './addresses.service';
import { AddressCreateDto } from './dto/address.create.dto';
import { AddressUpdateDto } from './dto/address.update.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('addresses')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/addresses',
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
    @Body() dto: AddressCreateDto,
    @Res() res: Response,
  ) {
    let response = await this.addressesService.createAddress(
      dto,
      image.filename,
    );

    res.status(response.status).send(response);
  }

  @Get()
  async findAll(req: Request, @Res() res: Response,@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    let response = await this.addressesService.findAll(page,limit);

    res.status(response.status).send(response);
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/addresses',
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
  async updateTechnology(
    @UploadedFile() image: Express.Multer.File,
    @Param() param,
    @Body() dto: AddressUpdateDto,
    @Res() res: Response,
  ) {
    let response = await this.addressesService.updateAddress(
      param,
      dto,
      image?.filename,
    );

    res.status(response.status).send(response);
  }

  @Delete('/:id')
  async deleteTechnology(@Param() param: string) {
    return await this.addressesService.deleteAddress(param);
  }
}
