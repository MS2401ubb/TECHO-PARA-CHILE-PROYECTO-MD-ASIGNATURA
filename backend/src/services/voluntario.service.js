import { AppDataSource } from "../config/configDb.js";
import Cuadrilla from "../entities/cuadrilla.entity.js";
import CuadrillaTrabajaEnVivienda from "../entities/cuadrillaTrabajaEnVivienda.entity.js";
import Voluntario from "../entities/voluntario.entity.js";
import VoluntarioParticipaEnCuadrilla from "../entities/voluntarioParticipaEnCuadrilla.entity.js";
import { IsNull } from "typeorm";

const ESTADOS_VOLUNTARIO = ['Postulante', 'Activo', 'Rechazado', 'Inactivo'];
const CAMPOS_OBLIGATORIOS_POSTULANTE = [
  ['usuario.rut', (voluntario) => voluntario.usuario?.rut],
  ['usuario.nombre', (voluntario) => voluntario.usuario?.nombre],
  ['usuario.primerApellido', (voluntario) => voluntario.usuario?.primerApellido],
  ['usuario.segundoApellido', (voluntario) => voluntario.usuario?.segundoApellido],
  ['usuario.fechaNacimiento', (voluntario) => voluntario.usuario?.fechaNacimiento],
  ['usuario.email', (voluntario) => voluntario.usuario?.email],
  ['usuario.telefono', (voluntario) => voluntario.usuario?.telefono],
  ['usuario.ciudad', (voluntario) => voluntario.usuario?.ciudad],
  ['voluntario.tipo', (voluntario) => voluntario.tipo],
  ['voluntario.telefonoEmergencia', (voluntario) => voluntario.telefonoEmergencia],
];

function validarCamposObligatoriosPostulante(voluntario) {
  const faltantes = CAMPOS_OBLIGATORIOS_POSTULANTE
    .filter(([, obtenerValor]) => {
      const valor = obtenerValor(voluntario);
      return valor === null || valor === undefined || String(valor).trim() === '';
    })
    .map(([campo]) => campo);

  if (faltantes.length > 0) {
    throw new Error(`No se puede aprobar el postulante. Faltan campos obligatorios: ${faltantes.join(', ')}.`);
  }
}

function normalizarFecha(fecha) {
  const fechaAsignacion = fecha ? new Date(fecha) : new Date();
  if (Number.isNaN(fechaAsignacion.getTime())) {
    throw new Error('La fechaInicio es inválida.');
  }
  return fechaAsignacion;
}

async function obtenerCantidadVoluntariosActivos(participacionRepository, codigoCuadrilla) {
  return participacionRepository.count({
    where: {
      codigoCuadrilla,
      fechaFin: IsNull(),
    },
  });
}

function puntajeNecesidadVivienda(vivienda) {
  const prioridadEstado = {
    'Distribuyendo Fuerza Laboral': 100,
    Planificacion: 70,
    'En Ejecucion': 50,
    'En Ejecución': 50,
  };

  const prioridadBase = prioridadEstado[vivienda?.estado] ?? 20;
  const avance = Number.isInteger(vivienda?.porcentajeAvance) ? vivienda.porcentajeAvance : 0;
  return prioridadBase + Math.max(0, 100 - avance);
}

async function seleccionarCuadrillaAutomatica(manager) {
  const cuadrillaRepository = manager.getRepository(Cuadrilla);
  const despliegueRepository = manager.getRepository(CuadrillaTrabajaEnVivienda);
  const participacionRepository = manager.getRepository(VoluntarioParticipaEnCuadrilla);

  const desplieguesActivos = await despliegueRepository.find({
    where: { fechaFin: IsNull() },
    relations: { cuadrilla: true, vivienda: true },
  });

  if (desplieguesActivos.length > 0) {
    const candidatos = [];

    for (const despliegue of desplieguesActivos) {
      const cantidadVoluntarios = await obtenerCantidadVoluntariosActivos(
        participacionRepository,
        despliegue.codigoCuadrilla,
      );

      candidatos.push({
        codigoCuadrilla: despliegue.codigoCuadrilla,
        codigoVivienda: despliegue.codigoVivienda,
        estadoVivienda: despliegue.vivienda?.estado,
        puntajeNecesidad: puntajeNecesidadVivienda(despliegue.vivienda),
        cantidadVoluntarios,
      });
    }

    candidatos.sort((a, b) => {
      if (b.puntajeNecesidad !== a.puntajeNecesidad) {
        return b.puntajeNecesidad - a.puntajeNecesidad;
      }
      return a.cantidadVoluntarios - b.cantidadVoluntarios;
    });

    return candidatos[0];
  }

  const cuadrillas = await cuadrillaRepository.find();
  if (cuadrillas.length === 0) {
    throw new Error('No existen cuadrillas disponibles para asignar al voluntario.');
  }

  const candidatos = [];
  for (const cuadrilla of cuadrillas) {
    const cantidadVoluntarios = await obtenerCantidadVoluntariosActivos(participacionRepository, cuadrilla.codigo);
    candidatos.push({
      codigoCuadrilla: cuadrilla.codigo,
      codigoVivienda: null,
      estadoVivienda: null,
      puntajeNecesidad: 0,
      cantidadVoluntarios,
    });
  }

  candidatos.sort((a, b) => a.cantidadVoluntarios - b.cantidadVoluntarios);
  return candidatos[0];
}

