import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const dataSourceOptions: DataSourceOptions = {
  type: (process.env.DB_TYPE as any) || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'my_app',

  // Entity'lerin (tablo şemaları) nerede olduğu

  entities: ['dist/**/*.entity.js'],

  // Migration dosyalarının nerede olduğu
  migrations: ['dist/db/migrations/*.js'],

  // Migration kullanıldığı için synchronize KAPALI olmalıdır
  synchronize: false,
  logging: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
