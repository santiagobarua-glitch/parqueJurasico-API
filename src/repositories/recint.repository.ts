import { Recints } from "../models/Recints.js";

export interface RecintFilters {
  security?: string;
  status?: number;
}

export interface RecintInput {
  security: string;
  capacity: number;
  status: number;
}

export const RecintRepository = {
  async findAll(filters: RecintFilters = {}) {
    const where: { security?: string; status?: number } = {};
    if (filters.security) where.security = filters.security;
    if (filters.status !== undefined) where.status = filters.status;

    const recints = await Recints.findAll({
      where,
      order: [["recint_id", "ASC"]],
    });

    return recints.map((recint) => ({
      recint_id: recint.recint_id,
      security: recint.security,
      capacity: recint.capacity,
      status: recint.status,
    }));
  },

  async findById(id: number) {
    const recint = await Recints.findByPk(id);
    if (!recint) return null;

    return {
      recint_id: recint.recint_id,
      security: recint.security,
      capacity: recint.capacity,
      status: recint.status,
    };
  },

  async create(data: RecintInput) {
    const recint = await Recints.create(data);
    return {
      recint_id: recint.recint_id,
      security: recint.security,
      capacity: recint.capacity,
      status: recint.status,
    };
  },

  async update(id: number, data: Partial<RecintInput>) {
    const recint = await Recints.findByPk(id);
    if (!recint) return null;

    if (data.security !== undefined) recint.security = data.security;
    if (data.capacity !== undefined) recint.capacity = data.capacity;
    if (data.status !== undefined) recint.status = data.status;

    await recint.save();

    return {
      recint_id: recint.recint_id,
      security: recint.security,
      capacity: recint.capacity,
      status: recint.status,
    };
  },

  async delete(id: number) {
    const recint = await Recints.findByPk(id);
    if (!recint) return false;

    await recint.destroy();
    return true;
  },
};