async function listarPorEstado(estado) {
  const voluntarioRepository = AppDataSource.getRepository(Voluntario);
  return voluntarioRepository.find({
    where: { estado },
    relations: { usuario: true },
  });
}

// GET VOLUNTARIOS POSTULANTES
export async function obtenerListaPostulantes() {
  return listarPorEstado('Postulante');
}

// GET VOLUNTARIOS ACTIVOS
export async function obtenerListaVoluntarios() {
  return listarPorEstado('Activo');
}

// GET VOLUNTARIO POR RUT
export async function obtenerVoluntarioPorRut(rut) {
  const voluntarioRepository = AppDataSource.getRepository(Voluntario);
  const voluntario = await voluntarioRepository.findOne({
    where: { usuario: { rut } },
    relations: { usuario: true },
  });
  if (!voluntario) {
    throw new Error('No se encontro un voluntario con el RUT indicado.');
  }
  return voluntario;
}

// OBTENER VOLUNTARIO CON DETALLES COMPLETOS (nombre, email, teléfono, etc)
export async function obtenerVoluntarioConDetallesCompletos(rut) {
  const voluntarioRepository = AppDataSource.getRepository(Voluntario);
  const voluntario = await voluntarioRepository.findOne({
    where: { usuario: { rut } },
    relations: { usuario: true },
  });
  if (!voluntario) {
    throw new Error('Voluntario no encontrado.');
  }
  return {
    rutVoluntario: voluntario.rutUsuario,
    estado: voluntario.estado,
    tipo: voluntario.tipo,
    solicitudActiva: voluntario.solicitudActiva,
    fechaValidacionDatos: voluntario.fechaValidacionDatos,
    fechaActivacionSolicitud: voluntario.fechaActivacionSolicitud,
    telefonoEmergencia: voluntario.telefonoEmergencia,
    motivoRechazo: voluntario.motivoRechazo,
    usuario: {
      rut: voluntario.usuario.rut,
      nombre: voluntario.usuario.nombre,
      primerApellido: voluntario.usuario.primerApellido,
      segundoApellido: voluntario.usuario.segundoApellido,
      email: voluntario.usuario.email,
      telefono: voluntario.usuario.telefono,
      fechaNacimiento: voluntario.usuario.fechaNacimiento,
    },
  };
}

// APROBAR VOLUNTARIO (cambiar de Postulante a Activo y asignarlo a una cuadrilla)
export async function aprobarVoluntario(rut, rutEncargado, opcionesAsignacion = {}) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const voluntarioRepository = queryRunner.manager.getRepository(Voluntario);
    const usuarioRepository = queryRunner.manager.getRepository('Usuario');
    const cuadrillaRepository = queryRunner.manager.getRepository(Cuadrilla);
    const participacionRepository = queryRunner.manager.getRepository(VoluntarioParticipaEnCuadrilla);

    const voluntario = await voluntarioRepository.findOne({
      where: { usuario: { rut } },
      relations: { usuario: { ciudad: true } },
    });

    if (!voluntario) {
      throw new Error('Voluntario no encontrado.');
    }

    if (voluntario.estado !== 'Postulante') {
      throw new Error(`No se puede aprobar un voluntario en estado ${voluntario.estado}. Solo se pueden aprobar Postulantes.`);
    }

    validarCamposObligatoriosPostulante(voluntario);

    const encargado = await usuarioRepository.findOne({ where: { rut: rutEncargado } });
    if (!encargado) {
      throw new Error('Encargado no encontrado.');
    }

    const tipoAsignacion = opcionesAsignacion.tipoAsignacion || 'automatica';
    const fechaInicioAsignacion = normalizarFecha(opcionesAsignacion.fechaInicio);
    let asignacionSeleccionada;

    if (tipoAsignacion === 'manual') {
      const codigoCuadrillaNumero = Number(opcionesAsignacion.codigoCuadrilla);
      if (!Number.isInteger(codigoCuadrillaNumero) || codigoCuadrillaNumero <= 0) {
        throw new Error('Para asignación manual debe indicar un codigoCuadrilla válido.');
      }

      const cuadrilla = await cuadrillaRepository.findOne({ where: { codigo: codigoCuadrillaNumero } });
      if (!cuadrilla) {
        throw new Error('Cuadrilla no encontrada.');
      }

      asignacionSeleccionada = {
        codigoCuadrilla: codigoCuadrillaNumero,
        codigoVivienda: null,
        estadoVivienda: null,
        puntajeNecesidad: null,
        cantidadVoluntarios: null,
      };
    } else {
      asignacionSeleccionada = await seleccionarCuadrillaAutomatica(queryRunner.manager);
    }

    const asignacionActiva = await participacionRepository.findOne({
      where: {
        rutVoluntario: voluntario.rutUsuario,
        fechaFin: IsNull(),
      },
    });

    if (asignacionActiva) {
      throw new Error('El voluntario ya está asignado a una cuadrilla activa.');
    }

    voluntario.estado = 'Activo';
    voluntario.solicitudActiva = true;
    voluntario.fechaValidacionDatos = new Date();
    voluntario.fechaActivacionSolicitud = new Date();
    voluntario.motivoRechazo = null;

    await voluntarioRepository.save(voluntario);

    const nuevaAsignacion = participacionRepository.create({
      rutVoluntario: voluntario.rutUsuario,
      codigoCuadrilla: asignacionSeleccionada.codigoCuadrilla,
      fechaInicio: fechaInicioAsignacion,
      fechaFin: null,
      voluntario: { rutUsuario: voluntario.rutUsuario },
      cuadrilla: { codigo: asignacionSeleccionada.codigoCuadrilla },
    });

    await participacionRepository.save(nuevaAsignacion);
    await queryRunner.commitTransaction();

    return {
      rutVoluntario: voluntario.rutUsuario,
      estadoAnterior: 'Postulante',
      estadoNuevo: 'Activo',
      fechaAprobacion: voluntario.fechaValidacionDatos,
      solicitudActiva: voluntario.solicitudActiva,
      fechaActivacionSolicitud: voluntario.fechaActivacionSolicitud,
      aprobadoPor: rutEncargado,
      asignacion: {
        tipoAsignacion,
        codigoCuadrilla: nuevaAsignacion.codigoCuadrilla,
        fechaInicio: nuevaAsignacion.fechaInicio,
        codigoViviendaPriorizada: asignacionSeleccionada.codigoVivienda,
        estadoViviendaPriorizada: asignacionSeleccionada.estadoVivienda,
      },
    };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

