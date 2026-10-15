import { Sequelize } from "sequelize";

const DATABASE = "dino-park";
const USER = "mcueto";
const PASSWORD = "";
const HOST = "localhost";
const PORT = 5432;

export const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  dialect: "postgres",
  host: HOST,
  port: PORT,
  logging: false, // poné `console.log` si querés ver el SQL que genera Sequelize
});