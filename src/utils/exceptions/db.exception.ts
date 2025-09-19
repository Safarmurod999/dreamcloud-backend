import {
  Logger,
  HttpStatus,
  Catch,
  ExceptionFilter,
  ArgumentsHost,
} from '@nestjs/common';
import { BaseResponse, BaseResponseGet } from '../base.response';
import { Response } from 'express';

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

@Catch(Error) // yoki faqat ma'lum errorlarni tutmoqchi bo'lsangiz
export class DbExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DbExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.logger.error(exception);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message,
      data: null,
    });
  }
}
