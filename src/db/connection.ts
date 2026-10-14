import { Sequelize } from "sequelize";

const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE = "dinopark";
const USER = "postgres";
const PASSWORD = "postgres";
const HOST = "localhost";
const PORT = 5432;

export const sequelize = DATABASE_URL
  ? new Sequelize(DATABASE_URL, {
      dialect: "postgres",
      logging: false,
    })
  : new Sequelize(DATABASE, USER, PASSWORD, {
      dialect: "postgres",
      host: HOST,
      port: PORT,
      logging: false,
    });
