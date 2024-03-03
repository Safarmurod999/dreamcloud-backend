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
import { Request, Response } from 'express';
import { JwtGuard } from 'src/auth/auth.guard';
import { TechnologiesService } from './technology.service';
import { TechnologyCreateDto } from './dto/technology.create.dto';
import { TechnologyUpdateDto } from './dto/technology.update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Controller('technologies')
export class TechnologiesController {
  constructor(private readonly technologiesService: TechnologiesService) {}

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
    let response = await this.technologiesService.createTechnology(dto,video.filename);

    res.status(response.status).send(response);
  }

  @Get()
  async findAll(req: Request, @Res() res: Response) {
    let response = await this.technologiesService.findAll();

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
    let response = await this.technologiesService.updateTechnology(param, dto,video.filename);

    res.status(response.status).send(response);
  }

  @Delete('/:id')
  async deleteTechnology(@Param() param: string) {
    return await this.technologiesService.deleteTechnology(param);
  }
}
