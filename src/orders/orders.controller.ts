import { OrdersService } from './orders.service';
import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/auth/auth.guard';
import { OrdersCreateDto } from './dto/orders.create.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService:OrdersService) {}

  @Post()
  async addOne(@Body() dto:OrdersCreateDto, @Res() res: Response) {
    let response = await this.ordersService.createOrder(dto);

    res.status(response.status).send(response);
  }

  @Get()
  async findAll(req: Request,@Res() res: Response) {
    let response = await this.ordersService.findAll();

    res.status(response.status).send(response);
  }

  @Get('/:id')
  async findOne(@Param() param,req: Request,@Res() res: Response) {
    let response = await this.ordersService.findOne(param);

    res.status(response.status).send(response);
  }

  @UseGuards(JwtGuard)
  @Put('/:id')
  async updateOrder(@Param() param, @Body() dto: any, @Res() res: Response) {
    let response = await this.ordersService.updateOrder(param,dto);

    res.status(response.status).send(response);
  }

  @Delete('/:id')
  async deleteOrder(@Param() param: string) {
    return await this.ordersService.deleteOrder(param);
  }
}
