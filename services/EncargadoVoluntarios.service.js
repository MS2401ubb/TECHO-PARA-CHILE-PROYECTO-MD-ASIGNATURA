const ESTADO_POSTULANTE = 'Postulante';
const ESTADO_VOLUNTARIO_ACTIVO = 'Voluntario Activo';

function obtenerRepositorios(manager) {
  return {
    voluntarioRepository: manager.getRepository('Voluntario'),
    cuadrillaRepository: manager.getRepository('Cuadrilla'),
    participacionRepository: manager.getRepository('VoluntarioParticipaEnCuadrilla'),
    trabajoViviendaRepository: manager.getRepository('CuadrillaTrabajaEnVivienda'),
  };
}

function asegurarDataSource(dataSource) {
  if (!dataSource) {
    const error = new Error('No existe una conexion a la base de datos configurada en app.locals.dataSource.');
    error.statusCode = 500;
    throw error;
  }
}

function validarCamposObligatorios(voluntario) {
  const usuario = voluntario.usuario;
  const camposFaltantes = [];

  if (!usuario?.rut) camposFaltantes.push('rut');
  if (!usuario?.nombre) camposFaltantes.push('nombre');
  if (!usuario?.primerApellido) camposFaltantes.push('primerApellido');
  if (!usuario?.fechaNacimiento) camposFaltantes.push('fechaNacimiento');
  if (!usuario?.email) camposFaltantes.push('email');
  if (!usuario?.telefono) camposFaltantes.push('telefono');
  if (!voluntario.tipo) camposFaltantes.push('tipo');
  if (!voluntario.telefonoEmergencia) camposFaltantes.push('telefonoEmergencia');

  return camposFaltantes;
}

async function buscarVoluntarioPorRut(voluntarioRepository, rut) {
  return voluntarioRepository.findOne({
    where: { rutUsuario: rut },
    relations: ['usuario'],
  });
}

async function obtenerCuadrillaManual(cuadrillaRepository, codigoCuadrilla) {
  const cuadrilla = await cuadrillaRepository.findOne({ where: { codigo: codigoCuadrilla } });

  if (!cuadrilla) {
    const error = new Error('La cuadrilla indicada no existe.');
    error.statusCode = 404;
    throw error;
  }

  return cuadrilla;
}

function prioridadVivienda(trabajo) {
  const estado = trabajo.vivienda?.estado?.toLowerCase() || '';
  const porcentajeAvance = trabajo.vivienda?.porcentajeAvance ?? 100;

  if (estado.includes('urgente')) return 0;
  if (estado.includes('pendiente')) return 1;
  if (estado.includes('en proceso')) return 2;

  return 3 + porcentajeAvance / 100;
}

async function obtenerCuadrillaAutomatica(cuadrillaRepository, trabajoViviendaRepository) {
  const trabajosActivos = await trabajoViviendaRepository.find({
    where: { fechaFin: null },
    relations: ['cuadrilla', 'vivienda'],
  });

  const trabajoPrioritario = trabajosActivos
    .filter((trabajo) => trabajo.cuadrilla)
    .sort((a, b) => prioridadVivienda(a) - prioridadVivienda(b))[0];

  if (trabajoPrioritario?.cuadrilla) {
    return trabajoPrioritario.cuadrilla;
  }

  const cuadrilla = await cuadrillaRepository.findOne();

  if (!cuadrilla) {
    const error = new Error('No existen cuadrillas disponibles para asignar al voluntario.');
    error.statusCode = 409;
    throw error;
  }

  return cuadrilla;
}

async function listarPorEstado(dataSource, estado) {
  asegurarDataSource(dataSource);
  const voluntarioRepository = dataSource.getRepository('Voluntario');

  return voluntarioRepository.find({
    where: { estado },
    relations: ['usuario'],
  });
}

export async function obtenerListaPostulantes(dataSource) {
  return listarPorEstado(dataSource, ESTADO_POSTULANTE);
}

export async function obtenerListaVoluntarios(dataSource) {
  return listarPorEstado(dataSource, ESTADO_VOLUNTARIO_ACTIVO);
}

export async function obtenerPostulante(dataSource, rut) {
  asegurarDataSource(dataSource);
  const voluntario = await buscarVoluntarioPorRut(dataSource.getRepository('Voluntario'), rut);

  if (!voluntario || voluntario.estado !== ESTADO_POSTULANTE) {
    const error = new Error('No se encontro un postulante con el RUT indicado.');
    error.statusCode = 404;
    throw error;
  }

  return voluntario;
}

export async function obtenerVoluntario(dataSource, rut) {
  asegurarDataSource(dataSource);
  const voluntario = await buscarVoluntarioPorRut(dataSource.getRepository('Voluntario'), rut);

  if (!voluntario || voluntario.estado !== ESTADO_VOLUNTARIO_ACTIVO) {
    const error = new Error('No se encontro un voluntario activo con el RUT indicado.');
    error.statusCode = 404;
    throw error;
  }

  return voluntario;
}

export async function aprobarPostulante(dataSource, rut, datosAprobacion) {
  asegurarDataSource(dataSource);

  return dataSource.transaction(async (manager) => {
    const {
      voluntarioRepository,
      cuadrillaRepository,
      participacionRepository,
      trabajoViviendaRepository,
    } = obtenerRepositorios(manager);

    const voluntario = await buscarVoluntarioPorRut(voluntarioRepository, rut);

    if (!voluntario) {
      const error = new Error('No se encontro un voluntario con el RUT indicado.');
      error.statusCode = 404;
      throw error;
    }

    if (voluntario.estado !== ESTADO_POSTULANTE) {
      const error = new Error('Solo se puede aprobar un voluntario en estado Postulante.');
      error.statusCode = 409;
      throw error;
    }

    const camposFaltantes = validarCamposObligatorios(voluntario);

    if (camposFaltantes.length > 0) {
      const error = new Error('El postulante tiene campos obligatorios sin verificar.');
      error.statusCode = 400;
      error.details = { camposFaltantes };
      throw error;
    }

    const cuadrilla = datosAprobacion.asignacionAutomatica
      ? await obtenerCuadrillaAutomatica(cuadrillaRepository, trabajoViviendaRepository)
      : await obtenerCuadrillaManual(cuadrillaRepository, datosAprobacion.codigoCuadrilla);

    const hoy = new Date().toISOString().slice(0, 10);

    voluntario.estado = ESTADO_VOLUNTARIO_ACTIVO;
    voluntario.solicitudActiva = true;
    voluntario.fechaValidacionDatos = hoy;
    voluntario.fechaActivacionSolicitud = hoy;

    await voluntarioRepository.save(voluntario);
    await participacionRepository.save({
      rutVoluntario: voluntario.rutUsuario,
      codigoCuadrilla: cuadrilla.codigo,
      fechaInicio: hoy,
      fechaFin: null,
    });

    return {
      voluntario,
      cuadrillaAsignada: cuadrilla,
      asignacionAutomatica: datosAprobacion.asignacionAutomatica,
    };
  });
}
