import { Request, Response } from 'express';
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
import { ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../auth/auth.guard';
import { TechnologyService } from './service/technology.service';
import { TechnologyCreateDto } from './dto/technology.create.dto';
import { TechnologyUpdateDto } from './dto/technology.update.dto';
import { Tokens } from '../utils/tokens';

@ApiTags('technologies')
@Controller('technologies')
export class TechnologiesController {
  constructor(
    @Inject(Tokens.Technologies.Service)
    private readonly technologiesService: TechnologyService,
  ) {}

  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads/technologies',
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
    @UploadedFile() video: Express.Multer.File,
    @Body() dto: TechnologyCreateDto,
    @Res() res: Response,
  ) {
    let response = await this.technologiesService.createTechnology(
      dto,
      video?.filename,
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
    let response = await this.technologiesService.findAll(page, limit);

    res.status(response.status).send(response);
  }

  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './uploads/technologies',
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
    @UploadedFile() video: Express.Multer.File,
    @Param() param,
    @Body() dto: TechnologyUpdateDto,
    @Res() res: Response,
  ) {
    let response = await this.technologiesService.updateTechnology(
      param,
      dto,
      video?.filename,
    );

    res.status(response.status).send(response);
  }

  @Delete('/:id')
  async deleteTechnology(@Param() param: string) {
    return await this.technologiesService.deleteTechnology(param);
  }
}
