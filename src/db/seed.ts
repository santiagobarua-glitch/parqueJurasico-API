import type { CreationAttributes } from "sequelize";
import { sequelize } from "./connection.js";
import { Dinos } from "../models/Dinos.js";
import { Incident } from "../models/Incidents.js";
import { Recints } from "../models/Recints.js";
import { Usuario } from "../models/Users.js";

async function seed() {
  try {
    await sequelize.sync({ force: true });

    const recints = await Recints.bulkCreate([
      { security: "Alta", capacity: 12, status: 1 },
      { security: "Media", capacity: 8, status: 1 },
    ]);

    const dinos = await Dinos.bulkCreate([
      { specie: "Tyrannosaurus rex", name: "Rex", recint_id: recints[0].recint_id },
      { specie: "Triceratops", name: "Tric", recint_id: recints[1].recint_id },
    ]);

    const incidentRows: Array<Omit<CreationAttributes<Incident>, "date_time">> = [
      {
        description: "SantB. rompió el cerco jugando con los dinosaurios.",
        dino_id: dinos[0].dino_id,
        recint_id: recints[0].recint_id,
        reported_by: "Equipo de seguridad",
        managed_by: "Admin",
      },
      {
        description: "Rex se escapó del recinto y causó un incidente.",
        dino_id: dinos[1].dino_id,
        recint_id: recints[1].recint_id,
        reported_by: "Guardaparques",
        managed_by: "Admin",
      },
    ];

    await Incident.bulkCreate(incidentRows as unknown as CreationAttributes<Incident>[]);

    console.log("Base de datos creada y cargada:");
    console.log(`  ${await Recints.count()} recintos`);
    console.log(`  ${await Dinos.count()} dinosaurios`);
    console.log(`  ${await Incident.count()} incidentes`);
  } finally {
    await sequelize.close();
  }
}

seed().catch((error) => {
  console.error("Error al cargar la base de datos:", error);
  throw error;
});
