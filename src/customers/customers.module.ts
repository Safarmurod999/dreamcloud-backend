import { CustomerEntity } from '../entities/customers.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  providers: [CustomersService],
  controllers: [CustomersController],
  exports:[CustomersService]
})
export class CustomersModule {}
