import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../db/connection.js";
import { Dinos } from "./Dinos.js";

export class Incident extends Model<InferAttributes<Incident>, InferCreationAttributes<Incident>> {
  declare incident_id: CreationOptional<number>;
  declare date_time: string;
  declare description: string;
  declare dino_id: number;
  declare recint_id: number;
}

Incident.init(
  {
    incident_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    date_time: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.STRING(200), allowNull: false },
    dino_id: { type: DataTypes.INTEGER, allowNull: true },
    recint_id: { type: DataTypes.INTEGER, allowNull: true },
  },
  { sequelize, tableName: "incidents", timestamps: false }
);