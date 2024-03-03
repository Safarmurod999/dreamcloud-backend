import { TechnologyEntity } from '@entities/technologies.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TechnologiesService } from './technology.service';
import { TechnologiesController } from './technology.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([TechnologyEntity]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [TechnologiesService],
  controllers: [TechnologiesController],
  exports: [TechnologiesService],
})
export class TechnologiesModule {}
