import {Router, Request, Response} from "express";
import { DinoRepository } from "../repositories/dinosaur.repository.js";
import { authenticateToken, authorizeRole } from "../middlewares/auth.js";

const router = Router();

router.use(authenticateToken);

router.get("/", async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const recintId =
      req.query.recint_id !== undefined
        ? Number(req.query.recint_id)
        : undefined;

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100 ||
      (recintId !== undefined &&
        (!Number.isInteger(recintId) || recintId < 1))
    ) {
      res.status(400).json({ message: "Parámetros de búsqueda inválidos" });
      return;
    }

    const result = await DinoRepository.findAll({
      species: typeof req.query.species === "string"
        ? req.query.species
        : undefined,
      name: typeof req.query.name === "string"
        ? req.query.name
        : undefined,
      recint_id: recintId,
      page,
      limit,
    });

    res.status(200).json(result);
  } catch {
    res.status(500).json({ message: "Error al obtener dinosaurios" });
  }
});

// GET /dinosaurs/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    const dino = await DinoRepository.findById(id);

    if (!dino) {
      res.status(404).json({ message: "Dinosaurio no encontrado" });
      return;
    }

    res.status(200).json(dino);
  } catch {
    res.status(500).json({ message: "Error al obtener el dinosaurio" });
  }
});

router.post("/", authorizeRole("admin"), async (req: Request, res: Response) => {
  try {
    const { species, name, recint_id } = req.body as {
      species?: unknown;
      name?: unknown;
      recint_id?: unknown;
    };

    if (
      typeof species !== "string" ||
      !species.trim() ||
      typeof name !== "string" ||
      !name.trim() ||
      !Number.isInteger(recint_id) ||
      Number(recint_id) < 1
    ) {
      res.status(400).json({ message: "Datos del dinosaurio inválidos" });
      return;
    }

    const dino = await DinoRepository.create({
      species: species.trim(),
      name: name.trim(),
      recint_id: Number(recint_id),
    });

    res.status(201).json(dino);
  } catch {
    res.status(500).json({ message: "Error al crear el dinosaurio" });
  }
});

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

      const { species, name, recint_id } = req.body as {
        species?: unknown;
        name?: unknown;
        recint_id?: unknown;
      };

      if (
        (species !== undefined &&
          (typeof species !== "string" || !species.trim())) ||
        (name !== undefined && (typeof name !== "string" || !name.trim())) ||
        (recint_id !== undefined &&
          (!Number.isInteger(recint_id) || Number(recint_id) < 1)) ||
        (species === undefined && name === undefined && recint_id === undefined)
      ) {
        res.status(400).json({ message: "Datos de actualización inválidos" });
        return;
      }

      const dino = await DinoRepository.update(id, {
        ...(species !== undefined ? { species: species as string } : {}),
        ...(name !== undefined ? { name: name as string } : {}),
        ...(recint_id !== undefined ? { recint_id: Number(recint_id) } : {}),
      });

      if (!dino) {
        res.status(404).json({ message: "Dinosaurio no encontrado" });
        return;
      }

      res.status(200).json(dino);
    } catch {
      res.status(500).json({ message: "Error al actualizar el dinosaurio" });
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

      const deleted = await DinoRepository.delete(id);

      if (!deleted) {
        res.status(404).json({ message: "Dinosaurio no encontrado" });
        return;
      }

      res.status(204).send();
    } catch {
      res.status(500).json({
        message: "Error al eliminar el dinosaurio",
      });
    }
  }
);

export default router;
