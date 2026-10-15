import { Router, type Request, type Response } from "express";
import { ForeignKeyConstraintError } from "sequelize";
import { IncidentRepository } from "../repositories/incident.repository.js";
import { authenticateToken, authorizeRole } from "../middlewares/auth.js";

const router = Router();

router.use(authenticateToken);

function getBody(req: Request): Record<string, unknown> | null {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return null;
  }
  return req.body as Record<string, unknown>;
}

function isDateTime(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return false;
  }

  if (!value.includes("T") || !value.includes(":")) {
    return false;
  }

  const date = new Date(timestamp);
  return date.toISOString() === value || date.toISOString().replace("Z", "") === value.replace("Z", "");
}


function isPositiveId(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) > 0;
}

router.get("/", async (_req: Request, res: Response) => {
  try {
    const data = await IncidentRepository.findAll();
    res.status(200).json({ data });
  } catch {
    res.status(500).json({ message: "Error al obtener incidentes" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    const incident = await IncidentRepository.findById(id);
    if (!incident) {
      res.status(404).json({ message: "Incidente no encontrado" });
      return;
    }

    res.status(200).json(incident);
  } catch {
    res.status(500).json({ message: "Error al obtener el incidente" });
  }
});

router.post(
  "/",
  async (req: Request, res: Response) => {
    try {
      const body = getBody(req);
      if (!body) {
        res.status(400).json({ message: "Datos del incidente inválidos" });
        return;
      }
      if (!req.user?.email) {
        res.status(401).json({ message: "Autenticación requerida" });
        return;
      }
      const { date_time, description, dino_id, recint_id } = body;
      if (
        !isDateTime(date_time) ||
        typeof description !== "string" ||
        !description.trim() ||
        !isPositiveId(dino_id) ||
        !isPositiveId(recint_id)
      ) {
        res.status(400).json({ message: "Datos del incidente inválidos" });
        return;
      }

      const incident = await IncidentRepository.create({
        date_time,
        description: description.trim(),
        dino_id,
        recint_id,
        reported_by: req.user.email,
      });
      res.status(201).json(incident);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        res.status(404).json({ message: "Dinosaurio o recinto no encontrado" });
        return;
      }
      res.status(500).json({ message: "Error al crear el incidente" });
    }
  }
);

router.put(
  "/:id",
  authorizeRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id < 1) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }

      const body = getBody(req);
      if (!body) {
        res.status(400).json({ message: "Datos de actualización inválidos" });
        return;
      }
      const { date_time, description, dino_id, recint_id } = body;
      if (
        (date_time !== undefined && !isDateTime(date_time)) ||
        (description !== undefined &&
          (typeof description !== "string" || !description.trim())) ||
        (dino_id !== undefined && !isPositiveId(dino_id)) ||
        (recint_id !== undefined && !isPositiveId(recint_id)) ||
        (date_time === undefined &&
          description === undefined &&
          dino_id === undefined &&
          recint_id === undefined)
      ) {
        res.status(400).json({ message: "Datos de actualización inválidos" });
        return;
      }

      const incident = await IncidentRepository.update(id, {
        ...(date_time !== undefined ? { date_time } : {}),
        ...(description !== undefined
          ? { description: (description as string).trim() }
          : {}),
        ...(dino_id !== undefined ? { dino_id } : {}),
        ...(recint_id !== undefined ? { recint_id } : {}),
      });
      if (!incident) {
        res.status(404).json({ message: "Incidente no encontrado" });
        return;
      }

      res.status(200).json(incident);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        res.status(404).json({ message: "Dinosaurio o recinto no encontrado" });
        return;
      }
      res.status(500).json({ message: "Error al actualizar el incidente" });
    }
  }
);

router.patch(
  "/:id",
  authorizeRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id < 1) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }

      const body = getBody(req);
      if (!body) {
        res.status(400).json({ message: "Datos de actualización inválidos" });
        return;
      }
      const { date_time, description, dino_id, recint_id } = body;
      if (
        (date_time !== undefined && !isDateTime(date_time)) ||
        (description !== undefined &&
          (typeof description !== "string" || !description.trim())) ||
        (dino_id !== undefined && !isPositiveId(dino_id)) ||
        (recint_id !== undefined && !isPositiveId(recint_id)) ||
        (date_time === undefined &&
          description === undefined &&
          dino_id === undefined &&
          recint_id === undefined)
      ) {
        res.status(400).json({ message: "Datos de actualización inválidos" });
        return;
      }

      const incident = await IncidentRepository.update(id, {
        ...(date_time !== undefined ? { date_time } : {}),
        ...(description !== undefined
          ? { description: (description as string).trim() }
          : {}),
        ...(dino_id !== undefined ? { dino_id } : {}),
        ...(recint_id !== undefined ? { recint_id } : {}),
      });
      if (!incident) {
        res.status(404).json({ message: "Incidente no encontrado" });
        return;
      }

      res.status(200).json(incident);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        res.status(404).json({ message: "Dinosaurio o recinto no encontrado" });
        return;
      }
      res.status(500).json({ message: "Error al actualizar el incidente" });
    }
  }
);

router.delete(
  "/:id",
  authorizeRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id < 1) {
        res.status(400).json({ message: "ID inválido" });
        return;
      }

      const deleted = await IncidentRepository.delete(id);
      if (!deleted) {
        res.status(404).json({ message: "Incidente no encontrado" });
        return;
      }

      res.status(204).send();
    } catch {
      res.status(500).json({ message: "Error al eliminar el incidente" });
    }
  }
);

export default router;
