import {Op} from "sequelize"
import { Incident } from "../models/Incidents.js";

export interface IncidentInput {
  date_time: string;
  description: string;
  dino_id: number | null;
  recint_id: number | null;
}

interface IncidentFilters{
    date_time?: string
    description?: string
    dino_id?: number
    recint_id?: number
    page: number
    limit: number
}

  export async function findAllIncidents(filters: IncidentFilters){
          
      const {date_time, description, dino_id, recint_id, page, limit} = filters

          const incidents = await Incident.findAll({
      order: [["incident_id", "ASC"]],
    });

    const allIncidents = incidents.map((incident) => ({
      incident_id: incident.incident_id,
      date_time: incident.date_time,
      description: incident.description,
      dino_id: incident.dino_id,
      recint_id: incident.recint_id,
    }));
  
      const where: {
        specie?: object | string;
        name?: object | string;
        recint_id?: object | number;
        dino_id?: object | number;
        date_time?: object | string;
      } = {};
  
      if(description){
          where.specie = {[Op.iLike]: `%${description}%`}
      }

      if(date_time){
          where.date_time = {[Op.iLike]: `%${date_time}%`}
      }
      if (recint_id !== undefined) {
        where.recint_id = recint_id;
      }
      if (dino_id !== undefined) {
        where.dino_id = dino_id;
      }
  const result = await Incident.findAndCountAll({
      where, limit, 
      offset: (page - 1) * limit,
      order: [["dino_id", "ASC"]]
  });
  
  return{
      data: result.rows.map((incident)=> ({
          incident_id: incident.incident_id,
          date_time: incident.date_time,
          description: incident.description,
          dino_id: incident.dino_id,
          recint_id: incident.recint_id
  
      })),
      pagination: {
          page, limit, total: result.count, totalPages: Math.ceil(result.count / limit )
           }
         }
  }

  export async function findIncidentById(id: number) {
    const incident = await Incident.findByPk(id);
    if (!incident) return null;

    return {
      incident_id: incident.incident_id,
      date_time: incident.date_time,
      description: incident.description,
      dino_id: incident.dino_id,
      recint_id: incident.recint_id,
    };
  }

  export async function createIncident(data: IncidentInput & { reported_by: string }) {
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
  }

  export async function incidentsUpdate(id: number, data: Partial<IncidentInput>) {
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
  }

  export async function deleteIncident(id: number) {
    const incident = await Incident.findByPk(id);
    if (!incident) return false;

    await incident.destroy();
    return true;
  };