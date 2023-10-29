import { AdminUpdateDto } from './dto/admin.update.dto';
import { AdminCreateDto } from './dto/admin.create.dto';
import { AdminEntity } from './../entities/admin.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/utils/base.response';
import { DbExceptions } from 'src/utils/exceptions/db.exception';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
  ) {}

  async findAll(): Promise<BaseResponse<AdminEntity[]>> {
    try {
      let data = await this.adminRepository.find();
      return {
        status: HttpStatus.OK,
        data: data,
        message: 'Data fetched successfully',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async createAdmin(
    dto: AdminCreateDto,
  ): Promise<BaseResponse<AdminEntity>> {
    try {
      let { username,password } = dto;

      let user = await this.adminRepository.findOneBy({ username });
      if (user) {
        return {
          status: HttpStatus.BAD_REQUEST,
          data: null,
          message: 'Admin already exists!',
        };
      }
      const newAdmin = await this.adminRepository
        .createQueryBuilder('admins')
        .insert()
        .into(AdminEntity)
        .values({
          username,password
        })
        .returning(['username', 'password'])
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: newAdmin.raw,
        message: 'Admin created successfully!',
      };
    } catch (err) {
      return DbExceptions.handle(err);
    }
  }

  async updateAdmin(params:any,
    dto: AdminUpdateDto
  ): Promise<BaseResponse<AdminEntity[]>> {
    try {
      let { username,password,isSuperAdmin } = dto;
      let { id } = params;
      let user = await this.adminRepository.findOneBy({ id });
      if (!user) {
        return {
          status: HttpStatus.NOT_FOUND,
          data: null,
          message: 'Admin not found!',
        };
      }
      const {raw} = await this.adminRepository
        .createQueryBuilder('admins')
        .update(AdminEntity)
        .set({ username, password, isSuperAdmin})
        .where({id})
        .returning(['username', 'password','isSuperAdmin'])
        .execute();
      return {
        status: HttpStatus.CREATED,
        data: raw,
        message: 'Admin updated successfully!',
      };
    } catch (error) {
      return DbExceptions.handle(error);
    }
  }

  async deleteAdmin(param:any): Promise<BaseResponse<AdminEntity>> {
    try {
      const { id } = param;

      let {raw} = await this.adminRepository.createQueryBuilder().softDelete()
      .from(AdminEntity)
      .where({ id })
      .returning('*')
      .execute();

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
