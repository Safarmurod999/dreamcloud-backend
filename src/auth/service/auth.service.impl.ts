import { jwtHelper } from '../../utils/helper';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/auth.dto';
import { BaseResponse } from '../../utils/base.response';
import { AdminRepository } from 'src/admin/repository/admin.repository';
import { Tokens } from '../../utils/tokens';
import { AuthService } from './auth.service';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject(Tokens.Admin.Repository)
    private readonly adminRepository: AdminRepository,
  ) {}

  async login(dto: LoginDto): Promise<BaseResponse<any | Error>> {
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
      id: admin.id,
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
  }
}
