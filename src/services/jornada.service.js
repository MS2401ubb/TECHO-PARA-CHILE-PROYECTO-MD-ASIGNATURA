const { AppDataSource } = require('../config/db');
const { IsNull } = require('typeorm');
const Material = require('../entities/Material');
const InventarioJornada = require('../entities/InventarioJornada');

const finalizarJornadaService = async (idJornada, materialesContados) => {

   //tablas a trabajar
  const jornadaRepository = AppDataSource.getRepository('Jornada');
  const viviendaRepository = AppDataSource.getRepository('Vivienda');
  const asignacionRepository = AppDataSource.getRepository('CuadrillaTrabajaEnVivienda');
  const materialRepository = AppDataSource.getRepository(Material);
  const inventarioJornadaRepository = AppDataSource.getRepository(InventarioJornada);
  
  // Buscar la jornada actual y trae los datos asociados a esta
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
  //validacione tecnicas
  if (!vivienda.montajeEstructural || !vivienda.habilidadTecnica || !vivienda.conexionesBasicas) {
    throw new Error('No se puede finalizar la jornada: La vivienda no cuenta con la validación técnica requerida.');
  }
  //revisa lista materiales
  const listaMateriales = materialesContados.materiales || materialesContados;
  for (const item of listaMateriales) {

      const materialDB = await materialRepository.findOne({ 
        where: { id: item.id_material } 
  });

    if (!materialDB) {
      throw new Error(`El ítem con ID ${item.id_material} no existe en la bodega.`);
  }

      // --- LA NUEVA MAGIA: SEPARACIÓN DE LÓGICAS ---
    if (materialDB.tipo === 'Material') {
          // REGLA 1: LOS MATERIALES SE CONSUMEN (Madera, Clavos, Zinc)
          // Aquí item.cantidad_fisica es "Lo que gastamos hoy"
    if (materialDB.stock_digital < item.cantidad_fisica) {
    throw new Error(`Stock insuficiente para ${materialDB.nombre}. Hay ${materialDB.stock_digital} y reportó haber gastado ${item.cantidad_fisica}.`);
  }
  // Se descuenta lo consumido del stock general
    materialDB.stock_digital = materialDB.stock_digital - item.cantidad_fisica;
  } 
    else if (materialDB.tipo === 'Herramienta') {
  // REGLA 2: LAS HERRAMIENTAS SE DEVUELVEN (Martillos, Palas, Cascos)
  // Aquí item.cantidad_perdida vendría del frontend si devolvieron menos de lo que llevaron
          
    if (item.cantidad_perdida > 0) {
  // Si se perdió una herramienta, el cliente EXIGE una justificación para dejar ir al bus
    if (!item.incidencia || item.incidencia.trim() === '') {
      throw new Error(`¡ALERTA! Faltan herramientas (${materialDB.nombre}). El bus no puede ser liberado hasta que notifique la incidencia exacta.`);
    }
  // Si se perdió, descontamos SOLO la cantidad perdida del inventario de la bodega
       materialDB.stock_digital = materialDB.stock_digital - item.cantidad_perdida;
      }
    }

  // Creamos el "Voucher" histórico, ahora incluyendo la incidencia si es que hubo
    const nuevoInventario = inventarioJornadaRepository.create({
    cantidad_fisica: item.cantidad_fisica,
    incidencia: item.incidencia || null, // Guardamos la excusa/reporte en la BD
    jornada: { id: jornada.id }, 
    material: { id: materialDB.id } 
  });
    await inventarioJornadaRepository.save(nuevoInventario);

  // Guardamos el nuevo stock en la bodega
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