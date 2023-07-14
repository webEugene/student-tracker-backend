import { databaseConfig } from './database.config';

module.exports = {
  development: databaseConfig.development,
  test: databaseConfig.test,
  production: databaseConfig.production,
};
