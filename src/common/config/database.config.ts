import { registerAs } from '@nestjs/config';
import entities from '../typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const isProduction = process.env.NODE_ENV === 'production';

export default registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    type: (process.env.DB_TYPE as any) || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'my_app',

    logging: false,
    entities,
    synchronize: false,
  }),
);
