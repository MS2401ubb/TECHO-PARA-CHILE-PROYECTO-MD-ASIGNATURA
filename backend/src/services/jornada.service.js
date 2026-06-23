import AppDataSource from '../config/configDb.js';
import { IsNull } from 'typeorm';
import Material from '../entities/material.entity.js';
import InventarioJornada from '../entities/inventarioJornada.entity.js';

export const finalizarJornadaService = async (idJornada, materialesContados) => {
  const listaMateriales = Array.isArray(materialesContados)
    ? materialesContados
    : materialesContados?.materiales;

  if (!Array.isArray(listaMateriales) || listaMateriales.length === 0) {
    throw new Error('Debe reportar al menos un material para finalizar la jornada.');
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const jornadaRepository = queryRunner.manager.getRepository('Jornada');
    const asignacionRepository = queryRunner.manager.getRepository('CuadrillaTrabajaEnVivienda');
    const materialRepository = queryRunner.manager.getRepository(Material);
    const inventarioJornadaRepository = queryRunner.manager.getRepository(InventarioJornada);

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
      throw new Error('No se puede finalizar la jornada: la vivienda no cuenta con la validación técnica requerida.');
    }

    for (const item of listaMateriales) {
      const idMaterial = Number(item?.id_material);
      const cantidadFisica = Number(item?.cantidad_fisica);

      if (!Number.isInteger(idMaterial) || idMaterial <= 0) {
        throw new Error('Cada material debe incluir un id_material válido.');
      }

      if (!Number.isInteger(cantidadFisica) || cantidadFisica <= 0) {
        throw new Error(`La cantidad física del material ${idMaterial} debe ser un entero positivo.`);
      }

      const materialDB = await materialRepository.findOne({
        where: { id: idMaterial }
      });

      if (!materialDB) {
        throw new Error(`El material con ID ${idMaterial} no existe en la bodega.`);
      }

      if (materialDB.stock_digital < cantidadFisica) {
        throw new Error(`Stock insuficiente para ${materialDB.nombre}. Hay ${materialDB.stock_digital} y reportó ${cantidadFisica}.`);
      }

      const nuevoInventario = inventarioJornadaRepository.create({
        cantidad_fisica: cantidadFisica,
        jornada: { id: jornada.id },
        material: { id: materialDB.id }
      });
      await inventarioJornadaRepository.save(nuevoInventario);

      materialDB.stock_digital = materialDB.stock_digital - cantidadFisica;
      await materialRepository.save(materialDB);
    }

    jornada.estado = 'Finalizada';
    await jornadaRepository.save(jornada);

    const asignacionActiva = await asignacionRepository.findOne({
      where: {
        codigoVivienda: jornada.vivienda.codigo,
        fechaFin: IsNull()
      }
    });

    if (asignacionActiva) {
      asignacionActiva.fechaFin = new Date();
      await asignacionRepository.save(asignacionActiva);
    }

    await queryRunner.commitTransaction();
    return { mensaje: 'Cierre administrativo y técnico completado con éxito.' };
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

export default { finalizarJornadaService };