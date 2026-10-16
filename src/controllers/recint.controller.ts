import type { Request, Response } from "express";
import { RecintInUseError } from "../services/recint.service.js";
import {
  createRecint,
  getRecint,
  listRecints,
  removeRecint,
  updateRecint,
} from "../services/recint.service.js";

export async function getRecints(req: Request, res: Response) {
  try {
    const status =
      typeof req.query.status === "string" ? Number(req.query.status) : undefined;
    if (status !== undefined && !Number.isInteger(status)) {
      res.status(400).json({ message: "Invalid search parameters" });
      return;
    }

    const recints = await listRecints({
      security:
        typeof req.query.security === "string" ? req.query.security : undefined,
      status,
    });
    res.status(200).json({ data: recints });
  } catch {
    res.status(500).json({ message: "Error retrieving enclosures" });
  }
}

export async function getRecintByID(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const recint = await getRecint(id);
    if (!recint) {
      res.status(404).json({ message: "Enclosure not found" });
      return;
    }

    res.status(200).json(recint);
  } catch {
    res.status(500).json({ message: "Error retrieving the enclosure" });
  }
}

export async function postRecint(req: Request, res: Response) {
  try {
    const { security, capacity, status } = req.body as {
      security?: unknown;
      capacity?: unknown;
      status?: unknown;
    };
    if (
      typeof security !== "string" ||
      !security.trim() ||
      !Number.isInteger(capacity) ||
      Number(capacity) < 1 ||
      !Number.isInteger(status)
    ) {
      res.status(400).json({ message: "Invalid enclosure data" });
      return;
    }

    const recint = await createRecint({
      security: security.trim(),
      capacity: Number(capacity),
      status: Number(status),
    });
    res.status(201).json(recint);
  } catch {
    res.status(500).json({ message: "Error creating the enclosure" });
  }
}

export async function patchRecint(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const { security, capacity, status } = req.body as {
      security?: unknown;
      capacity?: unknown;
      status?: unknown;
    };
    if (
      (security !== undefined &&
        (typeof security !== "string" || !security.trim())) ||
      (capacity !== undefined &&
        (!Number.isInteger(capacity) || Number(capacity) < 1)) ||
      (status !== undefined && !Number.isInteger(status)) ||
      (security === undefined && capacity === undefined && status === undefined)
    ) {
      res.status(400).json({ message: "Invalid update data" });
      return;
    }

    const recint = await updateRecint(id, {
      ...(typeof security === "string" ? { security: security.trim() } : {}),
      ...(typeof capacity === "number" ? { capacity } : {}),
      ...(typeof status === "number" ? { status } : {}),
    });
    if (!recint) {
      res.status(404).json({ message: "Enclosure not found" });
      return;
    }

    res.status(200).json(recint);
  } catch {
    res.status(500).json({ message: "Error updating the enclosure" });
  }
}

export async function deleteRecint(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const deleted = await removeRecint(id);
    if (!deleted) {
      res.status(404).json({ message: "Enclosure not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    if (error instanceof RecintInUseError) {
      res.status(409).json({ message: "Enclosure has associated resources" });
      return;
    }
    res.status(500).json({ message: "Error deleting the enclosure" });
  }
}
