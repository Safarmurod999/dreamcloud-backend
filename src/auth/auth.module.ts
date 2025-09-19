import { JwtStrategy } from './auth.strategy';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthServiceImpl } from './service/auth.service.impl';
import { AuthController } from './auth.controller';
import { AdminEntity } from '../entities/admin.entity';
import { AdminRepositoryImpl } from '../admin/repository/admin.repository.impl';
import { Tokens } from '../utils/tokens';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    {
      provide: Tokens.Auth.Service,
      useClass: AuthServiceImpl,
    },
    {
      provide: Tokens.Admin.Repository,
      useClass: AdminRepositoryImpl,
    },
    JwtStrategy,
  ],
})
export class AuthModule {}
