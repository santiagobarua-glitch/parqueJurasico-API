import {Op} from "sequelize"
import {Dinos} from "../models/Dinos"

interface DinoFilters{
    species?: string
    name?: string
    recint_id?: number
    page: number
    limit: number
}

export const DinoRepository = {
    async findAll(filters: DinoFilters){
        const {species, name, recint_id, page, limit} = filters

    const where: {
      specie?: object | string;
      name?: object | string;
      recint_id?: number;
    } = {};

    if(species){
        where.specie = {[Op.iLike]: `%${species}%`}
    }
    if(name){
        where.name = {[Op.iLike]: `%${name}%`}
    }
    if (recint_id !== undefined) {
      where.recint_id = recint_id;
    }
const result = await Dinos.findAndCountAll({
    where, limit, 
    offset: (page - 1) * limit,
    order: [["dino_id", "ASC"]]
});

return{
    data: result.rows.map((dino)=> ({
        dino_id: dino.dino_id,
        species: dino.specie,
        name: dino.name,
        recint: dino.recint_id

    })),
    pagination: {
        page, limit, total: result.count, totalPages: Math.ceil(result.count / limit )
         }
       }
     },

async findById(id: number){
    const dino = await Dinos.findByPk(id);
    if(!dino) return null; 
    return{
        dino_id: dino.dino_id,
        species:  dino.specie,
        name: dino.name,
        recint: dino.recint_id 
        }
    },
async create( data: {
    species: string,
    name: string,
    recint_id: number
}){
    const dino = await Dinos.create({
      specie: data.species,
      name: data.name,
      recint_id: data.recint_id,
    });
    return{
        dino_id: dino.dino_id,
        species: dino.specie,
        name: dino.name,
        recint: dino.recint_id
    }
},
async update(
   id: number,
    data: {species?: string, name?: string, recint_id?: number}
){
    const dino = await Dinos.findByPk(id);

    if (!dino) return null;

    if (data.species !== undefined) dino.specie = data.species;
    if (data.name !== undefined) dino.name = data.name;
    if (data.recint_id !== undefined) dino.recint_id = data.recint_id;

    await dino.save();

    return {
      dino_id: dino.dino_id,
      species: dino.specie,
      name: dino.name,
      recint_id: dino.recint_id,
    };
  },
async delete(id: number){
    const dino = await Dinos.findByPk(id);

    if (!dino) return false;
    await dino.destroy();
    return true;
    }
};