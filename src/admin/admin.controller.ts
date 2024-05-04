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

import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { AdminCreateDto } from './dto/admin.create.dto';
import { AdminUpdateDto } from './dto/admin.update.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/auth.guard';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminsService: AdminService) {}

  @Post()
  async addOne(@Body() dto: AdminCreateDto, @Res() res: Response) {
    let response = await this.adminsService.createAdmin(dto);

    res.status(response.status).send(response);
  }

  @Get()
  async findAll(req: Request, @Res() res: Response) {
    let response = await this.adminsService.findAll();

    res.status(response.status).send(response);
  }

  @Get('/:username')
  async findOne(@Param() param, req: Request, @Res() res: Response) {
    let response = await this.adminsService.findOne(param);

    res.status(response.status).send(response);
  }

  @Put('/:id')
  @UseGuards(JwtGuard)
  async updateCustomer(
    @Param() param,
    @Body() dto: any,
    @Res() res: Response,
  ) {
    let response = await this.adminsService.updateAdmin(param, dto);

    res.status(response.status).send(response);
  }

  @Delete('/:id')
  async deleteCustomer(@Param() param: string) {
    return await this.adminsService.deleteAdmin(param);
  }
}
