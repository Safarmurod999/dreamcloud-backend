import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { TechnologiesRepositoryImpl } from './repository/technologies.repository.impl';
import { TechnologyEntity } from '../entities/technologies.entity';
import { TechnologiesController } from './technology.controller';
import { Tokens } from '../utils/tokens';
import { TechnologiesServiceImpl } from './service/technology.service.impl';

@Module({
  imports: [
    TypeOrmModule.forFeature([TechnologyEntity]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [
    {
      provide: Tokens.Technologies.Repository,
      useClass: TechnologiesRepositoryImpl,
    },
    {
      provide: Tokens.Technologies.Service,
      useClass: TechnologiesServiceImpl,
    },
  ],
  controllers: [TechnologiesController],
  exports: [
    {
      provide: Tokens.Technologies.Service,
      useClass: TechnologiesServiceImpl,
    },
  ],
})
export class TechnologiesModule {}
