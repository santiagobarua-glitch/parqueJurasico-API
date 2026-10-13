import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { sequelize } from "../db/connection.js";

export class Dinos extends Model<InferAttributes<Dinos>, InferCreationAttributes<Dinos>> {
  declare dino_id: CreationOptional<number>;
  declare specie: string;
  declare name: string;
  declare recint_id: number;
  declare available: CreationOptional<boolean>;
}

Dinos.init(
  {
    dino_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    specie: { type: DataTypes.STRING(200), allowNull: false },
    name: { type: DataTypes.STRING(200), allowNull: false },
    recint_id: { type: DataTypes.INTEGER, allowNull: false },
    available: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { sequelize, tableName: "dinos", timestamps: false }
);