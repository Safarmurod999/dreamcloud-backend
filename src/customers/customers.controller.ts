import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomerCreateDto } from './dto/customer.create.dto';
import { Request, Response } from 'express';
import { CustomerUpdateDto } from './dto/customer.update.dto';
import { JwtGuard } from 'src/auth/auth.guard';
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async addOne(@Body() dto: CustomerCreateDto, @Res() res: Response) {
    let response = await this.customersService.createCustomer(dto);

    res.status(response.status).send(response);
  }

  @Get()
  async findAll(req: Request,@Res() res: Response) {
    let response = await this.customersService.findAll();

    res.status(response.status).send(response);
  }

  @UseGuards(JwtGuard)
  @Put('/:id')
  async updateCustomer(@Param() param, @Body() dto: CustomerUpdateDto, @Res() res: Response) {
    let response = await this.customersService.updateCustomer(param,dto);

    res.status(response.status).send(response);
  }

  @Delete('/:id')
  async deleteCustomer(@Param() param: string) {
    return await this.customersService.deleteCustomer(param);
  }
}
