import * as process from 'process';
import 'dotenv/config';
import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

const isProd = process.env['NODE_ENV'] === 'production';

export const configuration = {
  isProd: isProd,
  port: process.env['PORT'],
  getDataSourceConfig(): DataSourceOptions {
    return {
      type: 'postgres' as any,
      host: process.env['DB_HOST'],
      port: parseInt(process.env['DB_PORT']) || 5432,
      username: process.env['DB_USERNAME'],
      password: `${process.env['DB_PASSWORD']}`,
      database: process.env['DB_DATABASE'],
      entities: [join(__dirname, `../**/entities/**.entity.{ts,js}`)],
      synchronize: true,
      ssl: isProd
        ? {
            rejectUnauthorized: true,
            ca: process.env['DB_CERT'],
          }
        : false,
    };
  },
  getTypeOrmConfig(): TypeOrmModuleOptions {
    const ormConfig = {
      type: 'postgres' as any,
      host: process.env['DB_HOST'],
      port: parseInt(process.env['DB_PORT']) || 5432,
      username: process.env['DB_USERNAME'],
      password: `${process.env['DB_PASSWORD']}`,
      database: process.env['DB_DATABASE'],
      entities: [join(__dirname, `../**/entities/**.entity.{ts,js}`)],
      synchronize: true,
      logging: false,
      ssl: isProd
        ? {
            rejectUnauthorized: false,
            ca: process.env['DB_CERT'],
          }
        : false,
    };

    // WARNING!!! Don't change to TRUE in PRODUCTION
    // if TRUE auto changed DB by Entity model
    if (configuration.isProd) {
      ormConfig.synchronize = false;
    }

    return ormConfig;
  },
};
