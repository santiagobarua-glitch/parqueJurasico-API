import { ForeignKeyConstraintError } from "sequelize";
import { RecintRepository } from "../repositories/recint.repository.js";

export class RecintInUseError extends Error {
  constructor() {
    super("El recinto tiene recursos asociados");
  }
}

type RecintFilters = Parameters<typeof RecintRepository.findAll>[0];
type NewRecint = Parameters<typeof RecintRepository.create>[0];
type RecintChanges = Parameters<typeof RecintRepository.update>[1];

export function listRecints(filters: RecintFilters = {}) {
  return RecintRepository.findAll(filters);
}

export function getRecint(id: number) {
  return RecintRepository.findById(id);
}

export function createRecint(data: NewRecint) {
  return RecintRepository.create(data);
}

export function updateRecint(id: number, data: RecintChanges) {
  return RecintRepository.update(id, data);
}

export async function removeRecint(id: number) {
  try {
    return await RecintRepository.delete(id);
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      throw new RecintInUseError();
    }
    throw error;
  }
}