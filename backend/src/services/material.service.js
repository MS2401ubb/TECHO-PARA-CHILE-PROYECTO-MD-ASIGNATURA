import { AppDataSource } from "../config/configDb.js";
import Material from "../entities/material.entity.js";

// ALL
export async function getMaterialesService() {
  const materialRepository = AppDataSource.getRepository(Material);
  return await materialRepository.find();
}
// ESPECIFICO
export async function getMaterialByCodigoService(codigo) {
  const materialRepository = AppDataSource.getRepository(Material);
  const material = await materialRepository.findOne({
    where: { codigo },
  });

  if (!material) {
    throw new Error("Material no encontrado");
  }

  return material;
}

// EDITAR ESPECIFICO
export async function editMaterialService(codigo, data) {
  const materialRepository = AppDataSource.getRepository(Material);
  const { nombre, tipo, stock_digital } = data;
  const material = await materialRepository.findOne({
    where: { codigo },
  });

  if (!material) {
    throw new Error("Material no encontrado");
  }

  if (nombre) material.nombre = nombre;
  if (tipo) material.tipo = tipo;
  if (stock_digital) material.stock_digital = stock_digital;

  const updatedMaterial = await materialRepository.save(material);

  return updatedMaterial;
}

// ELIMINAR ESPECIFICO
export async function deleteMaterialService(codigo) {
  const materialRepository = AppDataSource.getRepository(Material);
  const material = await materialRepository.findOne({ where: { codigo } });

  if (!material) return false;

  await materialRepository.remove(material);
  return true;
}