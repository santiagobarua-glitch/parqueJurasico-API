import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../db/connection.js";

export class Recints extends Model<InferAttributes<Recints>, InferCreationAttributes<Recints>> {
  declare recint_id: CreationOptional<number>;
  declare security: string;
  declare capacity: number;
  declare status: number;
  declare available: CreationOptional<boolean>;
}

Recints.init(
  {
    recint_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    security: { type: DataTypes.STRING(200), allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.INTEGER, allowNull: false },
    available: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { sequelize, tableName: "recints", timestamps: false }
);