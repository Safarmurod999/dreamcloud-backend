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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { AdminService } from './service/admin.service';
import { AdminCreateDto } from './dto/admin.create.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Tokens } from '@utils/tokens';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(
    @Inject(Tokens.Admin.Service)
    private readonly adminsService: AdminService,
  ) {}

  @Post()
  async addOne(@Body() dto: AdminCreateDto, @Res() res: Response) {
    let response = await this.adminsService.createAdmin(dto);

    res.status(response.status).send(response);
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    let response = await this.adminsService.findAll(page, limit);

    res.status(response.status).send(response);
  }

  @Get('/:username')
  async findOne(@Param() param, @Res() res: Response) {
    let response = await this.adminsService.findOne(param);

    res.status(response.status).send(response);
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/avatar',
        filename: (_, file, cb) => {
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
  async updateCustomer(
    @UploadedFile() image: Express.Multer.File,
    @Param() param: string,
    @Body() dto: any,
    @Res() res: Response,
  ) {
    let response = await this.adminsService.updateAdmin(
      param,
      dto,
      image?.filename,
    );

    res.status(response.status).send(response);
  }

  @Delete('/:id')
  async deleteCustomer(@Param() param: string) {
    return await this.adminsService.deleteAdmin(param);
  }
}
