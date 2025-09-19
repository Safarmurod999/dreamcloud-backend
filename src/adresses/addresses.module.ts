import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { AddressesEntity } from '../entities/adresses.entity';
import { AddressesController } from './adresses.controller';
import { AddressesServiceImpl } from './service/addresses.service.impl';
import { AddressesRepositoryImpl } from './repository/addresses.repository.impl';
import { Tokens } from '../utils/tokens';

@Module({
  imports: [
    TypeOrmModule.forFeature([AddressesEntity]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [
    {
      provide: Tokens.Addresses.Repository,
      useClass: AddressesRepositoryImpl,
    },
    {
      provide: Tokens.Addresses.Service,
      useClass: AddressesServiceImpl,
    },
  ],
  controllers: [AddressesController],
  exports: [
    {
      provide: Tokens.Addresses.Service,
      useClass: AddressesServiceImpl,
    },
  ],
})
export class AddressesModule {}
