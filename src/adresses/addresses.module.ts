import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { AddressesEntity } from '@entities/adresses.entity';
import { AddressesService } from './addresses.service';
import { AddressesController } from './adresses.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AddressesEntity]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [AddressesService],
  controllers: [AddressesController],
  exports: [AddressesService],
})
export class AddressesModule {}
