import { unlinkSync } from 'fs';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AdminUpdateDto } from '../dto/admin.update.dto';
import { AdminEntity } from '../../entities/admin.entity';
import { BaseResponse, BaseResponseGet } from 'src/utils/base.response';
import { DbExceptions } from '../../utils/exceptions/db.exception';
import { AdminRepository } from '../repository/admin.repository';
import { Tokens } from '../../utils/tokens';
import { AdminService } from './admin.service';

@Injectable()
export class AdminServiceImpl implements AdminService {
  constructor(
    @Inject(Tokens.Admin.Repository)
    private readonly adminRepository: AdminRepository,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<BaseResponseGet<AdminEntity[]>> {
    try {
      if (Number.isNaN(page)) {
        page = 1;
      }
      if (Number.isNaN(limit)) {
        limit = 10;
      }
      const skip = (page - 1) * limit;

      const [data, totalCount] = await this.adminRepository.findAndCount({
        skip: skip ?? 0,
        take: limit,
      });

      const totalPages = Math.ceil(totalCount / limit);
      return {
        status: HttpStatus.OK,
        data: data,
        message: 'Data fetched successfully',
        pagination: {
          page: page,
          limit: limit,
          totalCount: totalCount,
          totalPages: totalPages,
        },
      };
    } catch (error) {
      return DbExceptions.handleget(error);
    }
  }
  async findOne(params: any): Promise<BaseResponse<any>> {
    try {
      let { username } = params;
      let data = await this.adminRepository.findOne({
        where: { username: username },
      });

      if (!data) {
        return {
          status: HttpStatus.OK,
          data: [],
          message: 'No admin found!',
        };
      }
      return {
        status: HttpStatus.OK,
        data: [data],
        message: 'Data fetched successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }
  async createAdmin(dto: any): Promise<BaseResponse<AdminEntity>> {
    try {
      let { username, password, email } = dto;

      let admin = await this.adminRepository.findOneBy({ username });
      if (admin) {
        return {
          status: HttpStatus.BAD_REQUEST,
          data: null,
          message: 'Admin already exists!',
        };
      }
      const newAdmin = this.adminRepository.create({
        username,
        password,
        email,
      });

      await this.adminRepository.save(newAdmin);
      return {
        status: HttpStatus.CREATED,
        data: newAdmin,
        message: 'Admin created successfully!',
      };
    } catch (err) {
      return DbExceptions.handle(err);
    }
  }

  async updateAdmin(
    params: any,
    dto: AdminUpdateDto,
    image: any,
  ): Promise<BaseResponse<any>> {
    try {
      let { username, password, email, isSuperAdmin } = dto;
      let { id } = params;
      let admin = await this.adminRepository.findOneBy({ id });
      if (!admin) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Admin not found!',
        };
      }
      const data = await this.adminRepository.update(
        { id },
        {
          username: username ?? admin.username,
          email: email ?? admin.email,
          password: password ?? admin.password,
          isSuperAdmin: isSuperAdmin ?? admin.isSuperAdmin,
          image: image ?? admin.image,
        },
      );
      return {
        status: HttpStatus.CREATED,
        data: data,
        message: 'Admin updated successfully!',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async deleteAdmin(param: any): Promise<BaseResponse<AdminEntity>> {
    try {
      const { id } = param;

      let { raw } = await this.adminRepository.softDelete(id);
      unlinkSync(process.cwd() + '/uploads/' + 'avatar/' + raw[0].image);
      return {
        status: 200,
        data: raw,
        message: 'Admin deleted successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }
}
