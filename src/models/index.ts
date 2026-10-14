import { Dinos } from "./Dinos.js";
import { Incident } from "./Incidents.js";
import { Recints } from "./Recints.js";

Dinos.belongsTo(Recints, {foreignKey: "recint_id", as: "recint", onDelete: "RESTRICT"});
Recints.hasMany(Dinos, {foreignKey: "recint_id", as: "dinos", onDelete: "RESTRICT"});

Dinos.hasMany(Incident, {foreignKey: "dino_id", as: "incidents", onDelete: "SET NULL"});
Incident.belongsTo(Dinos, {foreignKey: "dino_id", as: "dino", onDelete: "SET NULL"});

Recints.hasMany(Incident, {foreignKey: "recint_id", as: "incidents", onDelete: "SET NULL"});
Incident.belongsTo(Recints, {foreignKey: "recint_id", as: "recint", onDelete: "SET NULL"});

export { Dinos, Incident, Recints };
