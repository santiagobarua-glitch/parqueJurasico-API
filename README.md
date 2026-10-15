# parqueJurasico-API


### Before execution run
> npm install sequelize
> npm install express

### Run the API in development

From the project root, start the server with:

```sh
npm run dev
```

### Seed the database

From the project root, run the TypeScript seed script with:

```sh
npm run db:seed
```

This uses Sequelize to recreate the tables and insert the sample data. Because
the seed calls `sequelize.sync({ force: true })`, it drops and recreates existing
tables; do not run it against a database whose data you need to keep.

## Add connection.ts file to src/db folder

import { Sequelize } from "sequelize";

// Connection to PostgreSQL.
// Before using, create an empty database in pgAdmin called `dino-park`.
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