// RECHAZAR VOLUNTARIO (cambiar de Postulante a Rechazado)
export async function rechazarVoluntario(rut, motivo, rutEncargado) {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const voluntarioRepository = queryRunner.manager.getRepository(Voluntario);
    const usuarioRepository = queryRunner.manager.getRepository('Usuario');

    const voluntario = await voluntarioRepository.findOne({
      where: { usuario: { rut } },
    });

    if (!voluntario) {
      throw new Error('Voluntario no encontrado.');
    }

    if (voluntario.estado !== 'Postulante') {
      throw new Error(`No se puede rechazar un voluntario en estado ${voluntario.estado}. Solo se pueden rechazar Postulantes.`);
    }

    const encargado = await usuarioRepository.findOne({ where: { rut: rutEncargado } });
    if (!encargado) {
      throw new Error('Encargado no encontrado.');
    }

    voluntario.estado = 'Rechazado';
    voluntario.solicitudActiva = false;
    voluntario.motivoRechazo = motivo?.trim() || 'Sin especificar';

    await voluntarioRepository.save(voluntario);
    await queryRunner.commitTransaction();

    return {
      rutVoluntario: voluntario.rutUsuario,
      estadoAnterior: 'Postulante',
      estadoNuevo: 'Rechazado',
      motivo: voluntario.motivoRechazo,
      rechazadoPor: rutEncargado,
    };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

// OBTENER VOLUNTARIOS DISPONIBLES POR ZONA (Activos sin asignación activa)
export async function obtenerVoluntariosDisponiblesPorZona(codigoCiudad) {
  const codigoCiudadNumero = Number(codigoCiudad);
  if (!Number.isInteger(codigoCiudadNumero) || codigoCiudadNumero <= 0) {
    throw new Error('El codigoCiudad debe ser un número entero positivo.');
  }

  const voluntarioRepository = AppDataSource.getRepository(Voluntario);
  const participacionRepository = AppDataSource.getRepository(VoluntarioParticipaEnCuadrilla);

  const voluntariosActivos = await voluntarioRepository
    .createQueryBuilder('voluntario')
    .leftJoinAndSelect('voluntario.usuario', 'usuario')
    .leftJoin('usuario.ciudad', 'ciudad')
    .where('voluntario.estado = :estado', { estado: 'Activo' })
    .andWhere('ciudad.codigo = :codigoCiudad', { codigoCiudad: codigoCiudadNumero })
    .getMany();

  const disponibles = [];

  for (const vol of voluntariosActivos) {
    const asignacionActiva = await participacionRepository.findOne({
      where: {
        rutVoluntario: vol.rutUsuario,
        fechaFin: IsNull(),
      },
    });

    if (!asignacionActiva) {
      disponibles.push({
        rutVoluntario: vol.rutUsuario,
        nombre: vol.usuario?.nombre,
        primerApellido: vol.usuario?.primerApellido,
        segundoApellido: vol.usuario?.segundoApellido,
        email: vol.usuario?.email,
        telefono: vol.usuario?.telefono,
        telefonoEmergencia: vol.telefonoEmergencia,
        estado: vol.estado,
        codigoCiudad: codigoCiudadNumero,
      });
    }
  }
  if (disponibles.length === 0) {
    throw new Error('No hay voluntarios disponibles en la ciudad especificada.');
  }

  return disponibles;
}

export { ESTADOS_VOLUNTARIO };
