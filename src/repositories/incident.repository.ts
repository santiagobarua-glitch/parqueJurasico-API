import { Incident } from "../models/Incidents.js";

export interface IncidentInput {
  date_time: string;
  description: string;
  dino_id: number | null;
  recint_id: number | null;
}

export const IncidentRepository = {
  async findAll() {
    const incidents = await Incident.findAll({
      order: [["incident_id", "ASC"]],
    });

    return incidents.map((incident) => ({
      incident_id: incident.incident_id,
      date_time: incident.date_time,
      description: incident.description,
      dino_id: incident.dino_id,
      recint_id: incident.recint_id,
    }));
  },

  async findById(id: number) {
    const incident = await Incident.findByPk(id);
    if (!incident) return null;

    return {
      incident_id: incident.incident_id,
      date_time: incident.date_time,
      description: incident.description,
      dino_id: incident.dino_id,
      recint_id: incident.recint_id,
    };
  },

  async create(data: IncidentInput & { reported_by: string }) {
    const incident = await Incident.create({
      ...data,
      managed_by: null,
    });

    return {
      incident_id: incident.incident_id,
      date_time: incident.date_time,
      description: incident.description,
      dino_id: incident.dino_id,
      recint_id: incident.recint_id,
    };
  },

  async update(id: number, data: Partial<IncidentInput>) {
    const incident = await Incident.findByPk(id);
    if (!incident) return null;

    if (data.date_time !== undefined) incident.date_time = data.date_time;
    if (data.description !== undefined) incident.description = data.description;
    if (data.dino_id !== undefined) incident.dino_id = data.dino_id;
    if (data.recint_id !== undefined) incident.recint_id = data.recint_id;

    await incident.save();

    return {
      incident_id: incident.incident_id,
      date_time: incident.date_time,
      description: incident.description,
      dino_id: incident.dino_id,
      recint_id: incident.recint_id,
    };
  },

  async delete(id: number) {
    const incident = await Incident.findByPk(id);
    if (!incident) return false;

    await incident.destroy();
    return true;
  },
};