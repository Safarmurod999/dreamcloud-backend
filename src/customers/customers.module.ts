import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersEntity } from '../entities/customers.entity';
import { CustomersController } from './customers.controller';
import { Tokens } from '../utils/tokens';
import { CustomersServiceImpl } from './service/customers.service.impl';
import { CustomersRepositoryImpl } from './repository/customers.repository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([CustomersEntity])],
  providers: [
    {
      provide: Tokens.Customers.Repository,
      useClass: CustomersRepositoryImpl,
    },
    {
      provide: Tokens.Customers.Service,
      useClass: CustomersServiceImpl,
    },
  ],
  controllers: [CustomersController],
  exports: [
    {
      provide: Tokens.Customers.Service,
      useClass: CustomersServiceImpl,
    },
  ],
})
export class CustomersModule {}
