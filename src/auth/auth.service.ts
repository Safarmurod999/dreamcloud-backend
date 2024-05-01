import { jwtHelper } from './../utils/helper';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from '../entities/admin.entity';
import { LoginDto } from './dto/auth.dto';
import { Repository } from 'typeorm';
import { BaseResponse } from '@utils/base.response';
import { DbExceptions } from '@utils/exceptions/db.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  async login(dto: LoginDto): Promise<BaseResponse<any | Error>> {
    try {
      let { username, password } = dto;
      const admin = await this.adminRepository.findOne({
        where: { username, password },
      });

      if (!admin) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Admin is not found',
        };
      }

      const TOKEN = jwtHelper.sign({
        username: admin.username,
        isSuperAdmin: admin.isSuperAdmin,
      });

      return {
        status: HttpStatus.OK,
        data: {
          access_token: TOKEN,
          username,
          isSuperAdmin: admin.isSuperAdmin,
        },
        message: 'Successfully logged in',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }
}
