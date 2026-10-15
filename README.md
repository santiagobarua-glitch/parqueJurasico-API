# parqueJurasico-API


### Before execution run
> npm install sequelize
> npm install express

## Add connection.ts file to src/db folder

import { Sequelize } from "sequelize";

// Connection to PostgreSQL.
// Before using, create an empty database in pgAdmin called `parkManagement`.
// 👇 Change this info for the one that corresponds to your postgres
const DATABASE = "parkManagement";
const USER = "your-user-name";
const PASSWORD = "your-password"; // use the password you choose when you installed Posgres
const HOST = "localhost";
const PORT = 5432;

export const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  dialect: "postgres",
  host: HOST,
  port: PORT,
  logging: false, // poné `console.log` si querés ver el SQL que genera Sequelize
});