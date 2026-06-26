import { AppDataSource } from "../config/configDb.js";
import Vivienda from "../entities/vivienda.entity.js";

// ALL
export async function getViviendasService() {
  const viviendaRepository = AppDataSource.getRepository(Vivienda);
  return await viviendaRepository.find();
}
// ESPECIFICO
export async function getViviendaByCodigoService(codigo) {
  const viviendaRepository = AppDataSource.getRepository(Vivienda);
  const vivienda = await viviendaRepository.findOne({
    where: { codigo },
  });

  if (!vivienda) {
    throw new Error("Vivienda no encontrada");
  }

  return vivienda;
}

// EDITAR ESPECIFICO
export async function editViviendaService(codigo, data) {
  const viviendaRepository = AppDataSource.getRepository(Vivienda);
  const { direccion, tipoObra, estado, porcentajeAvance, fechaInicioEstimada, fechaFinEstimada, fechaFinReal, montajeEstructural, habilidadTecnica, conexionesBasicas, observacionesValidacion, codigoCiudad } = data;
  const vivienda = await viviendaRepository.findOne({
    where: { codigo },
  });

  if (!vivienda) {
    throw new Error("Vivienda no encontrada");
  }

  if (direccion) vivienda.direccion = direccion;
  if (tipoObra) vivienda.tipoObra = tipoObra;
  if (estado) vivienda.estado = estado;
  if (porcentajeAvance) vivienda.porcentajeAvance = porcentajeAvance;
  if (fechaInicioEstimada) vivienda.fechaInicioEstimada = fechaInicioEstimada;
  if (fechaFinEstimada) vivienda.fechaFinEstimada = fechaFinEstimada;
  if (fechaFinReal) vivienda.fechaFinReal = fechaFinReal;
  if (montajeEstructural) vivienda.montajeEstructural = montajeEstructural;
  if (habilidadTecnica) vivienda.habilidadTecnica = habilidadTecnica;
  if (conexionesBasicas) vivienda.conexionesBasicas = conexionesBasicas;
  if (observacionesValidacion) vivienda.observacionesValidacion = observacionesValidacion;
  if (codigoCiudad) vivienda.codigoCiudad = codigoCiudad;
  

  const updatedVivienda = await viviendaRepository.save(vivienda);

  return updatedVivienda;
}

// ELIMINAR ESPECIFICO
export async function deleteViviendaService(codigo) {
  const viviendaRepository = AppDataSource.getRepository(Vivienda);
  const vivienda = await viviendaRepository.findOne({ where: { codigo } });

  if (!vivienda) return false;

  await viviendaRepository.remove(vivienda);
  return true;
}