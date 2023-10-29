import { Logger, HttpStatus } from '@nestjs/common';
import { BaseResponse } from '../base.response';

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
}
