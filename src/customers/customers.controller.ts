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
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtGuard } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CustomersCreateDto } from './dto/customers.create.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @Post()
  async addOne(@Body() dto: CustomersCreateDto, @Res() res: Response) {
    let response = await this.customerService.createCustomer(dto);

    res.status(response.status).send(response);
  }

  @Get()
  async findAll(req: Request, @Res() res: Response,@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    let response = await this.customerService.findAll(page, limit);

    res.status(response.status).send(response);
  }

  @UseGuards(JwtGuard)
  @Put('/:id')
  async updateCustomer(@Param() param, @Body() dto: any, @Res() res: Response) {
    let response = await this.customerService.updateCustomer(param, dto);

    res.status(response.status).send(response);
  }

  @Delete('/:id')
  async deleteCustomer(@Param() param: string) {
    return await this.customerService.deleteCustomer(param);
  }
}
