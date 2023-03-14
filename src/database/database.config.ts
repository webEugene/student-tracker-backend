import * as dotenv from 'dotenv';
import { IDatabaseConfig } from './interfaces/dbConfig.interface';

dotenv.config();

export const databaseConfig: IDatabaseConfig = {
  development: {
    username: process.env.POSTGRES_DEV_USER,
    password: process.env.POSTGRES_DEV_PASS,
    database: process.env.POSTGRES_DB_NAME_DEV,
    host: process.env.POSTGRES_DEV_HOST,
    port: process.env.POSTGRES_DEV_PORT,
    dialect: process.env.POSTGRES_DIALECT,
  },
  test: {
    username: process.env.POSTGRES_TEST_USER,
    password: process.env.POSTGRES_TEST_PASS,
    database: process.env.POSTGRES_DB_NAME_TEST,
    host: process.env.POSTGRES_TEST_HOST,
    port: process.env.POSTGRES_TEST_PORT,
    dialect: process.env.POSTGRES_TEST_DIALECT,
  },
  production: {
    username: process.env.POSTGRES_PROD_USER,
    password: process.env.POSTGRES_PROD_PASS,
    database: process.env.POSTGRES_DB_NAME_PROD,
    host: process.env.POSTGRES_PROD_HOST,
    dialect: process.env.POSTGRES_PROD_DIALECT,
  },
};
