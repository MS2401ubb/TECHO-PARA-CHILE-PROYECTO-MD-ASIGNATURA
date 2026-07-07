import { AppDataSource } from "../config/configDb.js";
import Vivienda from "../entities/vivienda.entity.js";
import { IsNull } from "typeorm";

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

// FINALIZAR VIVIENDA
export async function finalizarViviendaService(codigoVivienda, rutSolicitante, rolSolicitante) {
  const viviendaRepository = AppDataSource.getRepository(Vivienda);
  const jornadaRepository = AppDataSource.getRepository("Jornada");
  const asignacionRepository = AppDataSource.getRepository("CuadrillaTrabajaEnVivienda");

  const vivienda = await viviendaRepository.findOne({ where: { codigo: codigoVivienda } });

  if (!vivienda) {
    throw new Error("Vivienda no encontrada");
  }

  if (vivienda.estado === "Finalizada") {
    throw new Error("La vivienda ya se encuentra finalizada.");
  }

  const jornadas = await jornadaRepository.find({
    where: { vivienda: { codigo: codigoVivienda } },
    relations: { jefeCuadrilla: true },
    order: { fecha: "ASC" },
  });

  if (jornadas.length === 0) {
    throw new Error("No se puede finalizar la vivienda porque no tiene jornadas asociadas.");
  }

  if (rolSolicitante === "Jefe de Cuadrilla") {
    const jefeParticipa = jornadas.some((jornada) => jornada.jefeCuadrilla?.rutUsuario === rutSolicitante);

    if (!jefeParticipa) {
      throw new Error("El jefe no tiene jornadas asociadas a esta vivienda y no puede finalizarla.");
    }
  }

  const jornadasNoFinalizadas = jornadas.filter((jornada) => jornada.estado !== "Finalizada");

  if (jornadasNoFinalizadas.length > 0) {
    throw new Error(
      `No se puede finalizar la vivienda. Hay ${jornadasNoFinalizadas.length} jornada(s) aún no finalizada(s).`
    );
  }

  const asignacionesActivas = await asignacionRepository.count({
    where: {
      codigoVivienda: codigoVivienda,
      fechaFin: IsNull(),
    },
  });

  if (asignacionesActivas > 0) {
    throw new Error("No se puede finalizar la vivienda porque aún tiene cuadrillas activas asignadas.");
  }

  vivienda.estado = "Finalizada";
  vivienda.fechaFinReal = new Date();
  vivienda.porcentajeAvance = 100;

  const viviendaFinalizada = await viviendaRepository.save(vivienda);

  return {
    codigoVivienda: viviendaFinalizada.codigo,
    estado: viviendaFinalizada.estado,
    fechaFinReal: viviendaFinalizada.fechaFinReal,
    totalJornadas: jornadas.length,
    jornadasFinalizadas: jornadas.length,
    mensaje: "Vivienda finalizada exitosamente.",
  };
}