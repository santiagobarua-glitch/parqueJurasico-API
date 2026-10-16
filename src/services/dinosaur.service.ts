import {
  dinosCreate,
  dinosDelete,
  dinosFindAll,
  dinosFindById,
  dinosUpdate,
} from "../repositories/dinosaur.repository.js";
import { RecintRepository } from "../repositories/recint.repository.js";

export class RecintNotFoundError extends Error {
  constructor() {
    super("Recinto no encontrado");
  }
}

type DinoFilters = Parameters<typeof dinosFindAll>[0];
type NewDino = Parameters<typeof dinosCreate>[0];
type DinoChanges = Parameters<typeof dinosUpdate>[1];

async function assertRecintExists(recintId: number) {
  if (!(await RecintRepository.findById(recintId))) {
    throw new RecintNotFoundError();
  }
}

export function listDinos(filters: DinoFilters) {
  return dinosFindAll(filters);
}

export function getDino(id: number) {
  return dinosFindById(id);
}

export async function createDino(data: NewDino) {
  await assertRecintExists(data.recint_id);
  return dinosCreate(data);
}

export async function updateDino(id: number, data: DinoChanges) {
  if (data.recint_id !== undefined) await assertRecintExists(data.recint_id);
  return dinosUpdate(id, data);
}

export function removeDino(id: number) {
  return dinosDelete(id);
}
