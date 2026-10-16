import type { Request, Response } from "express";
import {
  RecintNotFoundError,
  createDino,
  getDino,
  listDinos,
  removeDino,
  updateDino,
} from "../services/dinosaur.service.js";


export async function getDinos (req: Request, res: Response) {
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
      res.status(400).json({ message: "Invalid search parameters" });
      return;
    }

    const result = await listDinos({
      species: typeof req.query.species === "string" ? req.query.species : undefined,
      name: typeof req.query.name === "string" ? req.query.name : undefined,
      recint_id: recintId, page, limit,
    });

    res.status(200).json(result);
  } catch {
    res.status(500).json({ message: "Error retrieving dinosaurs" });
  }
};

// GET /dinosaurs/:id
export async function getDinoByID (req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const dino = await getDino(id);

    if (!dino) {
      res.status(404).json({ message: "Dinosaur not found" });
      return;
    }

    res.status(200).json(dino);
  } catch {
    res.status(500).json({ message: "Error retrieving the dinosaur" });
  }
};

 export async function postDino (req: Request, res: Response) {
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
      res.status(400).json({ message: "Invalid dinosaur data" });
      return;
    }

    const dino = await createDino({
      species: species.trim(),
      name: name.trim(),
      recint_id: Number(recint_id),
    });

    res.status(201).json(dino);
  } catch (error) {
    if (error instanceof RecintNotFoundError) {
      res.status(400).json({ message: "Enclosure not found" });
      return;
    }
    res.status(500).json({ message: "Error creating the dinosaur" });
  }
};

export async function patchDino (req: Request, res: Response) {
  try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id < 1) {
        res.status(400).json({ message: "Invalid ID" });
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
        res.status(400).json({ message: "Invalid update data" });
        return;
      }

      const dino = await updateDino(id, {
        ...(species !== undefined ? { species: species as string } : {}),
        ...(name !== undefined ? { name: name as string } : {}),
        ...(recint_id !== undefined ? { recint_id: Number(recint_id) } : {}),
      });

      if (!dino) {
        res.status(404).json({ message: "Dinosaur not found" });
        return;
      }

      res.status(200).json(dino);
    } catch (error) {
      if (error instanceof RecintNotFoundError) {
        res.status(400).json({ message: "Enclosure not found" });
        return;
      }
      res.status(500).json({ message: "Error updating the dinosaur" });
    }
};


 export async function deleteDino (req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id < 1) {
        res.status(400).json({ message: "Invalid ID" });
        return;
      }

      const deleted = await removeDino(id);

      if (!deleted) {
        res.status(404).json({ message: "Dinosaur not found" });
        return;
      }

      res.status(204).send();
    } catch {
      res.status(500).json({
        message: "Error deleting the dinosaur",
      });
    }
  };
