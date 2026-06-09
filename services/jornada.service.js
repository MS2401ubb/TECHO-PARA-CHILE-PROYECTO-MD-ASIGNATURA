const { AppDataSource } = require('../config/db');
const { IsNull } = require('typeorm');

const finalizarJornadaService = async (idJornada, materialesContados) => {
  // 1. Obtener los repositorios de las entidades necesarias
  const jornadaRepository = AppDataSource.getRepository('Jornada');
  const viviendaRepository = AppDataSource.getRepository('Vivienda');
  const asignacionRepository = AppDataSource.getRepository('CuadrillaTrabajaEnVivienda');
  const inventarioRepository = AppDataSource.getRepository('InventarioJornada');

  // 2. Buscar la jornada actual
  const jornada = await jornadaRepository.findOne({ 
    where: { id: idJornada },
    relations: { vivienda: true }
  });

  if (!jornada) {
    throw new Error('La jornada especificada no existe.');
  }

  if (jornada.estado === 'Finalizada') {
    throw new Error('Esta jornada ya fue finalizada anteriormente.');
  }

  const vivienda = jornada.vivienda;

  // 3. REGLA: Validar que la vivienda cumpla con los requisitos técnicos de tus compañeros
  if (!vivienda.montajeEstructural || !vivienda.habilidadTecnica || !vivienda.conexionesBasicas) {
    throw new Error('No se puede finalizar la jornada: La vivienda no cuenta con la validación técnica requerida.');
  }

  // 4. REGLA: Comparar stock físico ingresado vs digital (Simulación inicial)
  // Aquí más adelante guardaremos en la tabla inventario_jornadas y compararemos
  console.log('Procesando conteo de materiales:', materialesContados);

  // 5. CIERRE ADMINISTRATIVO: Actualizar estado de la jornada
  jornada.estado = 'Finalizada';
  await jornadaRepository.save(jornada);

  // 6. CIERRE ADMINISTRATIVO: Poner fecha fin a la asignación de la cuadrilla
  // Buscamos la asignación activa de la cuadrilla en esa vivienda
  const asignacionActiva = await asignacionRepository.findOne({
    where: { 
      codigoVivienda: jornada.vivienda.codigo,
      fechaFin: IsNull()
    }
  });

  if (asignacionActiva) {
    asignacionActiva.fechaFin = new Date(); // Fecha actual
    await asignacionRepository.save(asignacionActiva);
  }

  return { mensaje: 'Cierre administrativo y técnico completado con éxito.' };
};

module.exports = { finalizarJornadaService };