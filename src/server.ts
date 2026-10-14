import process from "node:process";
import express, { type Request, type Response } from "express";
import swaggerUi from "swagger-ui-express";
import { sequelize } from "./db/connection.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/docs", express.static("docs"));

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Parque de Dinosaurios API running",
    docs: `http://localhost:${PORT}/api-docs`,
  });
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: { url: "/docs/openapi.yaml" },
  })
);

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Postgre conectado");
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
      console.log(`Docs available at    http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("No se pudo conectar a Postgre:", error);
  }
}

start();
