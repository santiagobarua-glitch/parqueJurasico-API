import { Router, type Request, type Response } from "express";
import { ForeignKeyConstraintError } from "sequelize";
import { RecintRepository } from "../repositories/recint.repository.js";
import { authenticateToken, authorizeRole } from "../middlewares/auth.js";

const router = Router();

router.use(authenticateToken);

function getBody(req: Request): Record<string, unknown> | null {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return null;
  }
  return req.body as Record<string, unknown>;
}

router.get("/", async (req: Request, res: Response) => {
  try {
    const status =
      typeof req.query.status === "string" ? Number(req.query.status) : undefined;
    if (status !== undefined && !Number.isInteger(status)) {
      res.status(400).json({ message: "Parámetros de búsqueda inválidos" });
      return;
    }

    const data = await RecintRepository.findAll({
      security:
        typeof req.query.security === "string" ? req.query.security : undefined,
      status,
    });
    res.status(200).json({ data });
  } catch {
    res.status(500).json({ message: "Error al obtener recintos" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    const recint = await RecintRepository.findById(id);
    if (!recint) {
      res.status(404).json({ message: "Recinto no encontrado" });
      return;
    }

    res.status(200).json(recint);
  } catch {
    res.status(500).json({ message: "Error al obtener el recinto" });
  }
});

router.post(
  "/",
  authorizeRole("admin"),
  async (req: Request, res: Response) => {
    try {
      const body = getBody(req);
      if (!body) {
        res.status(400).json({ message: "Datos del recinto inválidos" });
        return;
      }
      const { security, capacity, status } = body;
      if (
        typeof security !== "string" ||
        !security.trim() ||
        !Number.isInteger(capacity) ||
        Number(capacity) < 1 ||
        !Number.isInteger(status)
      ) {
        res.status(400).json({ message: "Datos del recinto inválidos" });
        return;
      }

      const recint = await RecintRepository.create({
        security: security.trim(),
        capacity: Number(capacity),
        status: Number(status),
      });
      res.status(201).json(recint);
    } catch {
      res.status(500).json({ message: "Error al crear el recinto" });
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
      const { security, capacity, status } = body;
      if (
        (security !== undefined &&
          (typeof security !== "string" || !security.trim())) ||
        (capacity !== undefined &&
          (!Number.isInteger(capacity) || Number(capacity) < 1)) ||
        (status !== undefined && !Number.isInteger(status)) ||
        (security === undefined && capacity === undefined && status === undefined)
      ) {
        res.status(400).json({ message: "Datos de actualización inválidos" });
        return;
      }

      const recint = await RecintRepository.update(id, {
        ...(security !== undefined ? { security: (security as string).trim() } : {}),
        ...(capacity !== undefined ? { capacity: Number(capacity) } : {}),
        ...(status !== undefined ? { status: Number(status) } : {}),
      });
      if (!recint) {
        res.status(404).json({ message: "Recinto no encontrado" });
        return;
      }

      res.status(200).json(recint);
    } catch {
      res.status(500).json({ message: "Error al actualizar el recinto" });
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
      const { security, capacity, status } = body;
      if (
        (security !== undefined &&
          (typeof security !== "string" || !security.trim())) ||
        (capacity !== undefined &&
          (!Number.isInteger(capacity) || Number(capacity) < 1)) ||
        (status !== undefined && !Number.isInteger(status)) ||
        (security === undefined && capacity === undefined && status === undefined)
      ) {
        res.status(400).json({ message: "Datos de actualización inválidos" });
        return;
      }

      const recint = await RecintRepository.update(id, {
        ...(security !== undefined ? { security: (security as string).trim() } : {}),
        ...(capacity !== undefined ? { capacity: Number(capacity) } : {}),
        ...(status !== undefined ? { status: Number(status) } : {}),
      });
      if (!recint) {
        res.status(404).json({ message: "Recinto no encontrado" });
        return;
      }

      res.status(200).json(recint);
    } catch {
      res.status(500).json({ message: "Error al actualizar el recinto" });
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

      const deleted = await RecintRepository.delete(id);
      if (!deleted) {
        res.status(404).json({ message: "Recinto no encontrado" });
        return;
      }

      res.status(204).send();
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        res.status(409).json({ message: "El recinto tiene recursos asociados" });
        return;
      }
      res.status(500).json({ message: "Error al eliminar el recinto" });
    }
  }
);

export default router;
