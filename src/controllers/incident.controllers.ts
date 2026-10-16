import type { Request, Response } from "express";
import {
  RecintNotFoundError,
  NewIncident,
  getIncident,
  listIncidents,
  updateIncident,
  removeIncident,
} from "../services/incident.service.js";

import { ForeignKeyConstraintError } from "sequelize";
import { authenticateToken, authorizeRole } from "../middlewares/auth.js";
import { createIncident, findIncidentById } from "../repositories/incident.repository.js";

export async function getIncidents(req: Request, res: Response) {
    try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const recintId =
      req.query.recint_id !== undefined
        ? Number(req.query.recint_id)
        : undefined;
    const dinoId =
      req.query.dino_id !== undefined
        ? Number(req.query.dino_id)
        : undefined;

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100 ||
      (recintId !== undefined && (!Number.isInteger(recintId) || recintId < 1))
    ) {
      res.status(400).json({ message: "Invalid search parameters" });
      return;
    }
    const result = await listIncidents({
        date_time: typeof req.query.date_time === "string" ? req.query.date_time : undefined,
        description: typeof req.query.description === "string" ? req.query.description : undefined,
        recint_id: recintId, page, limit,
        dino_id: dinoId
    });
    res.status(200).json(result);
} catch {
    res.status(500).json({ message: "Error retrieving incidents" });
}
}

export async function getIncidentByID (req: Request, res: Response){
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ message: "Invalid ID" });
      return;
    }

    const incident = await findIncidentById(id);
    if (!incident) {
      res.status(404).json({ message: "Incident not found" });
      return;
    }

    res.status(200).json(incident);
  } catch {
    res.status(500).json({ message: "Error retrieving the incident" });
  }
};

export async function postIncident (req: Request, res: Response) {
    try {
      const body = getBody(req);
      if (!body) {
        res.status(400).json({ message: "Invalid incident data" });
        return;
      }
      if (!req.user?.email) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }
      const {description, dino_id, recint_id } = body;
      const incidentDateTime = new Date().toISOString();
      if (
        !isDateTime(incidentDateTime) ||
        typeof description !== "string" ||
        !description.trim() ||
        !isPositiveId(dino_id) ||
        !isPositiveId(recint_id)
      ) {
        res.status(400).json({ message: "Invalid incident data" });
        return;
      }

      const incident = await createIncident({
        date_time: incidentDateTime,
        description: description.trim(),
        dino_id,
        recint_id,
        reported_by: req.user.email,
      });
      res.status(201).json(incident);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        res.status(404).json({ message: "Dinosaur or enclosure not found" });
        return;
      }
      res.status(500).json({ message: "Error creating the incident" });
    }
  };

 export async function replaceIncident (req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id < 1) {
        res.status(400).json({ message: "Invalid ID" });
        return;
      }

      const body = getBody(req);
      if (!body) {
        res.status(400).json({ message: "Invalid update data" });
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
        res.status(400).json({ message: "Invalid update data" });
        return;
      }

      const incident = await updateIncident(id, {
        ...(date_time !== undefined ? { date_time } : {}),
        ...(description !== undefined
          ? { description: (description as string).trim() }
          : {}),
        ...(dino_id !== undefined ? { dino_id } : {}),
        ...(recint_id !== undefined ? { recint_id } : {}),
      });
      if (!incident) {
        res.status(404).json({ message: "Incident not found" });
        return;
      }

      res.status(200).json(incident);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        res.status(404).json({ message: "Dinosaur or enclosure not found" });
        return;
      }
      res.status(500).json({ message: "Error updating the incident" });
    }
  };

export async function editIncident (req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id < 1) {
        res.status(400).json({ message: "Invalid ID" });
        return;
      }

      const body = getBody(req);
      if (!body) {
        res.status(400).json({ message: "Invalid update data" });
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
        res.status(400).json({ message: "Invalid update data" });
        return;
      }

      const incident = await updateIncident(id, {
        ...(date_time !== undefined ? { date_time } : {}),
        ...(description !== undefined
          ? { description: (description as string).trim() }
          : {}),
        ...(dino_id !== undefined ? { dino_id } : {}),
        ...(recint_id !== undefined ? { recint_id } : {}),
      });
      if (!incident) {
        res.status(404).json({ message: "Incident not found" });
        return;
      }

      res.status(200).json(incident);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        res.status(404).json({ message: "Dinosaur or enclosure not found" });
        return;
      }
      res.status(500).json({ message: "Error updating the incident" });
    }
  };

export async function deleteIncident (req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id < 1) {
        res.status(400).json({ message: "Invalid ID" });
        return;
      }

      const deleted = await removeIncident(id);
      if (!deleted) {
        res.status(404).json({ message: "Incident not found" });
        return;
      }

      res.status(204).send();
    } catch {
      res.status(500).json({ message: "Error deleting the incident" });
    }
  };

function getBody(req: Request): Record<string, unknown> | undefined {
  const body: unknown = req.body;
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return undefined;
  }
  return body as Record<string, unknown>;
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
