import * as process from 'process';
import 'dotenv/config'
import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { CustomerEntity } from 'src/entities/customers.entity';

export const configuration = {
    isProd: process.env['APP_STATUS'] == 'prod', 
    port: process.env['PORT'],
    getDataSourceConfig(): DataSourceOptions {
        console.log(process.env['DB_HOST']);
        
        return {
            type: 'postgres' as any,
            host: process.env['DB_HOST'],
            port: parseInt(process.env['DB_PORT']),
            username: process.env['DB_USERNAME'] || 'postgres',
            password: `${process.env['DB_PASSWORD']}`,
            database: process.env['DB_DATABASE'] || 'dreamcloud',
            entities: [join(__dirname, `../**/entities/**.entity.{ts,js}`)],
            synchronize: true
        };
    
    },
    getTypeOrmConfig(): TypeOrmModuleOptions {

        const ormConfig = {
            type: process.env['DB_TYPE'] as any,
            host: process.env['DB_HOST'],
            port: parseInt(process.env['DB_PORT']),
            username: process.env['DB_USERNAME'] || 'postgres',
            password: `${process.env['DB_PASSWORD']}`,
            database: process.env['DB_DATABASE'],
            entities: [join(__dirname, `../**/entities/**.entity.{ts,js}`)],
            synchronize: true,
            logging: false
        };

        // WARNING!!! Don't change to TRUE in PRODUCTION
        // if TRUE auto changed DB by Entity model
        if (configuration.isProd) {

            ormConfig.synchronize = false;
        
        }
        return ormConfig;
    
    }
};
