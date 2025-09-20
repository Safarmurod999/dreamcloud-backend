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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/auth.guard';
import { OrdersCreateDto } from './dto/orders.create.dto';
import { OrdersService } from './service/orders.service';
import { Tokens } from '../utils/tokens';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(Tokens.Orders.Service)
    private readonly ordersService: OrdersService,
  ) {}

  @Post()
  async addOne(@Body() dto: OrdersCreateDto, @Res() res: Response) {
    let response = await this.ordersService.createOrder(dto);

    res.status(response.status).send(response);
  }

  @Get()
  async findAll(
    @Res() res: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    let response = await this.ordersService.findAll(page, limit);

    res.status(response.status).send(response);
  }

  @Get('/:id')
  async findOne(@Param() param, req: Request, @Res() res: Response) {
    let response = await this.ordersService.findOne(param);

    res.status(response.status).send(response);
  }

  @UseGuards(JwtGuard)
  @Put('/:id')
  async updateOrder(@Param() param, @Body() dto: any, @Res() res: Response) {
    let response = await this.ordersService.updateOrder(param, dto);

    res.status(response.status).send(response);
  }

  @Delete('/:id')
  async deleteOrder(@Param() param: string) {
    return await this.ordersService.deleteOrder(param);
  }
}
