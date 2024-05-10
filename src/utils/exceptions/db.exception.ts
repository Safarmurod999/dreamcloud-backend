import { Logger, HttpStatus } from '@nestjs/common';
import { BaseResponse, BaseResponseGet } from '../base.response';

export class DbExceptions {
  static handle(e): BaseResponse<null> {
    const logger = new Logger(DbExceptions.name);

    logger.error(e);

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      data: null,
      message: e.message,
    };
  }
  static handleget(e): BaseResponseGet<null> {
    const logger = new Logger(DbExceptions.name);

    logger.error(e);

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      data: null,
      message: e.message,
      pagination: {
        page: 0,
        limit: 0,
        totalCount: 0,
        totalPages: 0,
      },
    };
  }
}
