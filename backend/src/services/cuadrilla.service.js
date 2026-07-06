import { AppDataSource } from "../config/configDb.js";
import Cuadrilla from "../entities/cuadrilla.entity.js";
import Voluntario from "../entities/voluntario.entity.js";
import VoluntarioParticipaEnCuadrilla from "../entities/voluntarioParticipaEnCuadrilla.entity.js";
import JefeCuadrilla from "../entities/jefeCuadrilla.entity.js";
import JefeCuadrillaLideraCuadrilla from "../entities/jefeCuadrillaLideraCuadrilla.entity.js";
import CuadrillaTrabajaEnVivienda from "../entities/cuadrillaTrabajaEnVivienda.entity.js";
import { IsNull } from "typeorm";


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

// ASIGNAR VOLUNTARIO A CUADRILLA
export async function asignarVoluntarioACuadrillaService(rutVoluntario, codigoCuadrilla, fechaInicio) {
  const codigoCuadrillaNumero = Number(codigoCuadrilla);
  const fechaInicioAsignacion = fechaInicio ? new Date(fechaInicio) : new Date();

  if (!Number.isInteger(codigoCuadrillaNumero) || codigoCuadrillaNumero <= 0) {
    throw new Error("El codigo de cuadrilla debe ser un número entero positivo.");
  }

  if (Number.isNaN(fechaInicioAsignacion.getTime())) {
    throw new Error("La fechaInicio es inválida.");
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const voluntarioRepository = queryRunner.manager.getRepository(Voluntario);
    const cuadrillaRepository = queryRunner.manager.getRepository(Cuadrilla);
    const participacionRepository = queryRunner.manager.getRepository(VoluntarioParticipaEnCuadrilla);

    const voluntario = await voluntarioRepository.findOne({
      where: { usuario: { rut: rutVoluntario } },
    });

    if (!voluntario) {
      throw new Error("Voluntario no encontrado.");
    }

    if (voluntario.estado !== "Activo") {
      throw new Error(`Solo se pueden asignar voluntarios Activos. Este está en estado ${voluntario.estado}.`);
    }

    const cuadrilla = await cuadrillaRepository.findOne({
      where: { codigo: codigoCuadrillaNumero },
    });

    if (!cuadrilla) {
      throw new Error("Cuadrilla no encontrada.");
    }

    const asignacionActiva = await participacionRepository.findOne({
      where: {
        rutVoluntario: voluntario.rutUsuario,
        fechaFin: IsNull(),
      },
    });

    if (asignacionActiva) {
      throw new Error("El voluntario ya está asignado a otra cuadrilla.");
    }

    const nuevaAsignacion = participacionRepository.create({
      rutVoluntario: voluntario.rutUsuario,
      codigoCuadrilla: codigoCuadrillaNumero,
      fechaInicio: fechaInicioAsignacion,
      fechaFin: null,
      voluntario: { rutUsuario: voluntario.rutUsuario },
      cuadrilla: { codigo: codigoCuadrillaNumero },
    });

    await participacionRepository.save(nuevaAsignacion);
    await queryRunner.commitTransaction();

    return {
      rutVoluntario: voluntario.rutUsuario,
      codigoCuadrilla: codigoCuadrillaNumero,
      fechaInicio: nuevaAsignacion.fechaInicio,
      estadoVoluntario: voluntario.estado,
    };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

// ASIGNAR JEFE DE CUADRILLA A CUADRILLA
export async function asignarJefeCuadrillaACuadrillaService(rutJefeCuadrilla, codigoCuadrilla, fechaInicio) {
  const codigoCuadrillaNumero = Number(codigoCuadrilla);
  const fechaInicioAsignacion = fechaInicio ? new Date(fechaInicio) : new Date();

  if (!Number.isInteger(codigoCuadrillaNumero) || codigoCuadrillaNumero <= 0) {
    throw new Error("El codigo de cuadrilla debe ser un número entero positivo.");
  }

  if (Number.isNaN(fechaInicioAsignacion.getTime())) {
    throw new Error("La fechaInicio es inválida.");
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const jefeCuadrillaRepository = queryRunner.manager.getRepository(JefeCuadrilla);
    const cuadrillaRepository = queryRunner.manager.getRepository(Cuadrilla);
    const liderazgoRepository = queryRunner.manager.getRepository(JefeCuadrillaLideraCuadrilla);

    const jefeCuadrilla = await jefeCuadrillaRepository.findOne({
      where: { rutUsuario: rutJefeCuadrilla },
    });

    if (!jefeCuadrilla) {
      throw new Error("Jefe de Cuadrilla no encontrado.");
    }

    const cuadrilla = await cuadrillaRepository.findOne({
      where: { codigo: codigoCuadrillaNumero },
    });

    if (!cuadrilla) {
      throw new Error("Cuadrilla no encontrada.");
    }

    const liderazgoActivoJefe = await liderazgoRepository.findOne({
      where: {
        rutJefeCuadrilla,
        fechaFin: IsNull(),
      },
    });

    if (liderazgoActivoJefe) {
      throw new Error("El jefe ya lidera una cuadrilla activa.");
    }

    const liderazgoActivoCuadrilla = await liderazgoRepository.findOne({
      where: {
        codigoCuadrilla: codigoCuadrillaNumero,
        fechaFin: IsNull(),
      },
    });

    if (liderazgoActivoCuadrilla) {
      throw new Error("La cuadrilla ya tiene un jefe activo asignado.");
    }

    const nuevaAsignacion = liderazgoRepository.create({
      rutJefeCuadrilla,
      codigoCuadrilla: codigoCuadrillaNumero,
      fechaInicio: fechaInicioAsignacion,
      fechaFin: null,
      jefeCuadrilla: { rutUsuario: rutJefeCuadrilla },
      cuadrilla: { codigo: codigoCuadrillaNumero },
    });

    await liderazgoRepository.save(nuevaAsignacion);
    await queryRunner.commitTransaction();

    return {
      rutJefeCuadrilla,
      codigoCuadrilla: codigoCuadrillaNumero,
      fechaInicio: nuevaAsignacion.fechaInicio,
    };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

// OBTENER VOLUNTARIOS RELACIONADOS A UNA CUADRILLA
export async function getVoluntariosCuadrilla(codigoCuadrilla) {
  const codigoCuadrillaNumero = Number(codigoCuadrilla);

  if (!Number.isInteger(codigoCuadrillaNumero) || codigoCuadrillaNumero <= 0) {
    throw new Error("El codigo de cuadrilla debe ser un número entero positivo.");
  }

  const cuadrillaRepository = AppDataSource.getRepository(Cuadrilla);
  const participacionRepository = AppDataSource.getRepository(VoluntarioParticipaEnCuadrilla);

  const cuadrilla = await cuadrillaRepository.findOne({
    where: { codigo: codigoCuadrillaNumero },
  });

  if (!cuadrilla) {
    throw new Error("Cuadrilla no encontrada.");
  }

  const participaciones = await participacionRepository.find({
    where: { codigoCuadrilla: codigoCuadrillaNumero },
    relations: {
      voluntario: {
        usuario: true,
      },
    },
    order: {
      fechaInicio: "ASC",
    },
  });

  const voluntarios = participaciones.map((participacion) => ({
    rut: participacion.rutVoluntario,
    estadoAsignacion: participacion.fechaFin ? "FINALIZADA" : "ACTIVA",
    fechaInicio: participacion.fechaInicio,
    fechaFin: participacion.fechaFin,
    datosVoluntario: {
      estado: participacion.voluntario?.estado || null,
      telefonoEmergencia: participacion.voluntario?.telefonoEmergencia || null,
    },
    datosUsuario: {
      nombre: participacion.voluntario?.usuario?.nombre || null,
      primerApellido: participacion.voluntario?.usuario?.primerApellido || null,
      segundoApellido: participacion.voluntario?.usuario?.segundoApellido || null,
      email: participacion.voluntario?.usuario?.email || null,
      telefono: participacion.voluntario?.usuario?.telefono || null,
    },
  }));

  const totalVoluntariosActivos = participaciones.filter((participacion) => !participacion.fechaFin).length;

  return {
    codigoCuadrilla: codigoCuadrillaNumero,
    descripcionCuadrilla: cuadrilla.descripcion,
    totalVoluntarios: participaciones.length,
    totalVoluntariosActivos,
    voluntarios,
  };
}

export async function getMiCuadrillaYViviendaService(rutUsuario, rolUsuario) {
  const participacionRepository = AppDataSource.getRepository(VoluntarioParticipaEnCuadrilla);
  const liderazgoRepository = AppDataSource.getRepository(JefeCuadrillaLideraCuadrilla);
  const despliegueRepository = AppDataSource.getRepository(CuadrillaTrabajaEnVivienda);

  let codigoCuadrilla = null;

  if (rolUsuario === "Voluntario") {
    const participacionActiva = await participacionRepository.findOne({
      where: {
        rutVoluntario: rutUsuario,
        fechaFin: IsNull(),
      },
      order: {
        fechaInicio: "DESC",
      },
    });

    if (!participacionActiva) {
      throw new Error("No tienes una cuadrilla activa asignada.");
    }

    codigoCuadrilla = participacionActiva.codigoCuadrilla;
  } else if (rolUsuario === "Jefe de Cuadrilla") {
    const liderazgoActivo = await liderazgoRepository.findOne({
      where: {
        rutJefeCuadrilla: rutUsuario,
        fechaFin: IsNull(),
      },
      order: {
        fechaInicio: "DESC",
      },
    });

    if (!liderazgoActivo) {
      throw new Error("No lideras una cuadrilla activa.");
    }

    codigoCuadrilla = liderazgoActivo.codigoCuadrilla;
  } else {
    throw new Error("Esta vista solo está disponible para Voluntario y Jefe de Cuadrilla.");
  }

  const participacionesActivas = await participacionRepository.find({
    where: {
      codigoCuadrilla,
      fechaFin: IsNull(),
    },
    relations: {
      voluntario: {
        usuario: true,
      },
    },
    order: {
      fechaInicio: "ASC",
    },
  });

  const liderazgoActivoCuadrilla = await liderazgoRepository.findOne({
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

  const despliegueActivo = await despliegueRepository.findOne({
    where: {
      codigoCuadrilla,
      fechaFin: IsNull(),
    },
    relations: {
      vivienda: {
        ciudad: {
          region: true,
        },
      },
    },
    order: {
      fechaInicio: "DESC",
    },
  });

  const integrantes = participacionesActivas.map((participacion) => ({
    rut: participacion.rutVoluntario,
    nombre: participacion.voluntario?.usuario?.nombre || "",
    primerApellido: participacion.voluntario?.usuario?.primerApellido || "",
    segundoApellido: participacion.voluntario?.usuario?.segundoApellido || "",
    rol: "Voluntario",
  }));

  if (liderazgoActivoCuadrilla?.jefeCuadrilla?.usuario) {
    integrantes.unshift({
      rut: liderazgoActivoCuadrilla.rutJefeCuadrilla,
      nombre: liderazgoActivoCuadrilla.jefeCuadrilla.usuario.nombre || "",
      primerApellido: liderazgoActivoCuadrilla.jefeCuadrilla.usuario.primerApellido || "",
      segundoApellido: liderazgoActivoCuadrilla.jefeCuadrilla.usuario.segundoApellido || "",
      rol: "Jefe de Cuadrilla",
    });
  }

  const vivienda = despliegueActivo?.vivienda
    ? {
        codigo: despliegueActivo.vivienda.codigo,
        direccion: despliegueActivo.vivienda.direccion,
        ciudad: despliegueActivo.vivienda.ciudad?.nombre || null,
        region: despliegueActivo.vivienda.ciudad?.region?.nombre || null,
        fechaInicioEstimada: despliegueActivo.vivienda.fechaInicioEstimada,
        fechaFinEstimada: despliegueActivo.vivienda.fechaFinEstimada,
      }
    : null;

  return {
    codigoCuadrilla,
    integrantes,
    vivienda,
  };
}