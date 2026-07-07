import { AppDataSource } from "../config/configDb.js";
import Vivienda from "../entities/vivienda.entity.js";
import CuadrillaTrabajaEnVivienda from "../entities/cuadrillaTrabajaEnVivienda.entity.js";
import VoluntarioParticipaEnCuadrilla from "../entities/voluntarioParticipaEnCuadrilla.entity.js";
import JefeCuadrillaLideraCuadrilla from "../entities/jefeCuadrillaLideraCuadrilla.entity.js";
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

export async function getViviendasPlanificablesService() {
  const viviendaRepository = AppDataSource.getRepository(Vivienda);
  const cuadrillaTrabajaRepository = AppDataSource.getRepository(CuadrillaTrabajaEnVivienda);
  const participacionRepository = AppDataSource.getRepository(VoluntarioParticipaEnCuadrilla);
  const jefeLideraRepository = AppDataSource.getRepository(JefeCuadrillaLideraCuadrilla);

  const viviendas = await viviendaRepository.find({
    where: [
      { estado: "Planificacion" },
      { estado: "Planificación" },
    ],
    relations: {
      ciudad: {
        region: true,
      },
    },
    order: {
      fechaInicioEstimada: "ASC",
    },
  });

  const planificables = [];

  for (const vivienda of viviendas) {
    const asignacionesActivas = await cuadrillaTrabajaRepository.find({
      where: {
        codigoVivienda: vivienda.codigo,
        fechaFin: IsNull(),
      },
      order: {
        fechaInicio: "ASC",
      },
    });

    const cuadrillasValidas = [];
    const personasUnicas = new Map();

    for (const asignacion of asignacionesActivas) {
      const codigoCuadrilla = asignacion.codigoCuadrilla;

      const voluntariosActivos = await participacionRepository.find({
        where: {
          codigoCuadrilla,
          fechaFin: IsNull(),
        },
        relations: {
          voluntario: {
            usuario: true,
          },
        },
      });

      const jefeActivo = await jefeLideraRepository.findOne({
        where: {
          codigoCuadrilla,
          fechaFin: IsNull(),
        },
        relations: {
          jefeCuadrilla: {
            usuario: true,
          },
        },
        order: {
          fechaInicio: "DESC",
        },
      });

      if (voluntariosActivos.length === 0 || !jefeActivo?.jefeCuadrilla?.usuario) {
        continue;
      }

      const personasCuadrilla = [];

      const jefeUsuario = jefeActivo.jefeCuadrilla.usuario;
      const personaJefe = {
        rut: jefeUsuario.rut,
        nombre: jefeUsuario.nombre,
        primerApellido: jefeUsuario.primerApellido,
        segundoApellido: jefeUsuario.segundoApellido,
      };
      personasCuadrilla.push(personaJefe);
      personasUnicas.set(personaJefe.rut, personaJefe);

      for (const participacion of voluntariosActivos) {
        const usuario = participacion.voluntario?.usuario;
        if (!usuario) continue;
        const persona = {
          rut: usuario.rut,
          nombre: usuario.nombre,
          primerApellido: usuario.primerApellido,
          segundoApellido: usuario.segundoApellido,
        };
        personasCuadrilla.push(persona);
        personasUnicas.set(persona.rut, persona);
      }

      cuadrillasValidas.push({
        codigoCuadrilla,
        personas: personasCuadrilla,
      });
    }

    if (cuadrillasValidas.length === 0) {
      continue;
    }

    planificables.push({
      codigoVivienda: vivienda.codigo,
      direccion: vivienda.direccion,
      ciudad: vivienda.ciudad?.nombre || null,
      region: vivienda.ciudad?.region?.nombre || null,
      fechaInicioEstimada: vivienda.fechaInicioEstimada,
      fechaFinEstimada: vivienda.fechaFinEstimada,
      cuadrillas: cuadrillasValidas,
      personasAsignadas: Array.from(personasUnicas.values()),
    });
  }

  return planificables;
}