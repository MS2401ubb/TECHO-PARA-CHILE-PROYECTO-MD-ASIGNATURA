import { AppDataSource } from "../config/configDb.js";
import Cuadrilla from "../entities/cuadrilla.entity.js";


// ALL
export async function getCuadrillasService() {
  const cuadrillaRepository = AppDataSource.getRepository(Cuadrilla);
  return await cuadrillaRepository.find();
}

// ESPECIFICO
export async function getCuadrillaByCodigoService(codigo) {
  const cuadrillaRepository = AppDataSource.getRepository(Cuadrilla);
  const cuadrilla = await cuadrillaRepository.findOne({
    where: { codigo },
  });

  if (!cuadrilla) {
    throw new Error("Cuadrilla no encontrada");
  }

  return cuadrilla;
}

// EDITAR ESPECIFICO
export async function editCuadrillaService(codigo, data) {
  const cuadrillaRepository = AppDataSource.getRepository(Cuadrilla);
  const { descripcion } = data;
  const cuadrilla = await cuadrillaRepository.findOne({
    where: { codigo },
  });

  if (!cuadrilla) {
    throw new Error("Cuadrilla no encontrada");
  }

  if (descripcion) cuadrilla.descripcion = descripcion;

  const updatedCuadrilla = await cuadrillaRepository.save(cuadrilla);

  return updatedCuadrilla;
}

// ELIMINAR ESPECIFICO
export async function deleteCuadrillaService(codigo) {
  const cuadrillaRepository = AppDataSource.getRepository(Cuadrilla);
  const cuadrilla = await cuadrillaRepository.findOne({ where: { codigo } });

  if (!cuadrilla) return false;

  await cuadrillaRepository.remove(cuadrilla);
  return true;
}