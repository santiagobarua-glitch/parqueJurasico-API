import {
  createIncident,
  deleteIncident,
  findAllIncidents,
  findIncidentById,
  incidentsUpdate,
} from "../repositories/incident.repository.js";
import { RecintRepository } from "../repositories/recint.repository.js";

export class RecintNotFoundError extends Error {
  constructor() {
    super("Recinto no encontrado");
  }
}

type IncidentFilters = Parameters<typeof findAllIncidents>[0];
type NewIncident = Parameters<typeof createIncident>[0];
type IncidentChanges = Parameters<typeof incidentsUpdate>[1];

async function assertRecintExists(recintId: number | null) {
  if (!recintId){
    throw new RecintNotFoundError();
  }
  if (!(await RecintRepository.findById(recintId))) {
    throw new RecintNotFoundError();
  }
}

export async function listIncidents(filters: IncidentFilters) {
  return findAllIncidents(filters);
}

export async function getIncident(id: number) {
  return findIncidentById(id);
}

export async function NewIncident(data: NewIncident) {
  await assertRecintExists(data.recint_id);
  return createIncident(data);
}

export async function updateIncident(id: number, data: IncidentChanges) {
  if (data.recint_id !== undefined) await assertRecintExists(data.recint_id);
  return updateIncident(id, data);
}

export async function removeIncident(id: number) {
  return deleteIncident(id);
}
