const { AppDataSource } = require('../config/db');
const { IsNull } = require('typeorm');
const Material = require('../entities/Material');
const InventarioJornada = require('../entities/InventarioJornada');

const finalizarJornadaService = async (idJornada, materialesContados) => {

  const jornadaRepository = AppDataSource.getRepository('Jornada');
  const viviendaRepository = AppDataSource.getRepository('Vivienda');
  const asignacionRepository = AppDataSource.getRepository('CuadrillaTrabajaEnVivienda');
  const materialRepository = AppDataSource.getRepository(Material);
  const inventarioJornadaRepository = AppDataSource.getRepository(InventarioJornada);
  // Buscar la jornada actual
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

  if (!vivienda.montajeEstructural || !vivienda.habilidadTecnica || !vivienda.conexionesBasicas) {
    throw new Error('No se puede finalizar la jornada: La vivienda no cuenta con la validación técnica requerida.');
  }

  const listaMateriales = materialesContados.materiales || materialesContados;
  for (const item of listaMateriales) {

  const materialDB = await materialRepository.findOne({ 
    where: { id: item.id_material } 
  });

  if (!materialDB) {
    throw new Error(`El material con ID ${item.id_material} no existe en la bodega.`);
  }

  if (materialDB.stock_digital < item.cantidad_fisica) {
    throw new Error(`Stock insuficiente para ${materialDB.nombre}. Hay ${materialDB.stock_digital} y reportó ${item.cantidad_fisica}.`);
  }

  const nuevoInventario = inventarioJornadaRepository.create({
    cantidad_fisica: item.cantidad_fisica,
    jornada: { id: jornada.id }, 
    material: { id: materialDB.id } 
  });
  await inventarioJornadaRepository.save(nuevoInventario);

  materialDB.stock_digital = materialDB.stock_digital - item.cantidad_fisica;
  await materialRepository.save(materialDB);
  }
  console.log('Procesando conteo de materiales:', materialesContados);

  jornada.estado = 'Finalizada';
  await jornadaRepository.save(jornada);

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