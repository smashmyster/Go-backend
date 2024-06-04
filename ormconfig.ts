import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'hook',
  logging: false,
  synchronize: false,
  entities: ['src/app/entities/*{.ts,.js}'],
  migrations: ['src/migrations/*.ts'],
});
