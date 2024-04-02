import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';

import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { AdminCreateDto } from './dto/admin.create.dto';
import { AdminUpdateDto } from './dto/admin.update.dto';
import { ApiTags } from '@nestjs/swagger';

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
  async findAll(req: Request,@Res() res: Response) {
    let response = await this.adminsService.findAll();

    res.status(response.status).send(response);
  }

  @Put('/:id')
  async updateCustomer(@Param() param, @Body() dto: AdminUpdateDto, @Res() res: Response) {
    let response = await this.adminsService.updateAdmin(param,dto);

    res.status(response.status).send(response);
  }

  @Delete('/:id')
  async deleteCustomer(@Param() param: string) {
    return await this.adminsService.deleteAdmin(param);
  }
}
