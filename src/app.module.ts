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
import { CustomersModule } from './customers/customers.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), `.env.${process.env.NODE_ENV}`),
    }),
    TypeOrmModule.forRoot(configuration.getTypeOrmConfig()),
    AdminModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    TechnologiesModule,
    AddressesModule,
    CustomersModule,
    ServeStaticModule.forRoot({
      serveRoot: '/uploads',
      rootPath: join(__dirname, '..', 'uploads'),
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/uploads/products',
      rootPath: join(__dirname, '..', 'uploads', 'products'),
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/uploads/technologies',
      rootPath: join(__dirname, '..', 'uploads', 'technologies'),
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/uploads/addresses',
      rootPath: join(__dirname, '..', 'uploads', 'addresses'),
    }),
    ServeStaticModule.forRoot({
      serveRoot: '/uploads/avatar',
      rootPath: join(__dirname, '..', 'uploads', 'avatar'),
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
