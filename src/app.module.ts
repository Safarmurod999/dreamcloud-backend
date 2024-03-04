import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from './utils/config';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { dataSource } from './utils/dataSource';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { TechnologiesModule } from './technologies/technology.module';
import { AddressesModule } from './adresses/addresses.module';
import { ServeStaticModule } from '@nestjs/serve-static';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
    }),
    TypeOrmModule.forRoot(configuration.getTypeOrmConfig()),
    AdminModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    TechnologiesModule,
    AddressesModule,
    ServeStaticModule.forRoot({
      serveRoot: '/uploads',
      rootPath: join(__dirname, '..', 'uploads'), // Path to your static folder
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/uploads/products',
      rootPath: join(__dirname, '..', 'uploads', 'products'), // Path to your static folder
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/uploads/technologies',
      rootPath: join(__dirname, '..', 'uploads', 'technologies'), // Path to your static folder
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/uploads/addresses',
      rootPath: join(__dirname, '..', 'uploads', 'addresses'), // Path to your static folder
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        const logger = new Logger('DataSource');
        try {
          await dataSource.initialize();
          logger.log('Data source has been initialized');
          return dataSource;
        } catch (e) {
          logger.error('Error during Data Source initialization', e);
        }
      },
    },
  ],
})
export class AppModule {}
