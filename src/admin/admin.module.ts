import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/entities/admin.entity';
import { AdminServiceImpl } from './service/admin.service.impl';
import { AdminRepositoryImpl } from './repository/admin.repository.impl';
import { AdminController } from './admin.controller';
import { MulterModule } from '@nestjs/platform-express';
import { Tokens } from '@utils/tokens';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminEntity]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [
    {
      provide: Tokens.Admin.Service,
      useClass: AdminServiceImpl,
    },
    {
      provide: Tokens.Admin.Repository,
      useClass: AdminRepositoryImpl,
    },
  ],
  controllers: [AdminController],
  exports: [
    {
      provide: Tokens.Admin.Service,
      useClass: AdminServiceImpl,
    },
  ],
})
export class AdminModule {}
