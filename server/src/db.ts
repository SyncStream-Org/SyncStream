import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

let { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env;
const { CI } = process.env;

if (CI) {
  POSTGRES_DB = 'mock_POSTGRES_DB';
  POSTGRES_USER = 'mock_user';
  POSTGRES_PASSWORD = 'mock_pass';
}

if ((!POSTGRES_DB || !POSTGRES_USER || !POSTGRES_PASSWORD)) {
  throw new Error("Missing database configuration");
}

const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, {
  host: 'db',
  dialect: 'postgres',
  logging: false
});

export default sequelize;